
import React, { useState } from "react";
import "./Auth.css";

interface AdminLoginProps {
  onAdminLogin: (username: string, password: string) => void;
  onHomeClick: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onAdminLogin, onHomeClick }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onAdminLogin(username, password);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>Вхід в Адмін-панель</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
              <label htmlFor="username">Ім'я користувача</label>
              <input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
          </div>
          <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                id="password"
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
          </div>
          <button type="submit">Увійти</button>
        </form>
        <div className="auth-links">
          <button type="button" onClick={onHomeClick} className="btn home-link-btn">На головну</button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
