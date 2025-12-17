<?php
namespace Library\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'readers')]
class Reader
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    #[ORM\GeneratedValue]
    private int|null $id = null;

    #[ORM\Column(type: 'string')]
    private string $full_name;

    #[ORM\Column(type: 'string', unique: true)]
    private string $email;

    #[ORM\Column(type: 'string')]
    private string $password;

    #[ORM\Column(type: 'string', name: 'birth_date')]
    private string $birthDate;

    public function getId(): ?int { return $this->id; }

    public function getFullName(): string { return $this->full_name; }
    public function setFullName(string $name): self { $this->full_name = $name; return $this; }

    public function getEmail(): string { return $this->email; }
    public function setEmail(string $email): self { $this->email = $email; return $this; }

    public function getPassword(): string { return $this->password; }
    public function setPassword(string $password): self { $this->password = $password; return $this; }

    public function getBirthDate(): string { return $this->birthDate; }
    public function setBirthDate(string $date): self { $this->birthDate = $date; return $this; }

    public function toArray(): array {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'birth_date' => $this->birthDate
        ];
    }
}
?>