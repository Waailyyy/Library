<?php
require_once "bootstrap.php";
setupApiHeaders();
use Library\Entity\Genre;

try {
    $genres = $entityManager->getRepository(Genre::class)->findBy([], ['name' => 'ASC']);
    $data = array_map(fn($g) => $g->toArray(), $genres);
    echo json_encode($data);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
