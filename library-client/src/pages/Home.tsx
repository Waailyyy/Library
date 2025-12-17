
import React, { useEffect, useState, useCallback } from "react";
import "./Home.css";
import "../css/BookCard.css"; 
import { useCart, type Book } from "./CartContext";
import { type UserData } from "../App";

interface HomeProps {
  onCartClick: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onAdminClick: () => void;
  loggedInUser: UserData | null;
  onLogout: () => void;
}

const Home: React.FC<HomeProps> = ({ onCartClick, onLoginClick, onRegisterClick, onAdminClick, loggedInUser, onLogout }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost/library_api/get_books.php");
      
      if (!response.ok) {
          throw new Error(`HTTP помилка: ${response.status}`);
      }

      const responseText = await response.text();
      let data;
      try {
          data = JSON.parse(responseText);
      } catch (e) {
          console.error("Невалідний JSON:", responseText);
          throw new Error("Помилка обробки даних сервера.");
      }
      
      if (data.error) throw new Error(data.error);
      
      if (Array.isArray(data)) {
        // Сортуємо книги: нові (з більшим ID) спочатку
        const sortedBooks = data.sort((a: Book, b: Book) => b.id - a.id);
        setBooks(sortedBooks);
        setFilteredBooks(sortedBooks);
      } else {
        throw new Error("Некоректний формат даних.");
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("Failed to fetch")) {
          setError("Помилка з'єднання. Перевірте, чи запущено API.");
      } else {
          setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = books.filter(book => 
        book.title.toLowerCase().includes(lowerTerm) || 
        book.author.toLowerCase().includes(lowerTerm)
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  return (
    <div className="home">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">
            <span className="logo-icon">📚</span> LIB<span className="text-highlight">RARY</span>
        </div>
        <div className="nav-links">
            <button className="btn-nav icon-btn" onClick={onCartClick} title="Кошик">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            </button>
            {loggedInUser ? (
                <div className="nav-user-wrapper">
                    <span className="nav-user-info">{loggedInUser.full_name}</span>
                    <button className="btn-nav outline" onClick={onLogout}>Вихід</button>
                </div>
            ) : (
                <div className="auth-buttons">
                    <button className="btn-nav" onClick={onLoginClick}>Вхід</button>
                    <button className="btn-nav primary" onClick={onRegisterClick}>Реєстрація</button>
                </div>
            )}
            <button className="btn-nav icon-btn admin-btn" onClick={onAdminClick} title="Панель співробітника">
                 {/* Changed from Microphone to Lock icon */}
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-bg-glow"></div>
        <div className="hero-content">
            <h1 className="hero-title">Майбутнє <br/> починається з книги</h1>
            <p className="hero-subtitle">
                Електронний каталог бібліотеки нового покоління. <br/>
                Доступ до знань 24/7.
            </p>
            
            <div className="search-bar-container">
                <div className="search-input-wrapper">
                    <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input 
                        type="text" 
                        placeholder="Пошук за назвою або автором..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="books-wrapper">
        <div className="section-header">
            <h2 className="section-title">Каталог видань</h2>
            <div className="results-count">{filteredBooks.length} книг доступно</div>
        </div>

        {loading && <div className="loading-message"><div className="loader"></div> Завантаження бібліотеки...</div>}

        {error && (
            <div className="error-message">
                <div className="error-icon">⚠️</div>
                <h3>Виникла помилка</h3>
                <p>{error}</p>
                <button className="btn-retry" onClick={fetchBooks}>Спробувати ще раз</button>
            </div>
        )}

        {!loading && !error && filteredBooks.length === 0 && (
            <div className="empty-message">
                <h3>Нічого не знайдено</h3>
                <p>Спробуйте змінити параметри пошуку або завітайте пізніше.</p>
            </div>
        )}

        <div className="books-container">
            {filteredBooks.map((book) => (
            <div key={book.id} className="book-card">
                <div className="book-card-image-wrapper">
                    <img
                        src={book.cover_image}
                        alt={book.title}
                        className="book-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/240x320?text=No+Cover';
                        }}
                    />
                    {book.genre && <span className="book-badge">{book.genre}</span>}
                </div>
                
                <div className="book-info">
                    <h3 className="book-title" title={book.title}>{book.title}</h3>
                    <p className="book-author">{book.author}</p>
                </div>

                <div className="book-footer">
                    <div className="book-price-tag">
                        {book.price !== undefined ? `${Number(book.price).toFixed(0)} ₴` : ''}
                    </div>
                    
                    {(book.quantity !== undefined && book.quantity > 0) ? (
                        <button
                        className="btn-add-cart"
                        onClick={() => addToCart(book)}
                        title="Додати в кошик"
                        >
                        В кошик
                        </button>
                    ) : (
                        <span className="out-of-stock">Немає в наявності</span>
                    )}
                </div>
            </div>
            ))}
        </div>
      </div>
      
      <footer className="footer">
         <p>© 2023 Library System. Всі права захищено.</p>
      </footer>
    </div>
  );
};

export default Home;
