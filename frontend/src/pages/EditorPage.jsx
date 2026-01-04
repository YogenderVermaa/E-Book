import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Icons
import { Save, Menu, Edit, NotebookText, ChevronDown, FileText, FileDown } from 'lucide-react';

// Components / Utils
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';
import DropDown, { DropdownItem } from '../components/ui/Dropdown';
import Button from '../components/ui/Button';
import ChapterEditorTab from '../components/editor/ChapterEditorTab';
import ChapterSidebar from '../components/editor/ChapterSidebar';
import BookDetailsTab from '../components/editor/BookDetailsTab';
import { arrayMove } from '@dnd-kit/sortable';

const aiStyle = 'standard';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const EditorPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState({ title: '', coverImage: '', chapters: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('editor');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch Book
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axiosInstance.get(`${API_PATHS.BOOKS.GET_BOOK_BY_ID}/${bookId}`);
        setBook(response.data.data);
      } catch {
        toast.error('Failed to load book details.');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [bookId, navigate]);

  // Handlers
  const handleBookChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleChapterChange = (e) => {
    const { name, value } = e.target;
    const updated = [...book.chapters];
    updated[selectedChapterIndex][name] = value;
    setBook((prev) => ({ ...prev, chapters: updated }));
  };

  const handleAddChapter = () => {
    const updated = [
      ...book.chapters,
      { title: `Chapter ${book.chapters.length + 1}`, content: '' },
    ];
    setBook((prev) => ({ ...prev, chapters: updated }));
    setSelectedChapterIndex(updated.length - 1);
  };

  const handleDeleteChapter = (index) => {
    if (book.chapters.length <= 1) return toast.error('A book must have at least one chapter.');

    const updated = book.chapters.filter((_, i) => i !== index);
    setBook((prev) => ({ ...prev, chapters: updated }));
    setSelectedChapterIndex((prev) => (prev >= index ? prev - 1 : prev));
  };

  const handleReorderChapter = (oldIndex, newIndex) => {
    setBook((prev) => ({
      ...prev,
      chapters: arrayMove(prev.chapters, oldIndex, newIndex),
    }));
    setSelectedChapterIndex(newIndex);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await axiosInstance.put(`${API_PATHS.BOOKS.UPDATE_BOOK}/${bookId}`, {
        title: book.title,
        description: book.description,
        chapters: book.chapters,
      });
      toast.success('Book saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error(error.response?.data?.message || 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new window.FormData();
    formData.append('coverImage', file);

    setIsUploading(true);
    try {
      const response = await axiosInstance.put(
        `${API_PATHS.BOOKS.UPDATE_COVER}/${bookId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      console.log('Cover upload response:', response.data);

      // CRITICAL: Only update coverImage, preserve all other data
      setBook((prev) => ({
        ...prev,
        coverImage:
          response.data.data?.coverImage || response.data.coverImage || response.data.data,
      }));

      toast.success('Cover image uploaded!');
    } catch (error) {
      console.error('Cover upload failed:', error);
      toast.error('Failed to upload cover.');
    } finally {
      setIsUploading(false);
      // Clear file input
      if (e.target) e.target.value = '';
    }
  };

  const handleGenerateChapterContent = async (index) => {
    const chapter = book.chapters[index];
    if (!chapter?.title) return toast.error('Chapter title required!');

    setIsGenerating(index);

    let response;
    try {
      console.log('Sending request to:', API_PATHS.AI.GENERATE_CHAPTER_CONTENT);
      console.log('Request payload:', {
        chapterTitle: chapter.title,
        chapterDescription: chapter.description || '',
        style: aiStyle,
      });

      response = await axiosInstance.post(API_PATHS.AI.GENERATE_CHAPTER_CONTENT, {
        chapterTitle: chapter.title,
        chapterDescription: chapter.description || '',
        style: aiStyle,
      });

      // console.log("Response received:", response);
    } catch (error) {
      toast.error(error.response?.data?.message || 'AI generation failed.');
      setIsGenerating(false);
      return;
    }

    try {
      let content;
      if (response?.data?.data?.content) {
        content = response.data.data.content;
      } else if (response?.data?.content) {
        content = response.data.content;
      } else {
        // console.error("Unexpected response structure:", response?.data);
        throw new Error('Cannot find content in response');
      }

      // console.log("Extracted content length:", content?.length);

      if (!content) {
        throw new Error('Generated content is empty');
      }

      const updatedChapters = [...book.chapters];
      updatedChapters[index].content = response.data.data.content;

      const updatedBook = { ...book, chapters: updatedChapters };
      setBook(updatedBook);

      toast.success(`Generated: ${chapter.title}`);
      await axiosInstance.put(`${API_PATHS.BOOKS.UPDATE_BOOK}/${bookId}`, {
        title: book.title,
        description: book.description,
        chapters: updatedChapters,
      });
    } catch (error) {
      console.error('Content extraction failed:', error);
      toast.error('Failed to process generated content.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Export PDF + DOC
  const handleExportPDF = () => {
    const token = localStorage.getItem('token');
    window.open(`${baseUrl}/api/export/${bookId}/pdf?token=${token}`, '_blank');
  };
  const handleExportDoc = () => {
    const token = localStorage.getItem('token');
    window.open(`${baseUrl}/api/export/${bookId}/doc?token=${token}`, '_blank');
  };

  if (isLoading) return <div className="h-screen flex justify-center items-center">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex w-[280px] border-r bg-white shadow-sm">
        <ChapterSidebar
          book={book}
          selectedChapterIndex={selectedChapterIndex}
          onSelectedChapter={setSelectedChapterIndex}
          onAddChapter={handleAddChapter}
          onDeleteChapter={handleDeleteChapter}
          onReorderChapter={handleReorderChapter}
          isGenerating={isGenerating}
        />
      </div>

      {/* Sidebar - Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden">
          <div className="absolute w-[260px] h-full bg-white shadow-xl">
            <ChapterSidebar
              book={book}
              selectedChapterIndex={selectedChapterIndex}
              onSelectedChapter={(index) => {
                setSelectedChapterIndex(index);
                setIsSidebarOpen(false);
              }}
              onAddChapter={handleAddChapter}
              onDeleteChapter={handleDeleteChapter}
              onReorderChapter={handleReorderChapter}
              isGenerating={isGenerating}
            />
          </div>
          <div onClick={() => setIsSidebarOpen(false)} className="w-full h-full"></div>
        </div>
      )}

      {/* Main Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="flex items-center justify-between bg-white border-b px-6 py-3 shadow-sm">
          <div className="flex gap-3 items-center">
            <button className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>

            <button
              className={`${activeTab === 'editor' ? 'bg-black text-white' : 'hover:bg-gray-200'} px-4 py-2 rounded`}
              onClick={() => setActiveTab('editor')}
            >
              <Edit className="inline-block w-4 h-4 mr-2" /> Editor
            </button>

            <button
              className={`${activeTab === 'details' ? 'bg-black text-white' : 'hover:bg-gray-200'} px-4 py-2 rounded`}
              onClick={() => setActiveTab('details')}
            >
              <NotebookText className="inline-block w-4 h-4 mr-2" /> Book Details
            </button>
          </div>

          <div className="flex gap-2 items-center">
            <DropDown
              trigger={
                <Button variant="secondary" icon={FileDown}>
                  Export <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              }
            >
              <DropdownItem onClick={handleExportPDF}>
                <FileText /> PDF
              </DropdownItem>
              <DropdownItem onClick={handleExportDoc}>
                <FileText /> DOCX
              </DropdownItem>
            </DropDown>

            <Button icon={Save} isLoading={isSaving} onClick={handleSaveChanges}>
              Save
            </Button>
          </div>
        </header>

        {/* Tab Content */}
        <section className="flex-1 overflow-y-auto p-6">
          {activeTab === 'editor' ? (
            <ChapterEditorTab
              book={book}
              selectedChapterIndex={selectedChapterIndex}
              onChapterChange={handleChapterChange}
              onGenerateChapterContent={handleGenerateChapterContent}
              isGenerating={isGenerating}
            />
          ) : (
            <BookDetailsTab
              book={book}
              onBookChange={handleBookChange}
              onCoverUpload={handleCoverImageUpload}
              fileInputRef={fileInputRef}
              isUploading={isUploading}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default EditorPage;
