<?php
require_once "bootstrap.php";
setupApiHeaders();
use Library\Entity\Admin;

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['username'], $data['password'])) {
    $admin = $entityManager->getRepository(Admin::class)->findOneBy(['username' => $data['username']]);

    if ($admin) {
        // Перевірка пароля (сумісність з хешем та простим текстом)
        if (password_verify($data['password'], $admin->getPassword()) || $data['password'] === $admin->getPassword()) {
            echo json_encode(["success" => true, "admin" => $admin->toArray()]);
            exit;
        }
    }
    echo json_encode(["success" => false, "error" => "Wrong credentials"]);
}
?>