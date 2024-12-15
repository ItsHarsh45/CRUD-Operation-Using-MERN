import React from 'react';
import { X, Upload, FileType, Trash2 } from 'lucide-react';
import { useNoteContext } from '../context/NoteContext';

interface NoteFormProps {
  note?: {
    _id: string;
    title: string;
    content: string;
    attachments?: Array<{
      _id: string;
      originalName: string;
      url: string;
      mimetype: string;
    }>;
  };
  onClose: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ note, onClose }) => {
  const { createNote, updateNote } = useNoteContext();
  const [title, setTitle] = React.useState(note?.title || '');
  const [content, setContent] = React.useState(note?.content || '');
  const [files, setFiles] = React.useState<FileList | null>(null);
  const [existingAttachments, setExistingAttachments] = React.useState(note?.attachments || []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    
    if (files) {
      Array.from(files).forEach(file => {
        formData.append('attachments', file);
      });
    }

    if (note) {
      await updateNote(note._id, formData);
    } else {
      await createNote(formData);
    }
    onClose();
  };

  const removeAttachment = (attachmentId: string) => {
    setExistingAttachments(prev => prev.filter(att => att._id !== attachmentId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {note ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter note title"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter note content"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments
            </label>
            <div className="mt-2 space-y-4">
              {existingAttachments.map((attachment) => (
                <div key={attachment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileType className="text-gray-500" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{attachment.originalName}</p>
                      <p className="text-xs text-gray-500">{attachment.mimetype}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(attachment._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <label className="mt-4 flex justify-center px-6 py-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
              <div className="flex items-center space-x-2">
                <Upload className="text-gray-400" size={20} />
                <span className="text-gray-600">Upload files</span>
              </div>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => setFiles(e.target.files)}
              />
            </label>
            {files && (
              <div className="mt-4 space-y-2">
                {Array.from(files).map((file, index) => (
                  <div key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                    <FileType size={16} />
                    <span>{file.name}</span>
                    <span className="text-gray-400">({formatFileSize(file.size)})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {note ? 'Save Changes' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;