import React, { useState, useEffect } from 'react';
import '../css/CheckoutModal.css'; // Reusing some styles
import { useNotification } from '../components/NotificationProvider';
import { type Book } from '../pages/CartContext';

interface BookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    book?: Book | null;
}

interface Genre {
    id: number;
    name: string;
}

const BookModal: React.FC<BookModalProps> = ({ isOpen, onClose, onSave, book }) => {
    const isEditMode = !!book;

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        price: '0',
        quantity: '0',
        genre_id: '',
    });
    
    const [genres, setGenres] = useState<Genre[]>([]);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const addNotification = useNotification();

    // Fetch genres on mount
    useEffect(() => {
        if (isOpen) {
            fetch('http://localhost/library_api/get_genres.php')
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setGenres(data);
                })
                .catch(err => console.error("Failed to load genres", err));
        }
    }, [isOpen]);

    useEffect(() => {
        if (isEditMode && book) {
            setFormData({
                title: book.title || '',
                author: book.author || '',
                price: book.price?.toString() || '0',
                quantity: book.quantity?.toString() || '0',
                // Now using direct genre_id from backend which is reliable
                genre_id: book.genre_id ? book.genre_id.toString() : '',
            });
        } else {
            setFormData({ title: '', author: '', price: '0', quantity: '0', genre_id: '' });
        }
        setCoverImage(null);
    }, [book, isEditMode, isOpen, genres]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        if (!isEditMode && !coverImage) {
            addNotification("Помилка: Обкладинка є обов'язковою для нової книги.");
            setIsProcessing(false);
            return;
        }

        const apiEndpoint = isEditMode
            ? 'http://localhost/library_api/update_book.php'
            : 'http://localhost/library_api/add_book.php';
            
        const submissionData = new FormData();
        submissionData.append('title', formData.title);
        submissionData.append('author', formData.author);
        submissionData.append('price', formData.price);
        submissionData.append('quantity', formData.quantity);
        submissionData.append('genre_id', formData.genre_id);

        if (isEditMode && book) {
            submissionData.append('id', String(book.id));
        }
        if (coverImage) {
            submissionData.append('cover_image', coverImage);
        }

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                body: submissionData,
            });

            const responseText = await response.text();
            let result;

            try {
                result = JSON.parse(responseText);
            } catch (jsonError) {
                console.error("Failed to parse JSON response:", responseText);
                throw new Error("Сервер повернув помилку (можливо PHP Fatal Error).");
            }

            if (response.ok && result.success) {
                addNotification(isEditMode ? 'Книгу успішно оновлено!' : 'Книгу успішно додано!');
                onSave();
            } else {
                throw new Error(result.error || 'Сталася помилка на сервері.');
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Не вдалося зберегти книгу.';
            addNotification(`Помилка: ${message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={isProcessing ? undefined : onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isEditMode ? 'Редагувати книгу' : 'Додати нову книгу'}</h2>
                    <button onClick={isProcessing ? undefined : onClose} className="close-button" disabled={isProcessing}>&times;</button>
                </div>
                <form className="checkout-form book-modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Назва</label>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required disabled={isProcessing} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="author">Автор (ПІБ)</label>
                        <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} required disabled={isProcessing} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="genre_id">Жанр</label>
                        <select id="genre_id" name="genre_id" value={formData.genre_id} onChange={handleChange} required disabled={isProcessing} style={{padding: '10px', borderRadius: '6px', border: '1px solid #ccc'}}>
                            <option value="">-- Оберіть жанр --</option>
                            {genres.map(g => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>
                        {genres.length === 0 && <small style={{color: '#666'}}>Завантаження жанрів або список порожній...</small>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Ціна (грн)</label>
                        <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" disabled={isProcessing} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity">Кількість на складі</label>
                        <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} required min="0" step="1" disabled={isProcessing} />
                    </div>
                     <div className="form-group">
                        <label htmlFor="cover_image">Обкладинка {isEditMode ? '(завантажте, щоб змінити)' : "(обов'язково)"}</label>
                        <input type="file" id="cover_image" name="cover_image" onChange={handleFileChange} accept="image/*" required={!isEditMode} disabled={isProcessing} />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={onClose} disabled={isProcessing}>Скасувати</button>
                        <button type="submit" className="btn-primary" disabled={isProcessing}>
                            {isProcessing ? (isEditMode ? 'Збереження...' : 'Додавання...') : (isEditMode ? 'Зберегти зміни' : 'Додати книгу')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookModal;