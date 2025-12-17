
import React, { useState, useEffect } from "react";
import "./Auth.css";
import { type UserData } from "../App";

interface RegisterProps {
  onRegister: (userData: Omit<UserData, 'id'>) => void;
  onLoginClick: () => void;
  onHomeClick: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onLoginClick, onHomeClick }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    birth_date: "",
    password: "",
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (formData.full_name && formData.full_name.trim().length < 2) {
            newErrors.full_name = "Введіть повне ім'я.";
        }

        if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Некоректний формат пошти (повинен містити @ та домен).";
        }

        if (formData.password) {
            if (formData.password.length < 6) {
                newErrors.password = "Пароль повинен мати мінімум 6 символів.";
            }
        }
        
        if (formData.birth_date) {
            const today = new Date();
            const dob = new Date(formData.birth_date);
            today.setHours(0, 0, 0, 0); 
            if (dob > today) {
                newErrors.birth_date = "Дата народження не може бути в майбутньому.";
            }
        }

        setErrors(newErrors);

        const allFieldsFilled = Object.values(formData).every(value => value.trim() !== '');
        setIsFormValid(Object.keys(newErrors).length === 0 && allFieldsFilled);
    };

    validateForm();
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onRegister(formData);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container register-container">
        <h2>Зареєструватися</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
              <label htmlFor="full_name">ПІБ (Повне ім'я)</label>
              <input id="full_name" name="full_name" type="text" placeholder="Іванов Іван Іванович" value={formData.full_name} onChange={handleChange} required />
              <p className="error-text">{errors.full_name}&nbsp;</p>
          </div>

          <div className="form-group">
              <label htmlFor="email">Електронна пошта</label>
              <input id="email" name="email" type="email" placeholder="example@mail.com" value={formData.email} onChange={handleChange} required />
              <p className="error-text">{errors.email}&nbsp;</p>
          </div>

          <div className="form-group">
              <label htmlFor="birth_date">Дата народження</label>
              <input id="birth_date" name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} required />
              <p className="error-text">{errors.birth_date}&nbsp;</p>
          </div>

          <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input id="password" name="password" type="password" placeholder="Ваш пароль" value={formData.password} onChange={handleChange} required />
              <p className="error-text">{errors.password}&nbsp;</p>
          </div>

          <button type="submit" disabled={!isFormValid}>Зареєструватися</button>
        </form>
         <div className="auth-links">
          <button type="button" onClick={onHomeClick} className="btn home-link-btn">На головну</button>
          <p>
              Вже є акаунт?{' '}
              <button type="button" onClick={onLoginClick} className="link-btn">
                  Увійти
              </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
