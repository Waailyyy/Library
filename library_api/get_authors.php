<?php
require_once "bootstrap.php";
setupApiHeaders();
use Library\Entity\Author;

try {
    $authorRepo = $entityManager->getRepository(Author::class);
    // Перевірка, чи клас існує, хоча автозавантаження мало б спрацювати
    if (!$authorRepo) {
        throw new Exception("Репозиторій Author не знайдено.");
    }
    
    $authors = $authorRepo->findBy([], ['full_name' => 'ASC']);
    $data = array_map(fn($a) => $a->toArray(), $authors);
    echo json_encode($data);
} catch (\Throwable $e) {
    // Використовуємо Throwable для перехоплення як Exception, так і Error
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>