<?php
require_once "bootstrap.php";
setupApiHeaders();

use Library\Entity\Book;

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'])) {
    try {
        $book = $entityManager->find(Book::class, $data['id']);
        if ($book) {
            $entityManager->remove($book);
            $entityManager->flush();
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "error" => "Book not found"]);
        }
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
?>