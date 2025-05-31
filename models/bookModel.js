const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    genre: String,
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
