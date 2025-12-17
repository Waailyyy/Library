<?php
require_once "bootstrap.php";
setupApiHeaders();

use Library\Entity\Reader;

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['email'], $data['password'], $data['full_name'])) {
    try {
        $exists = $entityManager->getRepository(Reader::class)->findOneBy(['email' => $data['email']]);
        if ($exists) {
            echo json_encode(["success" => false, "error" => "Email вже зареєстровано"]);
            exit;
        }

        $reader = new Reader();
        $reader->setFullName($data['full_name']);
        $reader->setEmail($data['email']);
        $reader->setBirthDate($data['birth_date']);
        $reader->setPassword(password_hash($data['password'], PASSWORD_DEFAULT));

        $entityManager->persist($reader);
        $entityManager->flush();

        echo json_encode(["success" => true, "message" => "Успішно зареєстровано"]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
?>
