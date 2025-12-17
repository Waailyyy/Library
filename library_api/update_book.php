<?php
require_once "bootstrap.php";
setupApiHeaders();

use Library\Entity\Book;
use Library\Entity\Author;
use Library\Entity\Genre;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $id = $_POST['id'] ?? null;
        if (!$id) throw new Exception("ID книги не передано");

        $book = $entityManager->find(Book::class, $id);
        if (!$book) throw new Exception("Книгу не знайдено");

        $title = $_POST['title'] ?? '';
        $authorName = $_POST['author'] ?? '';
        $price = (float)($_POST['price'] ?? 0);
        $quantity = (int)($_POST['quantity'] ?? 0);
        $genreId = $_POST['genre_id'] ?? null;

        $book->setTitle($title);
        $book->setPrice($price);
        $book->setQuantity($quantity);

        // Оновлення автора
        $authorRepo = $entityManager->getRepository(Author::class);
        $author = $authorRepo->findOneBy(['full_name' => $authorName]);
        if (!$author) {
            $author = new Author();
            $author->setFullName($authorName);
            $author->setBirthYear(2000); 
            $entityManager->persist($author);
        }
        $book->setAuthor($author);

        // Оновлення жанру
        if ($genreId) {
            $genre = $entityManager->find(Genre::class, $genreId);
            if ($genre) {
                $book->setGenre($genre);
            }
        }

        // Якщо завантажено нову обкладинку
        if (isset($_FILES["cover_image"]) && $_FILES["cover_image"]["error"] == 0) {
            $targetDir = "uploads/";
            if (!file_exists($targetDir)) mkdir($targetDir, 0777, true);
            $ext = pathinfo($_FILES["cover_image"]["name"], PATHINFO_EXTENSION);
            $filename = uniqid() . "." . $ext;
            if (move_uploaded_file($_FILES["cover_image"]["tmp_name"], $targetDir . $filename)) {
                $book->setCoverImage($targetDir . $filename);
            }
        }

        $entityManager->flush();
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
?>