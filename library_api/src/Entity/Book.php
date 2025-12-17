<?php
namespace Library\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'books')]
class Book
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    #[ORM\GeneratedValue]
    private int|null $id = null;

    #[ORM\Column(type: 'string')]
    private string $title;

    #[ORM\ManyToOne(targetEntity: Author::class)]
    #[ORM\JoinColumn(name: 'author_id', referencedColumnName: 'id', nullable: false)]
    private Author $author;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    private float $price;

    #[ORM\Column(type: 'integer')]
    private int $quantity;

    #[ORM\Column(type: 'string', name: 'cover_image')]
    private string $coverImage;

    #[ORM\ManyToOne(targetEntity: Genre::class)]
    #[ORM\JoinColumn(name: 'genre_id', referencedColumnName: 'id', nullable: true)]
    private ?Genre $genre = null;

    public function getId(): ?int { return $this->id; }
    
    public function getTitle(): string { return $this->title; }
    public function setTitle(string $title): self { $this->title = $title; return $this; }

    public function getAuthor(): Author { return $this->author; }
    public function setAuthor(Author $author): self { $this->author = $author; return $this; }

    public function getPrice(): float { return $this->price; }
    public function setPrice(float $price): self { $this->price = $price; return $this; }

    public function getQuantity(): int { return $this->quantity; }
    public function setQuantity(int $quantity): self { $this->quantity = $quantity; return $this; }

    public function getCoverImage(): string { return $this->coverImage; }
    public function setCoverImage(string $image): self { $this->coverImage = $image; return $this; }

    public function getGenre(): ?Genre { return $this->genre; }
    public function setGenre(?Genre $genre): self { $this->genre = $genre; return $this; }

    public function toArray(): array {
        // Додаємо повний шлях до картинки, якщо це локальний файл
        $imagePath = (strpos($this->coverImage, 'http') === 0) 
            ? $this->coverImage 
            : "http://localhost/library_api/" . $this->coverImage;

        return [
            'id' => $this->id,
            'title' => $this->title,
            'author' => $this->author->getFullName(),
            'author_id' => $this->author->getId(),
            'price' => $this->price,
            'quantity' => $this->quantity,
            'cover_image' => $imagePath,
            'genre' => $this->genre ? $this->genre->getName() : null,
            'genre_id' => $this->genre ? $this->genre->getId() : null
        ];
    }
}
?>