import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="absolute inset-0 bg-transparent" onClick={onClose}></div>
        <div className="relative z-10 flex flex-col max-h-[90vh]">
          <div className="sticky top-0 z-10 bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-5 text-white flex items-center justify-between">
            <h3 className="text-2xl font-bold">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
