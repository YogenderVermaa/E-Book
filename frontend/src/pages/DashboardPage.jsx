import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Book } from 'lucide-react';

import DashBoardLayout from '../components/layout/DashBoardLayout';
import BookCard from '../components/card/BookCard';
import CreateBookModal from '../components/models/CreateBookModal';
import Button from '../components/ui/Button';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';

const BookCardSkull = () => (
  <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
    <div className="h-40 bg-slate-200 rounded-md mb-4"></div>
    <div className="space-y-2">
      <div className="h-6 bg-slate-200 rounded w-3/4"></div>
      <div className="h-4 bg-slate-300 rounded w-1/2"></div>
    </div>
  </div>
);

const ConfirmationModel = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-4">
        <div
          className="flex justify-between items-center p-6 border-b border-gray-200"
          onClick={onClose}
        >
          <h2 className="text-xl font-semibold"></h2>
          <button className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>

          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white">
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [isCreateModelOpen, setIsCreateModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.BOOKS.GET_BOOK);
        setBooks(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
        console.error('Failed to fetch books', error);
        toast.error('Failed to fetch your eBooks');
      } finally {
        setIsloading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleDeleteBook = async () => {
    if (!bookToDelete) return;
    try {
      await axiosInstance.delete(`${API_PATHS.BOOKS.DELETE_BOOK}/${bookToDelete}`);
      setBooks(books.filter((book) => book._id !== bookToDelete));
      toast.success('ebook deleted successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to Delete E-book');
    } finally {
      setBookToDelete(null);
    }
  };

  const handleCreatedBookClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleBookCreated = (bookId) => {
    setIsCreateModalOpen(false);
    navigate(`/editor/${bookId}`);
  };

  return (
    <DashBoardLayout>
      <div className="min-h-screen  bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto  ">
          {/* Header Section */}
          <div className="md:flex md:justify-between items-start mb-8">
            <div className="flex flex-col gap-1 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">All eBook</h1>
              <p className="text-sm text-slate-600 mt-1">
                Create, edit, and manage all your AI-generated eBooks.
              </p>
            </div>
            <Button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              onClick={handleCreatedBookClick}
              icon={Plus}
            >
              Create New eBook
            </Button>
          </div>

          {/* Content Section */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <BookCardSkull key={i} />
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <div className="mb-4">
                <Book className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No ebooks found</h3>
              <p className="text-gray-600 text-center mb-6">
                You haven't created any eBooks yet. Get started by creating your first Book
              </p>
              <Button
                onClick={handleCreatedBookClick}
                icon={Plus}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Create your first book
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard key={book._id} book={book} onDelete={() => setBookToDelete(book._id)} />
              ))}
            </div>
          )}
        </div>

        {/* Modals */}
        <ConfirmationModel
          isOpen={!!bookToDelete}
          onClose={() => setBookToDelete(null)}
          onConfirm={handleDeleteBook}
          title="Delete eBook"
          message="Are you sure you want to delete this eBook? This action cannot be undone."
        />
        <CreateBookModal
          isOpen={isCreateModelOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onBookCreated={handleBookCreated}
        />
      </div>
    </DashBoardLayout>
  );
};

export default DashboardPage;
