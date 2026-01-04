import { useMemo, useState } from 'react';
import { Sparkle, Type, Maximize2 } from 'lucide-react';
import Button from '../ui/Button';
import InputField from '../ui/InputField';
import SimpleMDEditor from './SimpleMDEditor';

const ChapterEditorTab = ({
  book = { title: 'Untitled', chapters: [{ title: 'Chapter 1', content: '' }] },
  selectedChapterIndex = 0,
  onChapterChange = () => {},
  onGenerateChapterContent = () => {},
  isGenerating,
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // MARKDOWN FORMATTER
  const formatMarkdown = (content) => {
    return content
      .replace(/^###\s+(.*)/gm, '<h3 class="text-xl font-bold mb-4 mt-6">$1</h3>')
      .replace(/^##\s+(.*)/gm, '<h2 class="text-2xl font-bold mb-4 mt-8">$1</h2>')
      .replace(/^#\s+(.*)/gm, '<h1 class="text-3xl font-bold mb-6 mt-8">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(
        /^>\s+(.*)/gm,
        '<blockquote class="border-l-4 border-purple-500 pl-4 italic text-gray-700 my-4">$1</blockquote>'
      )
      .split('\n\n')
      .map((p) => (p.trim().startsWith('<') ? p : `<p class="mb-4 leading-7">${p}</p>`))
      .join('');
  };

  // EDITOR OPTIONS
  const mdeOptions = useMemo(
    () => ({
      autofocus: true,
      spellChecker: false,
      toolbar: [
        'bold',
        'italic',
        'heading',
        '|',
        'quote',
        'unordered-list',
        'ordered-list',
        '|',
        'link',
        'image',
        'preview',
      ],
    }),
    []
  );

  // IF NO CHAPTER SELECTED
  if (!book.chapters[selectedChapterIndex]) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <Type className="w-10 h-10 mb-3 text-gray-400" />
        <p>Select a chapter to start editing</p>
      </div>
    );
  }

  const currentChapter = book.chapters[selectedChapterIndex];

  return (
    <div
      className={`${isFullscreen ? 'fixed inset-0 bg-white z-50 p-6' : 'flex-1 p-6'} flex flex-col`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Chapter Editor</h1>
          <p className="text-sm text-gray-500">
            Editing: {currentChapter.title || `Chapter ${selectedChapterIndex + 1}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreviewMode(false)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${!isPreviewMode ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            Edit
          </button>

          <button
            onClick={() => setIsPreviewMode(true)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${isPreviewMode ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            Preview
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-2 py-1 hover:bg-gray-100 rounded-md"
          >
            <Maximize2 className="w-5 h-5" />
          </button>

          <Button
            onClick={() => onGenerateChapterContent(selectedChapterIndex)}
            isLoading={isGenerating === selectedChapterIndex}
            icon={Sparkle} // <-- FIXED
            size="sm"
          >
            Generate with AI
          </Button>
        </div>
      </div>

      {/* CHAPTER TITLE INPUT */}
      <InputField
        label="Chapter Title"
        name="title"
        value={currentChapter.title || ''}
        onChange={onChapterChange}
        placeholder="Enter chapter title..."
        className="text-xl font-semibold"
      />

      {/* CONTENT VIEW */}
      <div className="mt-4">
        {isPreviewMode ? (
          <div>
            <h1 className="text-2xl font-bold mb-4">
              {currentChapter.title || 'Untitled Chapter'}
            </h1>
            <div
              className="prose max-w-none"
              style={{ fontFamily: 'Charter, Georgia, "Times New Roman", serif', lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{
                __html: currentChapter.content
                  ? formatMarkdown(currentChapter.content)
                  : '<p class="text-gray-400 italic">No content yet. Start writing to see the preview.</p>',
              }}
            />
          </div>
        ) : (
          <SimpleMDEditor
            value={currentChapter.content || ''}
            onChange={(value) => onChapterChange({ target: { name: 'content', value } })}
            options={mdeOptions}
          />
        )}
      </div>

      {/* STATUS BAR */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600 border-t pt-3">
        <span>
          Words: {currentChapter.content ? currentChapter.content.trim().split(/\s+/).length : 0}
        </span>
        <span>Characters: {currentChapter.content?.length || 0}</span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Auto-saved</span>
        </div>
      </div>
    </div>
  );
};

export default ChapterEditorTab;
