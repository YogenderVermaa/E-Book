import { useMemo, useState, useRef } from 'react';
import {
  Calendar,
  Smile,
  CloudSun,
  MapPin,
  Image as ImageIcon,
  Video as VideoIcon,
  Upload,
  BookOpen,
  Bold,
  Italic,
  Heading,
  Quote,
  List,
  Eye,
  Edit3,
  Sparkles,
  Save,
  Loader2,
} from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import toast from 'react-hot-toast';

const MOODS = [
  'Reflective',
  'Happy',
  'Candid',
  'Adventurous',
  'Peaceful',
  'Grateful',
  'Tired',
  'Motivated',
  'Emotional',
  'Chill',
];

const WEATHERS = ['Sunny', 'Rainy', 'Cloudy', 'Cold', 'Breezy', 'Stormy'];
const TIMES = ['Morning', 'Afternoon', 'Evening', 'Late Night'];

const ChapterEditorTab = ({
  book = { title: 'Untitled', chapters: [{ title: 'Day 1', content: '' }] },
  selectedChapterIndex = 0,
  onChapterChange = () => {},
  onGenerateChapterContent = () => {},
  isGenerating,
  onSave,
  isSaving = false,
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [showPhotoBox, setShowPhotoBox] = useState(false);
  const [showVideoBox, setShowVideoBox] = useState(false);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const currentChapter = book.chapters[selectedChapterIndex];

  // Word & character counts
  const wordCount = useMemo(() => {
    if (!currentChapter?.content) return 0;
    return currentChapter.content.trim().split(/\s+/).filter(Boolean).length;
  }, [currentChapter?.content]);

  const charCount = useMemo(() => {
    return currentChapter?.content?.length || 0;
  }, [currentChapter?.content]);

  // Markdown Formatter for Preview
  const formatMarkdown = (content = '') => {
    return content
      .replace(/^###\s+(.*)/gm, '<h3 class="text-lg font-bold mb-3 mt-5 text-gray-900">$1</h3>')
      .replace(/^##\s+(.*)/gm, '<h2 class="text-xl font-bold mb-3 mt-6 text-gray-900">$1</h2>')
      .replace(/^#\s+(.*)/gm, '<h1 class="text-2xl font-bold mb-4 mt-6 text-gray-900">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(
        /^>\s+(.*)/gm,
        '<blockquote class="border-l-4 border-amber-600 pl-3 italic my-3 text-gray-700">$1</blockquote>'
      )
      .split('\n\n')
      .map((p) => `<p class="mb-4 leading-relaxed">${p}</p>`)
      .join('');
  };

  if (!currentChapter) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 py-16">
        <BookOpen className="w-12 h-12 mb-3 text-stone-400" />
        <p className="font-serif text-lg">Select or create a daily memory to open your diary</p>
      </div>
    );
  }

  // Handle Media File Upload (Photos and Videos)
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const formData = new window.FormData();
    formData.append('media', file);

    setIsUploadingMedia(true);
    const toastId = toast.loading(
      isVideo ? 'Uploading video to scrapbook...' : 'Uploading photo to scrapbook...'
    );

    try {
      const response = await axiosInstance.post(API_PATHS.BOOKS.UPLOAD_MEDIA, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const url = response.data?.data?.url;
      const resourceType = response.data?.data?.resourceType;
      const isDetectedVideo =
        isVideo || resourceType === 'video' || /\.(mp4|mov|webm|mkv|avi)$/i.test(url || '');

      if (url) {
        if (isDetectedVideo) {
          const existingVideos = currentChapter.videos || [];
          onChapterChange({
            target: { name: 'videos', value: [...existingVideos, url] },
          });
          toast.success('Video clip attached to scrapbook!', { id: toastId });
        } else {
          const existingPhotos = currentChapter.photos || [];
          onChapterChange({
            target: { name: 'photos', value: [...existingPhotos, url] },
          });
          toast.success('Photo added to scrapbook!', { id: toastId });
        }
      } else {
        toast.error('Upload succeeded but no media URL was returned.', { id: toastId });
      }
    } catch (error) {
      console.error('Media upload failed:', error);
      const msg = error.response?.data?.message || 'Failed to upload media. Please try again.';
      toast.error(msg, { id: toastId });
    } finally {
      setIsUploadingMedia(false);
      if (e.target) e.target.value = '';
    }
  };

  // Add External Photo URL
  const handleAddPhotoUrl = () => {
    if (!photoUrlInput.trim()) return;
    const existingPhotos = currentChapter.photos || [];
    onChapterChange({
      target: { name: 'photos', value: [...existingPhotos, photoUrlInput.trim()] },
    });
    setPhotoUrlInput('');
    setShowPhotoBox(false);
    toast.success('Photo attached!');
  };

  // Add Video URL
  const handleAddVideoUrl = () => {
    if (!videoUrlInput.trim()) return;
    const existingVideos = currentChapter.videos || [];
    onChapterChange({
      target: { name: 'videos', value: [...existingVideos, videoUrlInput.trim()] },
    });
    setVideoUrlInput('');
    setShowVideoBox(false);
    toast.success('Video clip attached!');
  };

  // Remove Photo
  const handleRemovePhoto = (photoIdx) => {
    const updated = (currentChapter.photos || []).filter((_, i) => i !== photoIdx);
    onChapterChange({ target: { name: 'photos', value: updated } });
  };

  // Remove Video
  const handleRemoveVideo = (vidIdx) => {
    const updated = (currentChapter.videos || []).filter((_, i) => i !== vidIdx);
    onChapterChange({ target: { name: 'videos', value: updated } });
  };

  // Quick formatting insert helper
  const insertFormatting = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = currentChapter.content || '';
    const selected = text.substring(start, end) || 'text';

    const replacement = `${prefix}${selected}${suffix}`;
    const newContent = text.substring(0, start) + replacement + text.substring(end);

    onChapterChange({ target: { name: 'content', value: newContent } });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 10);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-2">
      {/* =========================================================================
          DESKTOP / TABLET: THE AUTHENTIC TWO-FACE OPEN BOOK SPREAD (md: and above)
         ========================================================================= */}
      <div className="hidden md:block">
        {/* Leather Hardcover Journal Frame */}
        <div className="relative book-leather-binding rounded-[28px] p-3.5 sm:p-5 shadow-2xl">
          {/* Subtle Outer Embossed Book Border */}
          <div className="border border-[#5a4336] rounded-[22px] p-2 bg-[#201813]">
            {/* The Two Pages Spread */}
            <div className="relative grid grid-cols-2 rounded-2xl overflow-hidden min-h-[640px] bg-[#fbf9f2] book-shadow">
              {/* Central Spine Fold Shadow */}
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 pointer-events-none z-20 book-spine-crease" />

              {/* Crimson Satin Bookmark Ribbon hanging down center */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-36 z-30 pointer-events-none satin-ribbon">
                {/* Triangular cut tip */}
                <div className="absolute -bottom-2.5 left-0 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-[#7f1d1d]" />
              </div>

              {/* -------------------------------------------------------------
                  LEFT PAGE: PAGE 1 - Memory Details & Scrapbook Keepsakes
                 ------------------------------------------------------------- */}
              <div className="p-6 sm:p-8 flex flex-col justify-between border-r border-[#e8e2d5] bg-[#fdfcf7] book-page-paper relative">
                <div className="space-y-5">
                  {/* Page 1 Header: Date, Mood & Weather Stamps */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-[#e8e2d5] text-xs">
                    {/* Date Stamp */}
                    <div className="flex items-center gap-1.5 bg-[#f5f0e6] px-2.5 py-1 rounded-lg border border-[#e2d9ca]">
                      <Calendar className="w-3.5 h-3.5 text-stone-600" />
                      <input
                        type="date"
                        name="date"
                        value={
                          currentChapter.date
                            ? new Date(currentChapter.date).toISOString().split('T')[0]
                            : new Date().toISOString().split('T')[0]
                        }
                        onChange={onChapterChange}
                        className="bg-transparent font-serif text-xs font-bold text-stone-800 outline-none cursor-pointer"
                      />
                    </div>

                    {/* Time of Day */}
                    <select
                      name="timeOfDay"
                      value={currentChapter.timeOfDay || 'Evening'}
                      onChange={onChapterChange}
                      className="bg-[#f5f0e6] px-2 py-1 rounded-lg border border-[#e2d9ca] text-xs font-serif font-bold text-stone-700 outline-none"
                    >
                      {TIMES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>

                    {/* Mood Stamp */}
                    <div className="flex items-center gap-1 bg-[#f5f0e6] px-2 py-1 rounded-lg border border-[#e2d9ca]">
                      <Smile className="w-3.5 h-3.5 text-indigo-600" />
                      <select
                        name="mood"
                        value={currentChapter.mood || 'Reflective'}
                        onChange={onChapterChange}
                        className="bg-transparent text-xs font-serif font-bold text-stone-800 outline-none"
                      >
                        {MOODS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Weather Stamp */}
                    <div className="flex items-center gap-1 bg-[#f5f0e6] px-2 py-1 rounded-lg border border-[#e2d9ca]">
                      <CloudSun className="w-3.5 h-3.5 text-amber-600" />
                      <select
                        name="weather"
                        value={currentChapter.weather || 'Sunny'}
                        onChange={onChapterChange}
                        className="bg-transparent text-xs font-serif font-bold text-stone-800 outline-none"
                      >
                        {WEATHERS.map((w) => (
                          <option key={w} value={w}>
                            {w}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Location Stamp */}
                  <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                    <input
                      type="text"
                      name="location"
                      value={currentChapter.location || ''}
                      onChange={onChapterChange}
                      placeholder="Location stamp (e.g. Kyoto Tea House, Cozy Desk)..."
                      className="w-full text-xs font-serif text-stone-800 outline-none placeholder-stone-400 bg-transparent"
                    />
                  </div>

                  {/* Memory Title */}
                  <div>
                    <label className="block text-[11px] font-serif font-bold text-stone-500 uppercase tracking-widest mb-1">
                      Entry Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={currentChapter.title || ''}
                      onChange={onChapterChange}
                      placeholder="e.g. Day 4: Golden hour reflections by the river..."
                      className="w-full text-xl font-serif font-extrabold text-stone-900 border-b-2 border-stone-300 pb-1 outline-none focus:border-amber-700 bg-transparent placeholder-stone-400"
                    />
                  </div>

                  {/* Scrapbook Keepsakes: Attached Photos & Videos */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-bold text-stone-800 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-stone-600" />
                        <span>
                          Scrapbook Keepsakes (
                          {(currentChapter.photos?.length || 0) +
                            (currentChapter.videos?.length || 0)}
                          )
                        </span>
                      </span>

                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*,video/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingMedia}
                          className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 bg-[#ede6d8] hover:bg-[#e2d8c5] text-stone-800 rounded-lg transition-colors border border-stone-300 shadow-2xs"
                        >
                          <Upload className="w-3 h-3 text-stone-700" />
                          <span>{isUploadingMedia ? 'Uploading...' : 'Upload'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowPhotoBox(!showPhotoBox)}
                          className="text-[11px] font-bold px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg border border-stone-300"
                        >
                          + Photo Link
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowVideoBox(!showVideoBox)}
                          className="text-[11px] font-bold px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg border border-purple-200"
                        >
                          + Video
                        </button>
                      </div>
                    </div>

                    {/* Photo URL Link Box */}
                    {showPhotoBox && (
                      <div className="flex gap-2 p-2 bg-stone-100 rounded-xl border border-stone-200">
                        <input
                          type="url"
                          placeholder="Paste image URL..."
                          value={photoUrlInput}
                          onChange={(e) => setPhotoUrlInput(e.target.value)}
                          className="flex-1 text-xs px-2.5 py-1 bg-white border border-stone-300 rounded-lg outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddPhotoUrl}
                          className="px-2.5 py-1 bg-stone-800 text-white font-bold text-xs rounded-lg"
                        >
                          Add
                        </button>
                      </div>
                    )}

                    {/* Video URL Link Box */}
                    {showVideoBox && (
                      <div className="flex gap-2 p-2 bg-purple-50 rounded-xl border border-purple-200">
                        <input
                          type="url"
                          placeholder="Paste YouTube, Vimeo or MP4 URL..."
                          value={videoUrlInput}
                          onChange={(e) => setVideoUrlInput(e.target.value)}
                          className="flex-1 text-xs px-2.5 py-1 bg-white border border-purple-200 rounded-lg outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddVideoUrl}
                          className="px-2.5 py-1 bg-purple-600 text-white font-bold text-xs rounded-lg"
                        >
                          Add
                        </button>
                      </div>
                    )}

                    {/* Polaroid Scrapbook Gallery */}
                    <div className="grid grid-cols-3 gap-2.5 pt-1 max-h-48 overflow-y-auto pr-1">
                      {currentChapter.photos?.map((photoUrl, pIdx) => (
                        <div
                          key={pIdx}
                          className="relative polaroid-frame p-1 rounded-sm border border-stone-200 bg-white"
                        >
                          <div className="aspect-square overflow-hidden bg-stone-100">
                            <img
                              src={photoUrl}
                              alt={`Memory ${pIdx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="h-4 flex items-center justify-between px-1 text-[9px] text-stone-500 font-serif">
                            <span>Photo #{pIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(pIdx)}
                              className="text-red-500 hover:text-red-700 font-bold"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}

                      {currentChapter.videos?.map((vidUrl, vIdx) => (
                        <div
                          key={vIdx}
                          className="relative col-span-3 p-2 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between text-xs text-purple-900"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <VideoIcon className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                            <span className="truncate">{vidUrl}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveVideo(vIdx)}
                            className="text-red-500 hover:text-red-700 font-bold ml-2"
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      {!currentChapter.photos?.length && !currentChapter.videos?.length && (
                        <div className="col-span-3 py-6 border-2 border-dashed border-[#e2d9ca] rounded-xl text-center text-stone-400 font-serif text-xs">
                          No photos or clips pinned to this page yet
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Inspiration Prompter */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={isGenerating !== false && isGenerating !== undefined}
                      onClick={() => onGenerateChapterContent(selectedChapterIndex)}
                      className="w-full py-2 px-3 bg-gradient-to-r from-stone-100 to-[#ede6d8] hover:from-stone-200 hover:to-[#e2d8c5] border border-stone-300 rounded-xl text-xs font-serif font-bold text-stone-800 flex items-center justify-center gap-2 transition-all shadow-2xs"
                    >
                      <Sparkles
                        className={`w-3.5 h-3.5 text-amber-700 ${isGenerating ? 'animate-spin' : ''}`}
                      />
                      <span>
                        {isGenerating ? 'Writing thoughts...' : 'Inspire This Day with AI Prompt'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Left Page Footer Marker */}
                <div className="pt-4 border-t border-[#e8e2d5] flex items-center justify-between text-[11px] font-serif text-stone-400">
                  <span>📖 Page 1</span>
                  <span className="italic truncate max-w-[200px]">
                    {book.title || 'Personal Life Diary'}
                  </span>
                </div>
              </div>

              {/* -------------------------------------------------------------
                  RIGHT PAGE: PAGE 2 - The Ruled Journal Writing Sheet
                 ------------------------------------------------------------- */}
              <div className="p-6 sm:p-8 flex flex-col justify-between bg-[#fcfbf6] book-ruled-lines book-margin-line pl-10 relative">
                <div className="flex-1 flex flex-col">
                  {/* Pen Accessory Toolbar */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e8e2d5] text-xs">
                    <div className="flex items-center gap-1 text-stone-600">
                      <button
                        type="button"
                        onClick={() => insertFormatting('**', '**')}
                        className="p-1.5 hover:bg-stone-200 rounded-md transition-colors"
                        title="Bold"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('*', '*')}
                        className="p-1.5 hover:bg-stone-200 rounded-md transition-colors"
                        title="Italic"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('## ')}
                        className="p-1.5 hover:bg-stone-200 rounded-md transition-colors"
                        title="Heading"
                      >
                        <Heading className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('> ')}
                        className="p-1.5 hover:bg-stone-200 rounded-md transition-colors"
                        title="Quote"
                      >
                        <Quote className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('- ')}
                        className="p-1.5 hover:bg-stone-200 rounded-md transition-colors"
                        title="List"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {onSave && (
                        <button
                          type="button"
                          onClick={onSave}
                          disabled={isSaving}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white rounded-lg text-xs font-serif font-bold transition-colors shadow-2xs cursor-pointer"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3 h-3" />
                              <span>Save</span>
                            </>
                          )}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-serif font-bold transition-colors cursor-pointer ${
                          isPreviewMode
                            ? 'bg-amber-600 text-white'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'
                        }`}
                      >
                        {isPreviewMode ? (
                          <Edit3 className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                        <span>{isPreviewMode ? 'Edit Mode' : 'Read View'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Writing Canvas */}
                  <div className="flex-1 flex flex-col">
                    {isPreviewMode ? (
                      <div
                        className="prose max-w-none text-stone-900 font-serif leading-loose text-base p-2 overflow-y-auto max-h-[500px]"
                        dangerouslySetInnerHTML={{
                          __html: currentChapter.content
                            ? formatMarkdown(currentChapter.content)
                            : '<p class="text-stone-400 italic font-serif">No thoughts written on this page yet. Click "Edit Mode" to begin writing.</p>',
                        }}
                      />
                    ) : (
                      <textarea
                        ref={textareaRef}
                        name="content"
                        value={currentChapter.content || ''}
                        onChange={onChapterChange}
                        placeholder="Dear Diary,&#10;&#10;Write raw, unfiltered moments from today here..."
                        className="w-full flex-1 min-h-[460px] bg-transparent outline-none resize-none font-serif text-stone-900 text-base leading-[32px] placeholder-stone-400"
                        style={{
                          lineHeight: '32px',
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Right Page Footer: Word count & Autosave Status */}
                <div className="pt-3 border-t border-[#e8e2d5] flex items-center justify-between text-[11px] font-serif text-stone-500">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Auto-saved</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span>{wordCount} Words</span>
                    <span>{charCount} Characters</span>
                    <span className="font-bold text-stone-700">Page 2 📖</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MOBILE / PHONE: THE AUTHENTIC SMALL POCKET DIARY (< md)
         ========================================================================= */}
      <div className="block md:hidden">
        {/* Leather Pocket Notebook Binder */}
        <div className="book-leather-binding rounded-3xl p-3 shadow-xl">
          {/* Top Notebook Strap with Bookmark Tab */}
          <div className="relative flex items-center justify-between px-3 py-2 bg-[#201813] border-b border-[#45372d] rounded-t-2xl">
            <span className="text-[11px] font-serif font-black uppercase tracking-wider text-amber-200">
              📔 Pocket Diary
            </span>
            <div className="w-3.5 h-7 satin-ribbon rounded-b-sm absolute right-8 -top-1" />
          </div>

          {/* Ruled Pocket Diary Page */}
          <div className="bg-[#fcfbf6] book-ruled-lines book-margin-line pl-6 pr-4 py-4 rounded-b-2xl shadow-inner space-y-4">
            {/* Quick Metadata Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#e8e2d5]">
              <input
                type="date"
                name="date"
                value={
                  currentChapter.date
                    ? new Date(currentChapter.date).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0]
                }
                onChange={onChapterChange}
                className="bg-[#f5f0e6] px-2 py-0.5 rounded text-[11px] font-serif font-bold text-stone-800 border border-[#e2d9ca]"
              />

              <select
                name="mood"
                value={currentChapter.mood || 'Reflective'}
                onChange={onChapterChange}
                className="bg-[#f5f0e6] px-1.5 py-0.5 rounded text-[11px] font-serif font-bold text-stone-800 border border-[#e2d9ca]"
              >
                {MOODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                name="weather"
                value={currentChapter.weather || 'Sunny'}
                onChange={onChapterChange}
                className="bg-[#f5f0e6] px-1.5 py-0.5 rounded text-[11px] font-serif font-bold text-stone-800 border border-[#e2d9ca]"
              >
                {WEATHERS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            {/* Title Line */}
            <input
              type="text"
              name="title"
              value={currentChapter.title || ''}
              onChange={onChapterChange}
              placeholder="Title of this day's memory..."
              className="w-full text-base font-serif font-bold text-stone-900 border-b border-stone-300 pb-1 outline-none bg-transparent placeholder-stone-400"
            />

            {/* Scrapbook Photos & Actions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-serif font-bold text-stone-700 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-stone-500" />
                  <span>Keepsakes ({currentChapter.photos?.length || 0})</span>
                </span>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2 py-0.5 bg-stone-200 text-stone-800 rounded text-[11px] font-bold"
                >
                  + Add Photo
                </button>
              </div>

              {currentChapter.photos?.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {currentChapter.photos.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative polaroid-frame p-1 rounded w-20 flex-shrink-0 bg-white"
                    >
                      <img src={url} alt="Photo" className="w-full h-16 object-cover rounded-xs" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-0 right-0 p-0.5 bg-red-600 text-white rounded text-[9px]"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Ruled Textarea */}
            <div>
              <textarea
                name="content"
                value={currentChapter.content || ''}
                onChange={onChapterChange}
                placeholder="Dear Diary,&#10;&#10;Write today's story here..."
                rows={12}
                className="w-full bg-transparent outline-none resize-none font-serif text-stone-900 text-sm leading-[32px] placeholder-stone-400"
                style={{
                  lineHeight: '32px',
                }}
              />
            </div>

            {/* Mobile Footer Status */}
            <div className="pt-2 border-t border-[#e8e2d5] flex items-center justify-between text-[10px] font-serif text-stone-500">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Auto-saved
              </span>
              <span>{wordCount} words</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterEditorTab;
