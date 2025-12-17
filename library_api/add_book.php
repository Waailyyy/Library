<?php
require_once "bootstrap.php";
setupApiHeaders();

use Library\Entity\Book;
use Library\Entity\Author;
use Library\Entity\Genre;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $title = $_POST['title'] ?? '';
        $authorName = $_POST['author'] ?? '';
        $price = (float)($_POST['price'] ?? 0);
        $quantity = (int)($_POST['quantity'] ?? 0);
        $genreId = $_POST['genre_id'] ?? null;
        
        // Завантаження зображення
        $coverPath = "";
        if (isset($_FILES["cover_image"]) && $_FILES["cover_image"]["error"] == 0) {
            $targetDir = "uploads/";
            if (!file_exists($targetDir)) mkdir($targetDir, 0777, true);
            $ext = pathinfo($_FILES["cover_image"]["name"], PATHINFO_EXTENSION);
            $filename = uniqid() . "." . $ext;
            if (move_uploaded_file($_FILES["cover_image"]["tmp_name"], $targetDir . $filename)) {
                $coverPath = $targetDir . $filename;
            }
        }

        // Пошук або створення Автора
        $authorRepo = $entityManager->getRepository(Author::class);
        $author = $authorRepo->findOneBy(['full_name' => $authorName]);
        
        if (!$author) {
            $author = new Author();
            $author->setFullName($authorName);
            $author->setBirthYear(2000); // Заглушка
            $entityManager->persist($author);
        }

        // Пошук Жанру
        $genreRepo = $entityManager->getRepository(Genre::class);
        $genre = null;
        
        if ($genreId) {
            $genre = $genreRepo->find($genreId);
        }

        // Якщо жанр не вибрано або не знайдено, беремо перший або створюємо General
        if (!$genre) {
            $genre = $genreRepo->findOneBy([]); 
            if (!$genre) {
                $genre = new Genre();
                $genre->setName('General');
                $entityManager->persist($genre);
            }
        }

        $book = new Book();
        $book->setTitle($title);
        $book->setAuthor($author);
        $book->setPrice($price);
        $book->setQuantity($quantity);
        $book->setCoverImage($coverPath);
        $book->setGenre($genre);

        $entityManager->persist($book);
        $entityManager->flush();

        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
?>