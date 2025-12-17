<?php
require_once "bootstrap.php";
setupApiHeaders();
use Library\Entity\Admin;

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['username'], $data['password'], $data['full_name'])) {
    try {
        $admin = new Admin();
        $admin->setUsername($data['username']);
        $admin->setFullName($data['full_name']);
        $admin->setPassword(password_hash($data['password'], PASSWORD_DEFAULT));
        
        $entityManager->persist($admin);
        $entityManager->flush();
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
?>