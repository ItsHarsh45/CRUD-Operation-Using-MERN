import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  mimetype: String,
  size: Number,
  url: String
});

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  attachments: [attachmentSchema]
}, {
  timestamps: true
});

export const Note = mongoose.model('Note', noteSchema);