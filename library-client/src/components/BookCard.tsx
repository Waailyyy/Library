import React from "react";
import "../css/BookCard.css";

interface BookProps {
  title: string;
  author: string;
  genre?: string;
  coverImage?: string;
}

const BookCard: React.FC<BookProps> = ({ title, author, genre, coverImage }) => {
  return (
    <div className="book-card">
      {coverImage && <img src={coverImage} alt={title} className="book-cover" />}
      <h2>{title}</h2>
      <p><strong>Author:</strong> {author}</p>
      {genre && <p><strong>Genre:</strong> {genre}</p>}
    </div>
  );
};

export default BookCard;
