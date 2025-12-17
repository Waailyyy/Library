
import React, { useState, useEffect, useCallback } from 'react';
import './AdminPanel.css';
import { type AdminData } from '../App';
import { type Book } from './CartContext';
import BookModal from './BookModal';
import { useNotification } from '../components/NotificationProvider';

// Розширюємо інтерфейс книги для статистики популярності
interface AdminBook extends Book {
    issue_count?: number;
}

interface Author {
    id: number;
    full_name: string;
    birth_year?: number | null; // Зробили поле необов'язковим
    death_year?: number | null;
}

interface Genre {
    id: number;
    name: string;
}

interface Issue {
    id: number;
    book_title: string;
    reader_name: string;
    issue_date: string;
    return_date: string;
    status: string;
}

interface AdminPanelProps {
  admin: AdminData;
  onLogout: () => void;
}

type TabType = 'books' | 'authors' | 'genres' | 'orders' | 'create_admin';
type SortType = 'default' | 'price_asc' | 'price_desc' | 'pop_high' | 'pop_low';
type IdSortOrder = 'asc' | 'desc';

const AdminPanel: React.FC<AdminPanelProps> = ({ admin, onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabType>('books');
  
  // --- Data States ---
  const [books, setBooks] = useState<AdminBook[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  
  // --- UI States ---
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [sortType, setSortType] = useState<SortType>('default');
  
  // --- Sorting States for Authors and Genres ---
  const [authorSort, setAuthorSort] = useState<IdSortOrder>('asc');
  const [genreSort, setGenreSort] = useState<IdSortOrder>('asc');
  
  // --- Forms States ---
  const [newAdminData, setNewAdminData] = useState({ username: '', password: '', full_name: '' });
  const [newAuthorData, setNewAuthorData] = useState({ full_name: '', birth_year: '', death_year: '' });
  const [newGenreName, setNewGenreName] = useState('');

  const addNotification = useNotification();

  // --- Fetching Functions Helper ---
  const fetchData = async (url: string, setter: (data: any) => void, errorMsg: string) => {
      try {
          const response = await fetch(url);
          const text = await response.text();
          
          let data;
          try {
              data = JSON.parse(text);
          } catch (e) {
              console.error(`Failed to parse JSON from ${url}:`, text);
              // Якщо PHP повернув Fatal Error, текст буде містити HTML або стек помилки
              if (text.includes("Fatal error") || text.includes("Exception")) {
                   // Спробуємо вирізати повідомлення про помилку, якщо це можливо, або показати початок
                   const cleanText = text.replace(/<[^>]*>?/gm, '').substring(0, 200);
                   throw new Error(`PHP Error: ${cleanText}...`);
              }
              throw new Error(`Сервер повернув невалідні дані. Див. консоль.`);
          }

          if (data && data.error) {
              throw new Error(data.error);
          }

          if (Array.isArray(data)) {
              setter(data);
          } else {
               if (data && !data.success && !Array.isArray(data)) {
                   console.warn("Unexpected data format:", data);
               }
          }
      } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          addNotification(`${errorMsg}: ${msg}`);
      }
  };

  // --- Fetching Functions ---

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    await fetchData('http://localhost/library_api/get_books.php', setBooks, 'Не вдалося завантажити книги');
    setIsLoading(false);
  }, [addNotification]);

  const fetchAuthors = useCallback(async () => {
    setIsLoading(true);
    await fetchData('http://localhost/library_api/get_authors.php', setAuthors, 'Не вдалося завантажити авторів');
    setIsLoading(false);
  }, [addNotification]);

  const fetchGenres = useCallback(async () => {
    setIsLoading(true);
    await fetchData('http://localhost/library_api/get_genres.php', setGenres, 'Не вдалося завантажити жанри');
    setIsLoading(false);
  }, [addNotification]);

  const fetchIssues = useCallback(async () => {
    setIsLoading(true);
    await fetchData('http://localhost/library_api/get_issues.php', setIssues, 'Не вдалося завантажити історію');
    setIsLoading(false);
  }, [addNotification]);

  // --- Load data on tab switch ---
  useEffect(() => {
      switch (activeTab) {
          case 'books': fetchBooks(); break;
          case 'authors': fetchAuthors(); break;
          case 'genres': fetchGenres(); break;
          case 'orders': fetchIssues(); break;
      }
  }, [activeTab, fetchBooks, fetchAuthors, fetchGenres, fetchIssues]);

  // --- Logic: Books ---

  const getSortedBooks = () => {
      let sorted = [...books];
      switch (sortType) {
          case 'price_asc': return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
          case 'price_desc': return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
          case 'pop_high': return sorted.sort((a, b) => (b.issue_count || 0) - (a.issue_count || 0));
          case 'pop_low': return sorted.sort((a, b) => (a.issue_count || 0) - (b.issue_count || 0));
          default: return sorted; // Usually by ID desc from DB
      }
  };

  const handleEditBook = (book: Book) => {
      setEditingBook(book);
      setIsModalOpen(true);
  };

  const handleAddBookClick = () => {
      setEditingBook(null);
      setIsModalOpen(true);
  };

  const handleDeleteBook = async (id: number) => {
      if(!window.confirm('Видалити цю книгу?')) return;
      try {
          const res = await fetch('http://localhost/library_api/delete_book.php', {
              method: 'POST',
              body: JSON.stringify({ id })
          });
          const result = await res.json();
          if(result.success) { addNotification('Книгу видалено'); fetchBooks(); }
          else addNotification('Помилка: ' + result.error);
      } catch(e) { addNotification('Помилка видалення'); }
  };

  // --- Logic: Authors ---

  const handleAddAuthor = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const res = await fetch('http://localhost/library_api/add_author.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newAuthorData)
          });
          const text = await res.text();
          let result;
          try { result = JSON.parse(text); } catch(e) { throw new Error(text); }
          
          if(result.success) {
              addNotification('Автора додано');
              setNewAuthorData({ full_name: '', birth_year: '', death_year: '' });
              fetchAuthors();
          } else addNotification(result.error || 'Помилка');
      } catch(e) { 
          const msg = e instanceof Error ? e.message : String(e);
          addNotification('Не вдалося додати автора: ' + msg); 
      }
  };

  const handleDeleteAuthor = async (id: number) => {
      if(!window.confirm('Видалити автора?')) return;
      try {
          const res = await fetch('http://localhost/library_api/delete_author.php', {
              method: 'POST',
              body: JSON.stringify({ id })
          });
          const result = await res.json();
          if(result.success) { addNotification('Автора видалено'); fetchAuthors(); }
          else addNotification(result.error || 'Помилка');
      } catch(e) { addNotification('Помилка видалення'); }
  };

  // --- Logic: Genres ---

  const handleAddGenre = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const res = await fetch('http://localhost/library_api/add_genre.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: newGenreName })
          });
          const result = await res.json();
          if(result.success) {
              addNotification('Жанр додано');
              setNewGenreName('');
              fetchGenres();
          } else addNotification(result.error || 'Помилка');
      } catch(e) { addNotification('Не вдалося додати жанр'); }
  };

  const handleDeleteGenre = async (id: number) => {
      if(!window.confirm('Видалити жанр?')) return;
      try {
          const res = await fetch('http://localhost/library_api/delete_genre.php', {
              method: 'POST',
              body: JSON.stringify({ id })
          });
          const result = await res.json();
          if(result.success) { addNotification('Жанр видалено'); fetchGenres(); }
          else addNotification(result.error || 'Помилка');
      } catch(e) { addNotification('Помилка видалення'); }
  };

  // --- Logic: Admins ---

  const handleCreateAdmin = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const response = await fetch('http://localhost/library_api/add_admin.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newAdminData)
          });
          const result = await response.json();
          if (result.success) {
              addNotification('Нового адміністратора створено!');
              setNewAdminData({ username: '', password: '', full_name: '' });
          } else {
              addNotification(`Помилка: ${result.error}`);
          }
      } catch (e) { addNotification('Помилка при створенні адміністратора'); }
  };

  // --- Renderers ---

  const renderBooks = () => (
      <div className="tab-content fade-in">
          <div className="filters-bar">
              <button className="btn btn-add" onClick={handleAddBookClick}>+ Додати нову книгу</button>
              <div className="sort-control">
                  <label>Сортування: </label>
                  <select value={sortType} onChange={(e) => setSortType(e.target.value as SortType)}>
                      <option value="default">За замовчуванням (новіші)</option>
                      <option value="price_asc">Від найдешевшої</option>
                      <option value="price_desc">Від найдорожчої</option>
                      <option value="pop_high">Більше всього замовлено (Популярні)</option>
                      <option value="pop_low">Найменше всього замовлено</option>
                  </select>
              </div>
          </div>
          <div className="admin-table-container">
              <table className="admin-table">
                  <thead>
                      <tr>
                          <th>ID</th>
                          <th>Обкладинка</th>
                          <th>Назва</th>
                          <th>Автор</th>
                          <th>Жанр</th>
                          <th>Ціна</th>
                          <th>Склад</th>
                          <th>Дії</th>
                      </tr>
                  </thead>
                  <tbody>
                      {getSortedBooks().map(book => (
                          <tr key={book.id}>
                              <td>{book.id}</td>
                              <td><img src={book.cover_image} alt="" className="table-thumb"/></td>
                              <td>{book.title}</td>
                              <td>{book.author}</td>
                              <td>{book.genre || '-'}</td>
                              <td>{book.price} грн</td>
                              <td>{book.quantity}</td>
                              <td className="table-actions">
                                  <button className="btn-edit-icon" onClick={() => handleEditBook(book)} title="Редагувати">✎</button>
                                  <button className="btn-delete-icon" onClick={() => handleDeleteBook(book.id)} title="Видалити">🗑</button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );

  const renderAuthors = () => {
      // Sort authors based on state
      const sortedAuthors = [...authors].sort((a, b) => {
          return authorSort === 'asc' ? a.id - b.id : b.id - a.id;
      });

      return (
      <div className="tab-content fade-in">
          <div className="add-entity-form">
              <h3>Додати автора</h3>
              <form onSubmit={handleAddAuthor} className="inline-form">
                  <input type="text" placeholder="ПІБ Автора" value={newAuthorData.full_name} 
                      onChange={e => setNewAuthorData({...newAuthorData, full_name: e.target.value})} required />
                  <input type="number" placeholder="Рік народження" value={newAuthorData.birth_year} 
                      onChange={e => setNewAuthorData({...newAuthorData, birth_year: e.target.value})} required />
                  <input type="number" placeholder="Рік смерті (необов'язково)" value={newAuthorData.death_year} 
                      onChange={e => setNewAuthorData({...newAuthorData, death_year: e.target.value})} />
                  <button type="submit" className="btn btn-add">Додати</button>
              </form>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
              <button 
                className="btn-secondary" 
                onClick={() => setAuthorSort(prev => prev === 'asc' ? 'desc' : 'asc')}
                style={{ fontSize: '0.85rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                 <span>Сортування ID:</span> 
                 <strong>{authorSort === 'asc' ? '▲ 1-9' : '▼ 9-1'}</strong>
              </button>
          </div>

          <div className="admin-table-container">
              <table className="admin-table">
                  <thead><tr><th>ID</th><th>Ім'я</th><th>Роки життя</th><th>Дії</th></tr></thead>
                  <tbody>
                      {sortedAuthors.map(a => (
                          <tr key={a.id}>
                              <td>{a.id}</td>
                              <td>{a.full_name}</td>
                              <td>{a.birth_year || '?'} - {a.death_year || '...'}</td>
                              <td><button className="btn-delete-icon" onClick={() => handleDeleteAuthor(a.id)}>🗑</button></td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
      );
  };

  const renderGenres = () => {
      // Sort genres based on state
      const sortedGenres = [...genres].sort((a, b) => {
          return genreSort === 'asc' ? a.id - b.id : b.id - a.id;
      });

      return (
      <div className="tab-content fade-in">
          <div className="add-entity-form">
              <h3>Додати жанр</h3>
              <form onSubmit={handleAddGenre} className="inline-form">
                  <input type="text" placeholder="Назва жанру" value={newGenreName} 
                      onChange={e => setNewGenreName(e.target.value)} required />
                  <button type="submit" className="btn btn-add">Додати</button>
              </form>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
              <button 
                className="btn-secondary" 
                onClick={() => setGenreSort(prev => prev === 'asc' ? 'desc' : 'asc')}
                style={{ fontSize: '0.85rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                 <span>Сортування ID:</span> 
                 <strong>{genreSort === 'asc' ? '▲ 1-9' : '▼ 9-1'}</strong>
              </button>
          </div>

          <div className="admin-table-container">
              <table className="admin-table">
                  <thead><tr><th>ID</th><th>Назва</th><th>Дії</th></tr></thead>
                  <tbody>
                      {sortedGenres.map(g => (
                          <tr key={g.id}>
                              <td>{g.id}</td>
                              <td>{g.name}</td>
                              <td><button className="btn-delete-icon" onClick={() => handleDeleteGenre(g.id)}>🗑</button></td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
      );
  };

  const renderOrders = () => (
      <div className="tab-content fade-in">
          <h3>Історія видачі книг (Issue)</h3>
          <div className="admin-table-container">
              <table className="admin-table">
                  <thead>
                      <tr><th>ID</th><th>Книга</th><th>Читач</th><th>Дата видачі</th><th>Дата повернення</th><th>Статус</th></tr>
                  </thead>
                  <tbody>
                      {issues.map(i => (
                          <tr key={i.id}>
                              <td>{i.id}</td>
                              <td>{i.book_title}</td>
                              <td>{i.reader_name}</td>
                              <td>{i.issue_date}</td>
                              <td>{i.return_date}</td>
                              <td><span className={`status-badge ${i.status}`}>{i.status}</span></td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );

  const renderCreateAdmin = () => (
      <div className="tab-content fade-in">
          <div className="create-admin-wrapper">
              <h3>Реєстрація нового адміністратора</h3>
              <form onSubmit={handleCreateAdmin} className="admin-form stacked-form">
                  <div className="form-group">
                      <label>Логін (username)</label>
                      <input type="text" value={newAdminData.username}
                          onChange={e => setNewAdminData({...newAdminData, username: e.target.value})} required />
                  </div>
                  <div className="form-group">
                      <label>Повне ім'я</label>
                      <input type="text" value={newAdminData.full_name}
                          onChange={e => setNewAdminData({...newAdminData, full_name: e.target.value})} required />
                  </div>
                  <div className="form-group">
                      <label>Пароль</label>
                      <input type="password" value={newAdminData.password}
                          onChange={e => setNewAdminData({...newAdminData, password: e.target.value})} required />
                  </div>
                  <button type="submit" className="btn btn-add full-width">Створити адміна</button>
              </form>
          </div>
      </div>
  );

  return (
    <div className="admin-wrapper">
      <div className="admin-panel-container">
        <div className="admin-panel-header">
          <div className="admin-welcome">
              <h1>Admin Dashboard</h1>
              <p>Вітаємо, {admin.full_name}</p>
          </div>
          <button onClick={onLogout} className="btn-logout">Вийти</button>
        </div>

        <div className="admin-tabs">
            <button className={activeTab === 'books' ? 'active' : ''} onClick={() => setActiveTab('books')}>📚 Книги</button>
            <button className={activeTab === 'authors' ? 'active' : ''} onClick={() => setActiveTab('authors')}>✍️ Автори</button>
            <button className={activeTab === 'genres' ? 'active' : ''} onClick={() => setActiveTab('genres')}>🎭 Жанри</button>
            <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>📦 Замовлення</button>
            <button className={activeTab === 'create_admin' ? 'active' : ''} onClick={() => setActiveTab('create_admin')}>👤 Новий Адмін</button>
        </div>

        <div className="admin-panel-content">
            {isLoading ? <div className="loading-spinner">Завантаження даних...</div> : (
                <>
                    {activeTab === 'books' && renderBooks()}
                    {activeTab === 'authors' && renderAuthors()}
                    {activeTab === 'genres' && renderGenres()}
                    {activeTab === 'orders' && renderOrders()}
                    {activeTab === 'create_admin' && renderCreateAdmin()}
                </>
            )}
        </div>
      </div>
      
      {isModalOpen && (
        <BookModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            book={editingBook}
            onSave={() => { setIsModalOpen(false); fetchBooks(); }}
        />
      )}
    </div>
  );
};

export default AdminPanel;
