<?php
require_once "bootstrap.php";
setupApiHeaders();

use Library\Entity\Book;
use Library\Entity\Issue;

try {
    $bookRepo = $entityManager->getRepository(Book::class);
    $books = $bookRepo->findAll();

    $response = [];
    foreach ($books as $book) {
        $bookArray = $book->toArray();
        
        // Підрахунок видач для статистики
        $issueCount = $entityManager->createQueryBuilder()
            ->select('count(i.id)')
            ->from(Issue::class, 'i')
            ->where('i.book = :book')
            ->setParameter('book', $book)
            ->getQuery()
            ->getSingleScalarResult();
            
        $bookArray['issue_count'] = $issueCount;
        $response[] = $bookArray;
    }

    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>