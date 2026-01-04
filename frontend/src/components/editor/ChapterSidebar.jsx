import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Trash2, Plus, GripVertical } from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Button from '../ui/Button';

/* ---------- SORTABLE ITEM ---------- */
const SortableItem = ({
  chapter,
  index,
  selectedChapterIndex,
  onSelectChapter,
  onDeleteChapter,
  onGenerateChapterContent,
  isGenerating,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: chapter._id || `new-${index}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center justify-between pl-2 pr-1 py-2 bg-white rounded-md border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all"
    >
      {/* Select Chapter Button */}
      <button
        className={`flex items-center gap-2 w-full px-2 py-2 text-sm rounded-md transition-all
        ${
          selectedChapterIndex === index
            ? 'bg-violet-100 text-violet-700 font-semibold'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
        onClick={() => onSelectChapter(index)}
      >
        <GripVertical
          className="h-4 w-4 text-slate-400 cursor-grab active:cursor-grabbing"
          {...listeners}
          {...attributes}
        />
        <span>{chapter.title}</span>
      </button>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="small"
          className="hover:bg-violet-100"
          onClick={() => onGenerateChapterContent(index)}
          isLoading={isGenerating === index}
          title="Generate content with AI"
        >
          {isGenerating !== index && <Sparkles className="h-4 w-4 text-violet-500" />}
        </Button>
        <Button
          variant="ghost"
          size="small"
          className="hover:bg-red-100"
          onClick={() => onDeleteChapter(index)}
          title="Delete chapter"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

/* ---------- SIDEBAR ---------- */
const ChapterSidebar = ({
  book,
  selectedChapterIndex,
  onSelectedChapter,
  onAddChapter,
  onDeleteChapter,
  onGenerateChapterContent,
  isGenerating,
  onReorderChapter,
}) => {
  const navigate = useNavigate();
  const chapterIds = book?.chapters?.map((ch, i) => ch._id || `new-${i}`) || [];

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = chapterIds.indexOf(active.id);
      const newIndex = chapterIds.indexOf(over.id);
      onReorderChapter(oldIndex, newIndex);
    }
  };

  return (
    <aside className="w-64 border-r bg-white h-full flex flex-col p-4 shadow-sm">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Book Title */}
      <h2 className="text-lg font-semibold text-slate-800 truncate mb-4" title={book.title}>
        {book.title}
      </h2>

      {/* Chapter Sortable List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={chapterIds} strategy={verticalListSortingStrategy}>
            {book?.chapters?.length > 0 ? (
              book.chapters.map((chapter, index) => (
                <SortableItem
                  key={chapter._id || `new-${index}`}
                  chapter={chapter}
                  index={index}
                  selectedChapterIndex={selectedChapterIndex}
                  onSelectChapter={onSelectedChapter}
                  onDeleteChapter={onDeleteChapter}
                  onGenerateChapterContent={onGenerateChapterContent}
                  isGenerating={isGenerating}
                />
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center mt-6">No chapters yet</p>
            )}
          </SortableContext>
        </DndContext>
      </div>

      {/* Add New Chapter */}
      <div className="mt-4">
        <Button variant="secondary" onClick={onAddChapter} className="w-full" icon={Plus}>
          New Chapter
        </Button>
      </div>
    </aside>
  );
};

export default ChapterSidebar;
