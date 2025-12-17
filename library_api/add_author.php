<?php
require_once "bootstrap.php";
setupApiHeaders();
use Library\Entity\Author;

$data = json_decode(file_get_contents("php://input"), true);
if (isset($data['full_name'], $data['birth_year'])) {
    try {
        $author = new Author();
        $author->setFullName($data['full_name']);
        $author->setBirthYear((int)$data['birth_year']);
        if (!empty($data['death_year'])) {
            $author->setDeathYear((int)$data['death_year']);
        }
        $entityManager->persist($author);
        $entityManager->flush();
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
?>