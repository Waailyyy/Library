<?php
require_once "bootstrap.php";
setupApiHeaders();
use Library\Entity\Reader;

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['full_name'], $data['email'], $data['new_password'])) {
    try {
        $reader = $entityManager->getRepository(Reader::class)->findOneBy([
            'email' => $data['email'],
            'full_name' => $data['full_name']
        ]);

        if ($reader) {
            $reader->setPassword(password_hash($data['new_password'], PASSWORD_DEFAULT));
            $entityManager->flush();
            echo json_encode(["success" => true, "message" => "Пароль змінено"]);
        } else {
            echo json_encode(["success" => false, "error" => "Користувача не знайдено"]);
        }
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
?>