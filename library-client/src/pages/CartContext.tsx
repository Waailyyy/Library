
import React, { createContext, useState, useContext, type ReactNode } from 'react';
import { useNotification } from '../components/NotificationProvider';

// Define and export the Book interface here
export interface Book {
  id: number;
  title: string;
  author: string;
  cover_image: string;
  price?: number;
  quantity?: number;
  genre?: string; // Додано поле жанру
  genre_id?: number; // ID жанру для редагування
}

// Define the structure of an item in the cart
interface CartItem extends Book {
  quantity: number;   // Кількість, яку користувач додав у кошик
  maxStock: number;   // Реальна кількість, яка доступна на складі (зберігаємо окремо)
}

// Define the context type
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: number) => void;
  clearCart: () => void;
}

// Create the context with a default value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create the provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const addNotification = useNotification();

  const addToCart = (book: Book) => {
    if (book.price === undefined || book.price === null) {
      console.error("Attempted to add a book without a price to the cart:", book);
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === book.id);

      if (existingItem) {
        // Логіка для товару, який ВЖЕ є в кошику.
        // Ми використовуємо existingItem.maxStock як джерело правди про ліміт,
        // тому що вхідний об'єкт 'book' може прийти з кошика, де quantity = кількості в кошику (а не на складі).
        
        if (existingItem.quantity >= existingItem.maxStock) {
          // Важливо: викликаємо нотифікацію, але не тут, бо це всередині setState (чиста функція).
          // Проте для простоти в React 18 це допустимо, або можна винести перевірку назовні.
          // Щоб уникнути подвійного рендеру нотифікації, краще перевірити це ДО сеттера, 
          // але оскільки нам потрібен доступ до актуального prevItems, робимо це тут обережно
          // або використовуємо setTimeout щоб вийти з циклу рендеру.
          setTimeout(() => addNotification(`Ліміт на складі (${existingItem.maxStock} шт.) вичерпано.`), 0);
          return prevItems; // Повертаємо стан без змін
        }

        return prevItems.map(item =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Логіка для НОВОГО товару.
        // Тут book.quantity - це дані з каталогу (реальний склад).
        const stockLimit = book.quantity || 0;

        if (stockLimit <= 0) {
           setTimeout(() => addNotification(`На жаль, книга "${book.title}" закінчилася.`), 0);
           return prevItems;
        }

        setTimeout(() => addNotification(`Книгу "${book.title}" додано до кошика!`), 0);
        
        // Зберігаємо quantity як maxStock, а в quantity ставимо 1 (перший доданий екземпляр)
        return [...prevItems, { ...book, quantity: 1, maxStock: stockLimit }];
      }
    });
  };

  const removeFromCart = (bookId: number) => {
    setCartItems(prevItems => {
      const itemExists = prevItems.find(item => item.id === bookId);
      if (itemExists && itemExists.quantity > 1) {
        // If quantity is more than 1, decrease it
        return prevItems.map(item =>
          item.id === bookId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      // If quantity is 1, remove the item completely
      return prevItems.filter(item => item.id !== bookId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
