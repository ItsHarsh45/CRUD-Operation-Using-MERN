import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Attachment {
  _id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
}

interface Note {
  _id: string;
  title: string;
  content: string;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

interface NoteContextType {
  notes: Note[];
  createNote: (note: FormData) => Promise<void>;
  updateNote: (id: string, note: FormData) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

const NoteContext = createContext<NoteContextType | null>(null);

export const useNoteContext = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNoteContext must be used within a NoteProvider');
  }
  return context;
};

const API_URL = 'http://localhost:5000/api';

export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/notes`);
      setNotes(response.data);
    } catch (error) {
      toast.error('Failed to fetch notes');
    }
  };

  const createNote = async (formData: FormData) => {
    try {
      const response = await axios.post(`${API_URL}/notes`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setNotes([response.data, ...notes]);
      toast.success('Note created successfully');
    } catch (error) {
      toast.error('Failed to create note');
    }
  };

  const updateNote = async (id: string, formData: FormData) => {
    try {
      const response = await axios.put(`${API_URL}/notes/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setNotes(notes.map((n) => (n._id === id ? response.data : n)));
      toast.success('Note updated successfully');
    } catch (error) {
      toast.error('Failed to update note');
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/notes/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
      toast.success('Note deleted successfully');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  return (
    <NoteContext.Provider value={{ notes, createNote, updateNote, deleteNote }}>
      {children}
    </NoteContext.Provider>
  );
};