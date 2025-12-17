<?php
namespace Library\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'admin')]
class Admin
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    #[ORM\GeneratedValue]
    private int|null $id = null;

    #[ORM\Column(type: 'string', unique: true)]
    private string $username;

    #[ORM\Column(type: 'string')]
    private string $password;

    #[ORM\Column(type: 'string', name: 'full_name')]
    private string $fullName;

    public function getId(): ?int { return $this->id; }

    public function getUsername(): string { return $this->username; }
    public function setUsername(string $username): self { $this->username = $username; return $this; }

    public function getPassword(): string { return $this->password; }
    public function setPassword(string $password): self { $this->password = $password; return $this; }

    public function getFullName(): string { return $this->fullName; }
    public function setFullName(string $name): self { $this->fullName = $name; return $this; }

    public function toArray(): array {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'full_name' => $this->fullName
        ];
    }
}
?>
