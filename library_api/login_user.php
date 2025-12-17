<?php
require_once "bootstrap.php";
setupApiHeaders();

use Library\Entity\Reader;

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['email'], $data['password'])) {
    $reader = $entityManager->getRepository(Reader::class)->findOneBy(['email' => $data['email']]);

    if ($reader && password_verify($data['password'], $reader->getPassword())) {
        echo json_encode(["success" => true, "user" => $reader->toArray()]);
    } else {
        echo json_encode(["success" => false, "error" => "Невірний логін або пароль"]);
    }
}
?>
