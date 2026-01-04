import { useState } from 'react';
import { Menu } from 'lucide-react';
import ViewChapterSidebar from './ViewChapterSidebar';

const ViewBook = ({ book }) => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fontSize, setFontSize] = useState(18);

  const selectedChapter = book.chapters[selectedChapterIndex];

  const formatContent = (content = '') => {
    return content
      .split('\n\n')
      .filter((p) => p.trim())
      .map((p) => {
        let paragraph = p.trim();
        paragraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        paragraph = paragraph.replace(/(?<!\*)\*(?!\*)(.*?)\*(?!\*)/g, '<em>$1</em>');
        return `<p>${paragraph}</p>`;
      })
      .join('');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <ViewChapterSidebar
        book={book}
        selectedChapterIndex={selectedChapterIndex}
        onSelectChapter={setSelectedChapterIndex}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-lg font-semibold">{book.title}</h1>
              <p className="text-sm text-gray-500">by {book.author}</p>
            </div>
          </div>

          {/* Font Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFontSize(Math.max(14, fontSize - 2))}
              className="px-2 py-1 border rounded hover:bg-gray-100"
            >
              A-
            </button>

            <span className="text-sm text-gray-600">{fontSize}px</span>

            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              className="px-2 py-1 border rounded hover:bg-gray-100"
            >
              A+
            </button>
          </div>
        </header>

        {/* Reading Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <h2 className="text-2xl font-bold mb-8">{selectedChapter.title}</h2>

            <div
              className="reading-content text-gray-800"
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: 1.7,
                fontFamily: 'Charter, Georgia, "Times New Roman", serif',
              }}
              dangerouslySetInnerHTML={{
                __html: formatContent(selectedChapter.content),
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewBook;
