<?php
require_once "bootstrap.php";
setupApiHeaders();
use Library\Entity\Issue;

try {
    $issues = $entityManager->getRepository(Issue::class)->findBy([], ['issueDate' => 'DESC']);
    $data = array_map(fn($i) => $i->toArray(), $issues);
    echo json_encode($data);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
