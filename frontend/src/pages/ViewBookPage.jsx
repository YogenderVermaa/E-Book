import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';
import toast from 'react-hot-toast';

import DashBoardLayout from '../components/layout/DashBoardLayout';
import ViewBook from '../components/view/ViewBook';
import { Book } from 'lucide-react';

const ViewBookSkelton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-slate-200 rounded w-1/2 mb-4"></div>
    <div className="h-4 bg-slate-200 rounded w-1/4 mb-8"></div>
    <div className="flex gap-8">
      <div className="w-1/4">
        <div className="h-96 bg-slate-200 roudned-lg"></div>
      </div>
      <div className="w-3/4">
        <div className="h-full bg-slate-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

const ViewBookPage = () => {
  const [book, setBook] = useState(null);
  const [isLoading, setIsloading] = useState(true);
  const { bookId } = useParams();
  useEffect(() => {
    const fatchBook = async () => {
      try {
        const response = await axiosInstance.get(`${API_PATHS.BOOKS.GET_BOOK_BY_ID}/${bookId}`);
        setBook(response.data.data);
      } catch (error) {
        console.error('Failed to fetch book', error);
        toast.error('Failed to fatch the book');
      } finally {
        setIsloading(false);
      }
    };
    fatchBook();
  }, [bookId]);
  return (
    <DashBoardLayout>
      {isLoading ? (
        <ViewBookSkelton />
      ) : book ? (
        <ViewBook book={book} />
      ) : (
        <div className="">
          <div>
            <Book className="" />
          </div>
          <h3 className="">eBook Not Found</h3>
          <p className="">
            The book you are looking for does not exist or you do not have permission to view it .
          </p>
        </div>
      )}
    </DashBoardLayout>
  );
};

export default ViewBookPage;
