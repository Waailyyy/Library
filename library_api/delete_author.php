<?php
require_once "bootstrap.php";
setupApiHeaders();
use Library\Entity\Author;

$data = json_decode(file_get_contents("php://input"), true);
if (isset($data['id'])) {
    try {
        $author = $entityManager->find(Author::class, $data['id']);
        if ($author) {
            $entityManager->remove($author);
            $entityManager->flush();
            echo json_encode(["success" => true]);
        }
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => "Можливо, у автора є книги. " . $e->getMessage()]);
    }
}
?>