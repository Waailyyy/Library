-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Час створення: Гру 08 2025 р., 21:45
-- Версія сервера: 10.4.32-MariaDB
-- Версія PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База даних: `librery`
--

-- --------------------------------------------------------

--
-- Структура таблиці `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп даних таблиці `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `full_name`) VALUES
(1, 'admin', 'adminpass', 'Сергій Коваль'),
(2, 'librarian', 'libpass', 'Олена Іваненко');

-- --------------------------------------------------------

--
-- Структура таблиці `authors`
--

CREATE TABLE `authors` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `birth_year` int(11) DEFAULT NULL,
  `death_year` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп даних таблиці `authors`
--

INSERT INTO `authors` (`id`, `full_name`, `birth_year`, `death_year`) VALUES
(1, 'J.K. Rowling', 1965, NULL),
(2, 'George R.R. Martin', 1948, NULL),
(3, 'J.R.R. Tolkien', 1892, 1973),
(4, 'Jane Austen', 1775, 1817),
(5, 'Harper Lee', 1926, 2016),
(6, 'J.D. Salinger', 1919, 2010),
(7, 'George Orwell', 1903, 1950),
(8, 'Aldous Huxley', 1894, 1963),
(9, 'Ray Bradbury', 1920, 2012),
(10, 'Herman Melville', 1819, 1891),
(11, 'Leo Tolstoy', 1828, 1910),
(12, 'Homer', -800, NULL);

-- --------------------------------------------------------

--
-- Структура таблиці `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author_id` int(11) NOT NULL,
  `genre_id` int(11) NOT NULL,
  `year_published` int(11) DEFAULT NULL,
  `isbn` varchar(20) DEFAULT NULL,
  `quantity` int(11) DEFAULT 0,
  `description` text DEFAULT NULL,
  `cover_image` varchar(500) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп даних таблиці `books`
--

INSERT INTO `books` (`id`, `title`, `author_id`, `genre_id`, `year_published`, `isbn`, `quantity`, `description`, `cover_image`, `price`) VALUES
(1, 'Harry Potter and the Chamber of Secrets', 1, 1, 1998, '9780747538493', 100, 'Second book in the Harry Potter series.', 'https://static.yakaboo.ua/media/catalog/product/9/7/9781408855669.jpg', 150.00),
(2, 'Harry Potter and the Prisoner of Azkaban', 1, 1, 1999, '9780747542155', 5, 'Third book in the Harry Potter series.', 'https://static.yakaboo.ua/media/catalog/product/9/7/9781408855911.jpg', 200.00),
(3, 'A Clash of Kings', 2, 1, 1998, '9780553108033', 3, 'Second book in A Song of Ice and Fire.', 'https://static.yakaboo.ua/media/catalog/product/8/1/81qj4sh-zzl.jpg', 99.99),
(4, 'A Storm of Swords', 2, 1, 2000, '9780553106633', 3, 'Third book in A Song of Ice and Fire.', 'https://static.yakaboo.ua/media/catalog/product/8/1/81aywaavx1l.jpg', 250.00),
(5, 'The Hobbit', 3, 1, 1937, '9780547928227', 4, 'Bilbo Baggins adventures.', 'https://m.media-amazon.com/images/M/MV5BMTcwNTE4MTUxMl5BMl5BanBnXkFtZTcwMDIyODM4OA@@._V1_FMjpg_UX1000_.jpg', 300.00),
(6, 'The Lord of the Rings: The Fellowship of the Ring', 3, 1, 1954, '9780547928210', 4, 'First part of The Lord of the Rings trilogy.', 'https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p28828_p_v8_ao.jpg', 550.00),
(7, 'The Lord of the Rings: The Two Towers', 3, 1, 1954, '9780547928203', 4, 'Second part of The Lord of the Rings trilogy.', 'https://upload.wikimedia.org/wikipedia/en/a/a1/Lord_Rings_Two_Towers.jpg', 50.00),
(8, 'The Lord of the Rings: The Return of the King', 3, 1, 1955, '9780547928197', 4, 'Third part of The Lord of the Rings trilogy.', 'https://upload.wikimedia.org/wikipedia/en/thumb/4/40/Rotkboxart2.jpg/250px-Rotkboxart2.jpg', 580.00),
(9, 'Pride and Prejudice', 4, 2, 1813, '9780141199078', 3, 'Classic novel about manners and marriage.', 'https://m.media-amazon.com/images/M/MV5BMTA1NDQ3NTcyOTNeQTJeQWpwZ15BbWU3MDA0MzA4MzE@._V1_QL75_UX190_CR0,0,190,281_.jpg', 160.00),
(10, 'Sense and Sensibility', 4, 2, 1811, '9780141199672', 3, 'Novel about two sisters.', 'https://m.media-amazon.com/images/M/MV5BODYyZjU2YTYtOGE3Yi00MzZhLTgzMTgtODg5ODE3ODRhOTc4XkEyXkFqcGc@._V1_.jpg', 200.00),
(11, 'To Kill a Mockingbird', 5, 2, 1960, '9780061120084', 5, 'Classic novel about racial injustice.', 'https://static.yakaboo.ua/media/cloudflare/product/webp/600x840/8/1/816jexyardl.jpg', 270.00),
(12, 'Go Set a Watchman', 5, 2, 2015, '9780062409850', 2, 'Sequel to To Kill a Mockingbird.', 'https://static.yakaboo.ua/media/cloudflare/product/webp/600x840/i/m/img552_17.jpg', 175.00),
(13, 'The Catcher in the Rye', 6, 2, 1951, '9780316769488', 3, 'Story of teenage angst.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMLZK4bfNO-HXW2Avxunshzf6qKMbgpW87rw&s', 800.00),
(14, '1984', 7, 3, 1949, '9780451524935', 4, 'Dystopian novel.', 'https://bci.kinokuniya.com/jsp/images/book-img/97801/97801410/9780141036144.JPG', 320.00),
(15, 'Animal Farm', 7, 3, 1945, '9780451526342', 4, 'Allegorical novella about totalitarianism.', 'https://m.media-amazon.com/images/I/71JUJ6pGoIL.jpg', 670.00),
(16, 'Brave New World', 8, 3, 1932, '9780060850524', 3, 'Dystopian novel about future society.', 'https://static.yakaboo.ua/media/catalog/product/9/7/9780099518471-2.jpg', 158.00),
(17, 'Fahrenheit 451', 9, 3, 1953, '9781451673319', 3, 'Novel about censorship and burning books.', 'https://m.media-amazon.com/images/I/61GaWVM6ZlL._AC_UF1000,1000_QL80_.jpg', 150.99),
(18, 'Moby Dick', 10, 1, 1851, '9780142437247', 2, 'Novel about the voyage of the whaling ship Pequod.', 'https://m.media-amazon.com/images/I/712mdW4zCcL._AC_UF1000,1000_QL80_.jpg', 199.99),
(19, 'War and Peace', 11, 1, 1869, '9780199232765', 2, 'Historical novel.', 'https://m.media-amazon.com/images/I/81W6BFaJJWL._AC_UF1000,1000_QL80_.jpg', 180.00),
(20, 'The Odyssey', 12, 1, -700, '9780140268867', 1, 'Epic poem by Homer.', 'https://m.media-amazon.com/images/I/A1JR2oK-orL._AC_UF1000,1000_QL80_.jpg', 171.00);

-- --------------------------------------------------------

--
-- Структура таблиці `genres`
--

CREATE TABLE `genres` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп даних таблиці `genres`
--

INSERT INTO `genres` (`id`, `name`) VALUES
(1, 'Fantasy'),
(2, 'Classic'),
(3, 'Dystopian'),
(4, 'Triller');

-- --------------------------------------------------------

--
-- Структура таблиці `issue`
--

CREATE TABLE `issue` (
  `id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `reader_id` int(11) NOT NULL,
  `issue_date` date DEFAULT curdate(),
  `return_date` date DEFAULT NULL,
  `status` enum('active','returned','overdue') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп даних таблиці `issue`
--

INSERT INTO `issue` (`id`, `book_id`, `reader_id`, `issue_date`, `return_date`, `status`) VALUES
(1, 20, 1, '2025-11-19', '2025-12-03', ''),
(2, 20, 1, '2025-11-19', '2025-12-03', '');

-- --------------------------------------------------------

--
-- Структура таблиці `readers`
--

CREATE TABLE `readers` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `birth_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп даних таблиці `readers`
--

INSERT INTO `readers` (`id`, `full_name`, `email`, `password`, `created_at`, `birth_date`) VALUES
(1, 'Антон Бондаренко', 'Anton@gmail.com', '$2y$10$JGyZaZtRiufp/NpdskFC3OtB/.xln6UxScEg4Jzsfry1Dv5LJ0MRe', '2025-11-16 19:52:38', '2025-11-01'),
(2, 'Олег Бойко', 'Oleg@gmail.com', '$2y$10$OdNd4Wa/a0LX/JbyUPf3sOnGQ.sE00e7gzI1IW7ao8TRtrGpp9h.O', '2025-11-19 20:25:26', '2025-11-01');

--
-- Індекси збережених таблиць
--

--
-- Індекси таблиці `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Індекси таблиці `authors`
--
ALTER TABLE `authors`
  ADD PRIMARY KEY (`id`);

--
-- Індекси таблиці `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`),
  ADD KEY `genre_id` (`genre_id`);

--
-- Індекси таблиці `genres`
--
ALTER TABLE `genres`
  ADD PRIMARY KEY (`id`);

--
-- Індекси таблиці `issue`
--
ALTER TABLE `issue`
  ADD PRIMARY KEY (`id`),
  ADD KEY `book_id` (`book_id`),
  ADD KEY `reader_id` (`reader_id`);

--
-- Індекси таблиці `readers`
--
ALTER TABLE `readers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT для збережених таблиць
--

--
-- AUTO_INCREMENT для таблиці `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблиці `authors`
--
ALTER TABLE `authors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT для таблиці `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT для таблиці `genres`
--
ALTER TABLE `genres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблиці `issue`
--
ALTER TABLE `issue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблиці `readers`
--
ALTER TABLE `readers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Обмеження зовнішнього ключа збережених таблиць
--

--
-- Обмеження зовнішнього ключа таблиці `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `books_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `books_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Обмеження зовнішнього ключа таблиці `issue`
--
ALTER TABLE `issue`
  ADD CONSTRAINT `issue_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `issue_ibfk_2` FOREIGN KEY (`reader_id`) REFERENCES `readers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
