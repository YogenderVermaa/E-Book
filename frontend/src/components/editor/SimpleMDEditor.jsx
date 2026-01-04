import { Type } from 'lucide-react';
import MDEditor, { commands } from '@uiw/react-md-editor';

const SimpleMDEditor = ({ value, onChange, options = {} }) => {
  return (
    <div
      className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
      data-color-mode="light"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b">
        <Type className="w-5 h-5 text-gray-500" />
        <span className="text-sm font-medium text-gray-600">Markdown Editor</span>
      </div>

      {/* Editor */}
      <div data-color-mode="light" className="p-2">
        <MDEditor
          value={value}
          onChange={onChange}
          height={400}
          preview="live"
          hideToolbar={false}
          {...options}
          commands={[
            commands.bold,
            commands.italic,
            commands.strikethrough,
            commands.hr,
            commands.title,
            commands.divider,
            commands.link,
            commands.code,
            commands.image,
            commands.unorderedListCommand,
            commands.orderedListCommand,
            commands.checkedListCommand,
          ]}
        />
      </div>
    </div>
  );
};

export default SimpleMDEditor;
