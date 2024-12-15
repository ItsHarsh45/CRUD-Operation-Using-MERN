import React from 'react';
import { Toaster } from 'react-hot-toast';
import { PlusCircle, BookOpen } from 'lucide-react';
import NoteList from './components/NoteList';
import NoteForm from './components/NoteForm';
import { NoteProvider } from './context/NoteContext';

function App() {
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  return (
    <NoteProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Toaster position="top-right" />
        
        <nav className="bg-white border-b border-indigo-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BookOpen className="w-8 h-8 text-indigo-600" />
                <h1 className="text-2xl font-bold text-gray-900">NoteMaster</h1>
              </div>
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <PlusCircle size={20} />
                Create Note
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">My Notes</h2>
            <p className="text-gray-600 mt-2">Manage your thoughts and ideas in one place</p>
          </div>
          <NoteList />
          {isFormOpen && <NoteForm onClose={() => setIsFormOpen(false)} />}
        </main>
      </div>
    </NoteProvider>
  );
}

export default App;