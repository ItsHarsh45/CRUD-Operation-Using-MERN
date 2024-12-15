import React from 'react';
import { Pencil, Trash2, Calendar, Clock, FileType, Download } from 'lucide-react';
import { useNoteContext } from '../context/NoteContext';
import NoteForm from './NoteForm';

const NoteList = () => {
  const { notes, deleteNote } = useNoteContext();
  const [editingNote, setEditingNote] = React.useState<any>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {notes.map((note) => (
        <div
          key={note._id}
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-100"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-3">{note.title}</h3>
          <p className="text-gray-600 mb-6 line-clamp-3">{note.content}</p>
          
          {note.attachments && note.attachments.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments</h4>
              <div className="space-y-2">
                {note.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileType size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">{attachment.originalName}</span>
                      <span className="text-xs text-gray-400">({formatFileSize(attachment.size)})</span>
                    </div>
                    <a
                      href={`http://localhost:5000${attachment.url}`}
                      download
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      <Download size={16} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <div className="flex items-center mr-4">
              <Calendar size={14} className="mr-1" />
              {formatDate(note.createdAt)}
            </div>
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              {formatTime(note.createdAt)}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              onClick={() => setEditingNote(note)}
              className="flex items-center gap-1 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
            >
              <Pencil size={16} />
              Edit
            </button>
            <button
              onClick={() => deleteNote(note._id)}
              className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      ))}

      {notes.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 text-lg">No notes yet. Create your first note!</p>
        </div>
      )}

      {editingNote && (
        <NoteForm
          note={editingNote}
          onClose={() => setEditingNote(null)}
        />
      )}
    </div>
  );
};

export default NoteList;