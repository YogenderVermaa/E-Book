import InputField from '../ui/InputField';
import Button from '../ui/Button';
import { UploadCloud } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BookDetailsTab = ({ book, onBookChange, onCoverUpload, isUploading, fileInputRef }) => {
  const coverImageUrl =
    // If cloudinary URL
    typeof book?.coverImage === 'string' && book.coverImage.startsWith('http')
      ? book.coverImage
      : // If saved as object { url: "" }
        book?.coverImage?.url
        ? book.coverImage.url
        : // If relative path from server
          book?.coverImage
          ? `${BASE_URL}/${book.coverImage}`.replace(/\\/g, '/')
          : // Placeholder
            '/placeholder.jpg';

  return (
    <div className="max-w-xl mx-auto space-y-8">
      {/* ----- Book Info ----- */}
      <div className="space-y-4">
        <InputField
          label="Title"
          name="title"
          value={book?.title || ''}
          onChange={onBookChange}
          placeholder="Enter book title"
        />

        <InputField
          label="Author"
          name="author"
          value={book?.author || ''}
          onChange={onBookChange}
          placeholder="Enter author name"
        />

        <InputField
          label="Subtitle"
          name="subtitle"
          value={book?.subtitle || ''}
          onChange={onBookChange}
          placeholder="Enter subtitle (optional)"
        />
      </div>

      {/* ----- Cover Section ----- */}
      <div className="space-y-4">
        {/* Image Preview */}
        <div className="flex justify-center">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt="Cover"
              className="w-40 h-56 rounded object-cover border"
              onError={(e) => (e.target.src = '')}
            />
          ) : (
            <div className="w-40 h-56 rounded border flex items-center justify-center text-gray-400 text-sm">
              No Image
            </div>
          )}
        </div>

        {/* File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={onCoverUpload}
          accept="image/*"
          className="hidden"
        />

        <Button
          variant="secondary"
          onClick={() => fileInputRef.current.click()}
          isLoading={isUploading}
          icon={UploadCloud}
          className="w-full"
        >
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </div>
    </div>
  );
};

export default BookDetailsTab;
