import { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Sparkles,
  Trash2,
  ArrowLeft,
  BookOpen,
  Hash,
  Lightbulb,
  Palette,
  Save,
} from 'lucide-react';
import Modal from '../ui/Modal';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectedField';
import Button from '../ui/Button';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const CreateBookModal = ({ isOpen, onClose, onBookCreated }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [bookTitle, setBookTitle] = useState('');
  const [numChapters, setNumChapters] = useState(5);
  const [aiTopic, setAiTopic] = useState('');
  const [aiStyle, setAiStyle] = useState('Informative');
  const [chapters, setChapters] = useState([]);
  const [isGeneratingOutline, setGeneratingOutline] = useState(false);
  const [isFinalizingBook, setIsFinalizingBook] = useState(false);
  const chaptersContainerRef = useRef(null);

  const resetModal = () => {
    setStep(1);
    setBookTitle('');
    setNumChapters(5);
    setAiTopic('');
    setAiStyle('Informative');
    setChapters([]);
    setGeneratingOutline(false);
    setIsFinalizingBook(false);
  };

  useEffect(() => {
    if (step === 2 && chaptersContainerRef.current) {
      const scrollableDiv = chaptersContainerRef.current;
      scrollableDiv.scrollTo({
        top: scrollableDiv.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chapters.length, step]);

  const handleGenerateOutline = async () => {
    if (!bookTitle || !numChapters) {
      toast.error('Please provide a book title and number of chapters.');
      return;
    }
    setGeneratingOutline(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_OUTLINE, {
        topic: bookTitle,
        description: aiTopic || '',
        style: aiStyle,
        numChapters: numChapters,
      });
      setChapters(response.data.data.outline);
      setStep(2);
      toast.success('Outline generated! Review and edit chapters.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate outline');
    } finally {
      setGeneratingOutline(false);
    }
  };

  const handleAddChapter = () => {
    setChapters([...chapters, { title: `Chapter ${chapters.length + 1}`, description: '' }]);
  };

  const handleChapterChange = (index, field, value) => {
    const updatedChapters = [...chapters];
    updatedChapters[index][field] = value;
    setChapters(updatedChapters);
  };
  const handleDeleteChapter = (index) => {
    if (chapters.length <= 1) return;
    setChapters(chapters.filter((_, i) => i !== index));
  };

  const handleFinalizeBook = async () => {
    if (!bookTitle || chapters.length === 0) {
      toast.error('Book title and at least one chapter are required');
      return;
    }
    setIsFinalizingBook(true);
    try {
      const response = await axiosInstance.post(API_PATHS.BOOKS.CREATE_BOOK, {
        title: bookTitle,
        author: user.name || 'Unknown Author',
        chapters: chapters,
      });
      console.log('id:::', response);
      onBookCreated(response.data.data._id);
      onClose();
      resetModal();
      toast.success('ebook created successfully');
    } catch (error) {
      console.log('TESR__', bookTitle, chapters);
      console.log('ERROR:::', error);
      toast.error(error.response?.data?.message || 'Failed to create ebook');
    } finally {
      setIsFinalizingBook(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        resetModal();
      }}
      title="Create New eBook"
    >
      {step === 1 && (
        <div className="space-y-2">
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full font-semibold bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg transform transition-all">
              1
            </div>
            <div className="flex-1 h-1 rounded bg-gray-200"></div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full font-semibold bg-gray-200 text-gray-400">
              2
            </div>
          </div>

          <InputField
            icon={BookOpen}
            label="Book Title"
            placeholder="Enter your book title..."
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
          />
          <InputField
            icon={Hash}
            label="Number of Chapters"
            type="number"
            placeholder="5"
            value={numChapters}
            onChange={(e) => setNumChapters(parseInt(e.target.value) || 1)}
            min="1"
            max="10"
            className="cursor-pointer"
          />
          <InputField
            icon={Lightbulb}
            label="Topic"
            placeholder="Specific topic for AI generation ..."
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
          />

          <SelectField
            className=""
            icon={Palette}
            label="Writing Style"
            value={aiStyle}
            onChange={(e) => setAiStyle(e.target.value)}
            options={['Informative', 'Storytelling', 'Casual', 'Professional', 'Humorous']}
          />

          <div className="pt-4">
            <Button
              onClick={handleGenerateOutline}
              isLoading={isGeneratingOutline}
              icon={Sparkles}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              Generate outline with AI
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
              ✔︎
            </div>
            <div className="flex-1 h-1 rounded bg-gradient-to-r from-violet-500 to-purple-600"></div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full font-semibold bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg">
              2
            </div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Review Chapters</h3>
            <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold">
              {chapters.length} {chapters.length === 1 ? 'chapter' : 'chapters'}
            </span>
          </div>

          {/* Chapters List */}
          <div
            ref={chaptersContainerRef}
            className="max-h-[400px] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-violet-300 scrollbar-track-gray-100"
          >
            {chapters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <BookOpen className="w-16 h-16 text-gray-400 mb-3" />
                <p className="text-gray-500 text-center font-medium">
                  No chapters yet. Add one to get started.
                </p>
              </div>
            ) : (
              chapters.map((chapter, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold text-sm shadow-md flex-shrink-0">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={chapter.title}
                      onChange={(e) => handleChapterChange(index, 'title', e.target.value)}
                      placeholder="Chapter Title"
                      className="flex-1 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                    <button
                      onClick={() => handleDeleteChapter(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 flex-shrink-0"
                      title="Delete Chapter"
                      disabled={chapters.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    value={chapter.description}
                    onChange={(e) => handleChapterChange(index, 'description', e.target.value)}
                    placeholder="Brief description of what this chapter covers..."
                    rows={2}
                    className="w-full px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none transition-all"
                  />
                </div>
              ))
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 gap-3">
            <Button
              variant="ghost"
              onClick={() => setStep(1)}
              icon={ArrowLeft}
              className="hover:bg-gray-100"
            >
              Back
            </Button>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={handleAddChapter}
                icon={Plus}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Add Chapter
              </Button>
              <Button
                onClick={handleFinalizeBook}
                isLoading={isFinalizingBook}
                icon={Save}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Create eBook
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CreateBookModal;
