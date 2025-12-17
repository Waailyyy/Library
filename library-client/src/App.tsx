import React, { useState } from "react";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import { useNotification } from "./components/NotificationProvider";

// Define and export types here to avoid circular dependencies
export interface UserData {
  id?: number;
  // username видалено, бо в таблиці readers його немає
  password?: string;
  full_name: string; // Замість firstName та lastName
  email: string;
  birth_date: string; // Замість dateOfBirth
  phone?: string;
}

export interface AdminData {
  id: number;
  username: string;
  full_name: string;
}


const App: React.FC = () => {
  const [page, setPage] = useState<"home" | "cart" | "login" | "register" | "admin_login" | "admin_panel">("home");
  const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);
  const [loggedInAdmin, setLoggedInAdmin] = useState<AdminData | null>(null);
  const addNotification = useNotification();

  const goToCart = () => setPage("cart");
  const goToHome = () => setPage("home");
  const goToLogin = () => setPage("login");
  const goToRegister = () => setPage("register");
  const goToAdminLogin = () => setPage("admin_login");

  const handleLogin = async (email: string, password: string) => {
    try {
        const response = await fetch("http://localhost/library_api/login_user.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
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
            setLoggedInUser(result.user);
            addNotification(`Вітаємо, ${result.user.full_name}! Ви успішно увійшли.`);
            goToHome();
        } else {
            throw new Error(result.error || `Помилка сервера (status: ${response.status})`);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Не вдалося увійти. Спробуйте пізніше.";
        console.error("Помилка входу:", error);
        addNotification(`Помилка: ${errorMessage}`);
    }
  };

  const handleLogout = () => {
    addNotification(`До зустрічі, ${loggedInUser?.full_name}!`);
    setLoggedInUser(null);
    goToHome();
  };

  const handleAdminLogin = async (username: string, password: string) => {
    try {
        const response = await fetch("http://localhost/library_api/login_admin.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
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
            setLoggedInAdmin(result.admin);
            addNotification(`Вітаємо, ${result.admin.full_name}!`);
            setPage("admin_panel");
        } else {
            throw new Error(result.error || `Помилка сервера (status: ${response.status})`);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Не вдалося увійти в адмін-панель.";
        console.error("Помилка входу в адмін-панель:", error);
        addNotification(`Помилка: ${errorMessage}`);
    }
  };

  const handleAdminLogout = () => {
    addNotification(`Ви вийшли з адмін-панелі.`);
    setLoggedInAdmin(null);
    goToHome();
  };

  const handleRegister = async (userData: UserData) => {
    try {
        const response = await fetch("http://localhost/library_api/register_user.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
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
            addNotification(result.message || "Реєстрація пройшла успішно!");
            goToLogin();
        } else {
            throw new Error(result.error || `Помилка сервера (status: ${response.status})`);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Не вдалося зареєструватися. Спробуйте пізніше.";
        console.error("Помилка реєстрації:", error);
        addNotification(`Помилка: ${errorMessage}`);
    }
  };
  
  const renderPage = () => {
    // Якщо адмін залогінений, показуємо адмін-панель
    if (page === 'admin_panel' && loggedInAdmin) {
        return <AdminPanel admin={loggedInAdmin} onLogout={handleAdminLogout} />;
    }

    // Якщо намагаються зайти в адмінку без логіну, показуємо сторінку входу
    if (page === 'admin_panel' && !loggedInAdmin) {
        return <AdminLogin onAdminLogin={handleAdminLogin} onHomeClick={goToHome} />;
    }

    switch(page) {
      case "home":
        return <Home onCartClick={goToCart} onLoginClick={goToLogin} onRegisterClick={goToRegister} loggedInUser={loggedInUser} onLogout={handleLogout} onAdminClick={goToAdminLogin} />;
      case "cart":
        return <Cart onHomeClick={goToHome} loggedInUser={loggedInUser} />;
      case "login":
        return <Login onLogin={handleLogin} onRegisterClick={goToRegister} onHomeClick={goToHome} />;
      case "register":
        return <Register onRegister={handleRegister} onLoginClick={goToLogin} onHomeClick={goToHome} />;
      case "admin_login":
        return <AdminLogin onAdminLogin={handleAdminLogin} onHomeClick={goToHome} />;
      default:
        return <Home onCartClick={goToCart} onLoginClick={goToLogin} onRegisterClick={goToRegister} loggedInUser={loggedInUser} onLogout={handleLogout} onAdminClick={goToAdminLogin} />;
    }
  }

  return (
    <>
      {renderPage()}
    </>
  );
};

export default App;