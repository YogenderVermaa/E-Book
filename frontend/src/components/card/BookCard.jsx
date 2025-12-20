import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../utils/apiPath';
import { Edit, Trash2 } from 'lucide-react';
const BookCard = ({ book, onDelete }) => {
  const navigate = useNavigate();
  const coverImaegUrl = book.coverImage
    ? `${BASE_URL}/backend${book.coverImage}`.replace(/\\/g, '/')
    : '';
  return <div>BookCard</div>;
};

export default BookCard;
