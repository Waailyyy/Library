import React, { useState } from 'react';
import { type Book } from '../pages/CartContext';
import BookModal from './BookModal';
import { useNotification } from '../components/NotificationProvider';

interface AdminBooksProps {
    books: Book[];
    onDataChange: () => void;
}

const AdminBooks: React.FC<AdminBooksProps> = ({ books, onDataChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const addNotification = useNotification();

    const handleAddBook = () => {
        setEditingBook(null);
        setIsModalOpen(true);
    };

    const handleEditBook = (book: Book) => {
        setEditingBook(book);
        setIsModalOpen(true);
    };

    const handleDeleteBook = async (bookId: number) => {
        if (!window.confirm("Ви впевнені, що хочете видалити цю книгу? Цю дію не можна буде скасувати.")) {
            return;
        }

        try {
            const response = await fetch('http://localhost/library_api/delete_book.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: bookId })
            });

            const responseText = await response.text();
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (error) {
                console.error("Failed to parse JSON response:", responseText);
                throw new Error("Сервер повернув некоректну відповідь. Перевірте консоль для деталей.");
            }

            if (response.ok && result.success) {
                addNotification('Книгу успішно видалено.');
                onDataChange();
            } else {
                throw new Error(result.error || 'Не вдалося видалити книгу.');
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Сталася невідома помилка.';
            addNotification(`Помилка: ${errorMessage}`);
        }
    };

    return (
        <div>
            <div className="tab-header">
                <h2>Керування книгами</h2>
                <button className="btn btn-add" onClick={handleAddBook}>Додати нову книгу</button>
            </div>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Обкладинка</th>
                            <th>ID</th>
                            <th>Назва</th>
                            <th>Автор</th>
                            <th>Ціна (грн)</th>
                            <th>На складі</th>
                            <th className="table-actions">Дії</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => (
                            <tr key={book.id}>
                                <td><img src={book.cover_image} alt={book.title} width="50" style={{borderRadius: '4px'}} /></td>
                                <td>{book.id}</td>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.price?.toFixed(2)}</td>
                                <td>{book.quantity}</td>
                                <td className="table-actions">
                                    <button className="btn btn-edit" onClick={() => handleEditBook(book)}>Редагувати</button>
                                    <button className="btn btn-delete" onClick={() => handleDeleteBook(book.id)}>Видалити</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <BookModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    book={editingBook}
                    onSave={() => {
                        setIsModalOpen(false);
                        onDataChange();
                    }}
                />
            )}
        </div>
    );
};

export default AdminBooks;