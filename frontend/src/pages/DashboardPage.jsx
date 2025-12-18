import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Book } from 'lucide-react';

import DashBoardLayout from '../components/layout/DashBoardLayout';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';

const DashboardPage = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [isCreateModeOpen, setIsCreateModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.BOOKS.GET_BOOK);
        setBooks(response.data);
      } catch (error) {
        toast.error('Failed to fetch your eBooks');
      } finally {
        setIsloading(false);
      }
    };
    fetchBooks();
  }, []);
  const handleDeleteBook = async () => {
    if (!bookToDelete) return;
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
      <div>
        <div>
          <div>
            <h1>All eBook</h1>
            <p className="text-[13px] text-slate-600 mt-1">
              Create, edit,and manage all your AI-generated eBooks.
            </p>
          </div>
          <Button className="" onClick={handleCreatedBookClick} icon={Plus}>
            Create New eBook
          </Button>
        </div>
      </div>
    </DashBoardLayout>
  );
};

export default DashboardPage;
