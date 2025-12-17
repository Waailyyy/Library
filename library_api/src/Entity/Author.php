<?php
namespace Library\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'authors')]
class Author
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    #[ORM\GeneratedValue]
    private int|null $id = null;

    #[ORM\Column(type: 'string')]
    private string $full_name;

    // Змінено: додано nullable=true та значення за замовчуванням null
    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $birth_year = null;

    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $death_year = null;

    public function getId(): ?int { return $this->id; }
    
    public function getFullName(): string { return $this->full_name; }
    public function setFullName(string $name): self { $this->full_name = $name; return $this; }

    // Змінено: повертає ?int та приймає ?int
    public function getBirthYear(): ?int { return $this->birth_year; }
    public function setBirthYear(?int $year): self { $this->birth_year = $year; return $this; }

    public function getDeathYear(): ?int { return $this->death_year; }
    public function setDeathYear(?int $year): self { $this->death_year = $year; return $this; }

    public function toArray(): array {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'birth_year' => $this->birth_year,
            'death_year' => $this->death_year
        ];
    }
}
?>