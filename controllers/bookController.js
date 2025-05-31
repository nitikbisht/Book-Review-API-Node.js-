const Book = require('../models/bookModel');
const Review = require('../models/reviewModel');

exports.createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch {
    res.status(500).json({ message: 'Error creating book' });
  }
};

exports.getBooks = async (req, res) => {
  const { author, genre, page = 1, limit = 5 } = req.query;
  const filter = {};
  if (author) filter.author = author;
  if (genre) filter.genre = genre;

  const books = await Book.find(filter)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  res.json(books);
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate({
      path: 'reviews',
      populate: { path: 'user', select: 'email' },
    });

    const avgRating =
      book.reviews.reduce((acc, r) => acc + r.rating, 0) / book.reviews.length || 0;

    res.json({ ...book.toObject(), avgRating: avgRating.toFixed(2) });
  } catch {
    res.status(500).json({ message: 'Error fetching book' });
  }
};

exports.searchBooks = async (req, res) => {
  const { q } = req.query;
  const regex = new RegExp(q, 'i');
  const books = await Book.find({
    $or: [{ title: regex }, { author: regex }],
  });
  res.json(books);
};
