<?php
require_once "bootstrap.php";
setupApiHeaders();

use Library\Entity\Book;
use Library\Entity\Reader;
use Library\Entity\Issue;

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['items'], $data['customer'])) {
    $entityManager->beginTransaction();
    try {
        $readerId = $data['customer']['reader_id'] ?? null;
        if (!$readerId) throw new Exception("Користувач не ідентифікований");

        $reader = $entityManager->find(Reader::class, $readerId);
        if (!$reader) throw new Exception("Читача не знайдено");

        foreach ($data['items'] as $item) {
            $book = $entityManager->find(Book::class, $item['id']);
            if ($book) {
                // Створюємо запис issue для кожної копії
                for ($i = 0; $i < $item['quantity']; $i++) {
                    $issue = new Issue();
                    $issue->setBook($book);
                    $issue->setReader($reader);
                    $issue->setIssueDate(date('Y-m-d'));
                    $issue->setReturnDate(date('Y-m-d', strtotime('+14 days')));
                    $issue->setStatus('issued');
                    $entityManager->persist($issue);
                }
                
                $newQty = $book->getQuantity() - $item['quantity'];
                if ($newQty < 0) throw new Exception("Недостатньо книг на складі: " . $book->getTitle());
                $book->setQuantity($newQty);
            }
        }

        $entityManager->flush();
        $entityManager->commit();
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        $entityManager->rollback();
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
?>