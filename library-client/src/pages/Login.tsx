
import React, { useState } from "react";
import "./Auth.css";
import { useNotification } from "../components/NotificationProvider";

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onRegisterClick: () => void;
  onHomeClick: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onRegisterClick, onHomeClick }) => {
  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Recovery State
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryData, setRecoveryData] = useState({
    full_name: "",
    email: "",
    new_password: ""
  });

  const addNotification = useNotification();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await fetch("http://localhost/library_api/reset_password.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(recoveryData),
        });
        
        const responseText = await response.text();
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            console.error("Failed to parse JSON:", responseText);
            throw new Error("Сервер повернув помилку.");
        }

        if (result.success) {
            addNotification("Пароль успішно змінено! Тепер ви можете увійти.", { duration: 5000 });
            setIsRecovering(false); // Return to login screen
            setRecoveryData({ full_name: "", email: "", new_password: "" });
        } else {
            addNotification(`Помилка: ${result.error}`);
        }
    } catch (error) {
        const msg = error instanceof Error ? error.message : "Не вдалося змінити пароль.";
        addNotification(msg);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {!isRecovering ? (
          // --- LOGIN FORM ---
          <>
            <h2>Увійти</h2>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                  <label htmlFor="login-email">Email</label>
                  <input
                  id="login-email"
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  />
              </div>
              <div className="form-group">
                  <label htmlFor="login-password">Пароль</label>
                  <input
                  id="login-password"
                  type="password"
                  placeholder="Введіть пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  />
              </div>
              <button type="submit">Увійти</button>
            </form>
            
            <button 
              type="button" 
              className="link-btn forgot-password-link" 
              onClick={() => setIsRecovering(true)}
            >
              Забули пароль?
            </button>

            <div className="auth-links">
              <button type="button" onClick={onHomeClick} className="btn home-link-btn">На головну</button>
              <p>
                  Немає акаунту?{' '}
                  <button type="button" onClick={onRegisterClick} className="link-btn">
                      Зареєструватися
                  </button>
              </p>
            </div>
          </>
        ) : (
          // --- RECOVERY FORM ---
          <>
            <h2>Відновлення пароля</h2>
            <p className="auth-description">Введіть свої дані, щоб встановити новий пароль.</p>
            <form onSubmit={handleRecoverySubmit}>
              <div className="form-group">
                  <label htmlFor="rec-name">ПІБ (Повне ім'я)</label>
                  <input
                      id="rec-name"
                      type="text"
                      placeholder="Іванов Іван Іванович"
                      value={recoveryData.full_name}
                      onChange={(e) => setRecoveryData({...recoveryData, full_name: e.target.value})}
                      required
                  />
              </div>
              <div className="form-group">
                  <label htmlFor="rec-email">Ваш Email</label>
                  <input
                      id="rec-email"
                      type="email"
                      placeholder="example@mail.com"
                      value={recoveryData.email}
                      onChange={(e) => setRecoveryData({...recoveryData, email: e.target.value})}
                      required
                  />
              </div>
              <div className="form-group">
                  <label htmlFor="rec-pass">Новий пароль</label>
                  <input
                      id="rec-pass"
                      type="password"
                      placeholder="Мінімум 6 символів"
                      value={recoveryData.new_password}
                      onChange={(e) => setRecoveryData({...recoveryData, new_password: e.target.value})}
                      required
                      minLength={6}
                  />
              </div>
              <button type="submit">Змінити пароль</button>
            </form>
            
            <div className="auth-links">
              <button type="button" onClick={() => setIsRecovering(false)} className="link-btn">
                  &larr; Повернутися до входу
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
