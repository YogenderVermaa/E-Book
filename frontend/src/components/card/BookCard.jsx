import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, BookOpen } from 'lucide-react';

const BookCard = ({ book, onDelete }) => {
  const navigate = useNavigate();
  const coverImageUrl = book.coverImage || '';

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-2"
      onClick={() => navigate(`/view-book/${book._id}`)}
    >
      <div className="relative h-80 bg-gradient-to-br from-violet-100 to-purple-100 overflow-hidden">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.src = '';
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-24 h-24 text-violet-300" />
          </div>
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/editor/${book._id}`);
            }}
            className="p-2.5 bg-white/95 backdrop-blur-sm rounded-lg hover:bg-violet-500 hover:text-white transition-all duration-200 shadow-lg hover:scale-110"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(book._id);
            }}
            className="p-2.5 bg-white/95 backdrop-blur-sm rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200 shadow-lg hover:scale-110"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-violet-600 bg-violet-100 rounded-full">
            {book.category || 'Book'}
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-violet-600 transition-colors duration-200">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 font-medium flex items-center gap-1">
            <span className="text-gray-400">by</span>
            {book.author}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
