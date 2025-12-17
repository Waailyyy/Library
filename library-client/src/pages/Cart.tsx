import React, { useState } from 'react';
import { useCart } from './CartContext';
import './Cart.css';
import CheckoutModal from '../components/CheckoutModal';
import { useNotification } from '../components/NotificationProvider';
import { type UserData } from '../App';

interface CartProps {
    onHomeClick: () => void;
    loggedInUser: UserData | null;
}

const Cart: React.FC<CartProps> = ({ onHomeClick, loggedInUser }) => {
  const { cartItems, removeFromCart, addToCart, clearCart } = useCart();
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);
  const addNotification = useNotification();
  const [isProcessing, setIsProcessing] = useState(false);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price! * item.quantity), 0).toFixed(2);
  };

  const handleOrderSubmit = async (customerData: { full_name: string, email: string }) => {
    setIsProcessing(true);
    
    const orderData = {
        customer: {
            ...customerData,
            reader_id: loggedInUser?.id || null 
        },
        items: cartItems.map(item => ({ id: item.id, quantity: item.quantity, price: item.price })),
        total: getTotalPrice()
    };

    try {
        const response = await fetch("http://localhost/library_api/process_order.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
        });

        const responseText = await response.text();
        let result;

        try {
            result = JSON.parse(responseText);
        } catch (error) {
            console.error("Server returned non-JSON response:", responseText);
            throw new Error("Сервер повернув некоректну відповідь. Перевірте консоль для деталей.");
        }

        if (response.ok && result.success) {
            addNotification("Ваше замовлення успішно оформлено!", { duration: 'persistent' });
            clearCart();
            setIsCheckoutVisible(false);
        } else {
            throw new Error(result.error || `Помилка сервера (status: ${response.status})`);
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Не вдалося обробити замовлення. Спробуйте пізніше.";
        console.error("Помилка оформлення замовлення:", error);
        addNotification(`Помилка: ${errorMessage}`);
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="cart-container">
        <div className="cart-header">
          <h2>Ваш кошик</h2>
          <button className="btn-secondary" onClick={onHomeClick}>
              Продовжити покупки
          </button>
        </div>

        {cartItems.length === 0 ? (
          <p className="cart-empty">Ваш кошик порожній</p>
        ) : (
          <div className="cart-items-list">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.cover_image} alt={item.title} className="cart-item-cover" />
                <div className="cart-item-details">
                  <h3>{item.title}</h3>
                  <p>{item.author}</p>
                  <p>Ціна: {item.price} грн</p>
                </div>
                <div className="cart-item-actions">
                   <button onClick={() => removeFromCart(item.id)}>-</button>
                   <span>{item.quantity}</span>
                   <button onClick={() => addToCart(item)}>+</button>
                </div>
                <div className="cart-item-total">
                  {(item.price! * item.quantity).toFixed(2)} грн
                </div>
              </div>
            ))}
            <div className="cart-summary">
              <h3>Загалом: {getTotalPrice()} грн</h3>
              <button 
                className="btn-primary" 
                onClick={() => setIsCheckoutVisible(true)}
                disabled={isProcessing}
              >
                {isProcessing ? "Обробка..." : "Оформити замовлення"}
              </button>
            </div>
          </div>
        )}
      </div>
      <CheckoutModal 
        isOpen={isCheckoutVisible} 
        onClose={() => setIsCheckoutVisible(false)}
        onOrderSubmit={handleOrderSubmit}
        isProcessing={isProcessing}
        loggedInUser={loggedInUser}
      />
    </>
  );
};

export default Cart;