import { BookOpen, ChevronLeft } from 'lucide-react';

const ViewChapterSidebar = ({ book, selectedChapterIndex, onSelectChapter, isOpen, onClose }) => {
  return (
    <>
      {/* Overlay (mobile only) */}
      {isOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative left-0 top-0 h-full w-80 bg-white
          border-r border-gray-200 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <BookOpen className="w-5 h-5" />
            <span>Chapters</span>
          </div>

          <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-gray-100">
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Chapters List */}
        <div className="overflow-y-auto h-[calc(100%-64px)]">
          {book.chapters.map((chapter, index) => {
            const isActive = selectedChapterIndex === index;

            return (
              <button
                key={index}
                onClick={() => {
                  onSelectChapter(index);
                  onClose();
                }}
                className={`
                  w-full text-left px-5 py-4 border-b last:border-b-0
                  transition-colors
                  ${isActive ? 'bg-violet-50 border-l-4 border-violet-600' : 'hover:bg-gray-50'}
                `}
              >
                <div
                  className={`text-sm font-medium truncate ${
                    isActive ? 'text-violet-900' : 'text-gray-900'
                  }`}
                >
                  {chapter.title}
                </div>

                <div className="text-xs text-gray-500 mt-1">Chapter {index + 1}</div>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default ViewChapterSidebar;
