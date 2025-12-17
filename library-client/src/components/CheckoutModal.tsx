import React, { useState, useEffect } from 'react';
import '../css/CheckoutModal.css';
import { type UserData } from '../App';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOrderSubmit: (customerData: { 
        full_name: string; 
        email: string 
    }) => void;
    isProcessing: boolean;
    loggedInUser: UserData | null;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderSubmit, isProcessing, loggedInUser }) => {
    const [full_name, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const isValid = full_name.trim() !== '' && email.trim() !== '';
        setIsFormValid(isValid);
    }, [full_name, email]);
    
    useEffect(() => {
        if (isOpen && loggedInUser) {
            setFullName(loggedInUser.full_name || '');
            setEmail(loggedInUser.email || '');
        } else if (!isOpen) {
            setFullName('');
            setEmail('');
        }
    }, [isOpen, loggedInUser]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid && !isProcessing) {
            onOrderSubmit({ full_name, email });
        }
    };

    return (
        <div className="modal-overlay" onClick={isProcessing ? undefined : onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Оформлення замовлення</h2>
                    <button onClick={isProcessing ? undefined : onClose} className="close-button" disabled={isProcessing}>&times;</button>
                </div>
                <form className="checkout-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="full_name">ПІБ</label>
                        <input 
                            type="text" 
                            id="full_name" 
                            value={full_name} 
                            onChange={(e) => setFullName(e.target.value)} 
                            required 
                            disabled={isProcessing}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Пошта</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            disabled={isProcessing}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={onClose} disabled={isProcessing}>Скасувати</button>
                        <button type="submit" className="btn-primary" disabled={!isFormValid || isProcessing}>
                            {isProcessing ? 'Обробка...' : 'Підтвердити замовлення'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutModal;