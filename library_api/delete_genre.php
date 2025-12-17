<?php
require_once "bootstrap.php";
setupApiHeaders();
use Library\Entity\Genre;

$data = json_decode(file_get_contents("php://input"), true);
if (isset($data['id'])) {
    try {
        $genre = $entityManager->find(Genre::class, $data['id']);
        if ($genre) {
            $entityManager->remove($genre);
            $entityManager->flush();
            echo json_encode(["success" => true]);
        }
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
?>