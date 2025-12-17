<?php
namespace Library\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'issue')]
class Issue
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    #[ORM\GeneratedValue]
    private int|null $id = null;

    #[ORM\ManyToOne(targetEntity: Book::class)]
    #[ORM\JoinColumn(name: 'book_id', referencedColumnName: 'id')]
    private Book $book;

    #[ORM\ManyToOne(targetEntity: Reader::class)]
    #[ORM\JoinColumn(name: 'reader_id', referencedColumnName: 'id')]
    private Reader $reader;

    #[ORM\Column(type: 'string', name: 'issue_date')]
    private string $issueDate;

    #[ORM\Column(type: 'string', name: 'return_date')]
    private string $returnDate;

    #[ORM\Column(type: 'string')]
    private string $status; // 'issued', 'returned'

    public function setBook(Book $book): self { $this->book = $book; return $this; }
    public function getBook(): Book { return $this->book; }

    public function setReader(Reader $reader): self { $this->reader = $reader; return $this; }
    public function getReader(): Reader { return $this->reader; }

    public function setIssueDate(string $date): self { $this->issueDate = $date; return $this; }
    public function setReturnDate(string $date): self { $this->returnDate = $date; return $this; }
    
    public function setStatus(string $status): self { $this->status = $status; return $this; }
    public function getStatus(): string { return $this->status; }

    public function toArray(): array {
        return [
            'id' => $this->id,
            'book_title' => $this->book->getTitle(),
            'reader_name' => $this->reader->getFullName(),
            'issue_date' => $this->issueDate,
            'return_date' => $this->returnDate,
            'status' => $this->status
        ];
    }
}
?>
