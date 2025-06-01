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
    const { page = 1, limit = 5 } = req.query;

    // Fetch the book without reviews populated
    const book = await Book.findById(req.params.id).lean();

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Fetch reviews separately with pagination
    const reviews = await Review.find({ book: req.params.id })
      .populate('user', 'username')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const totalReviews = await Review.countDocuments({ book: req.params.id });

    // Calculate average rating from all reviews (not just paginated ones)
    const allReviews = await Review.find({ book: req.params.id });
    const avgRating =
      allReviews.reduce((acc, r) => acc + r.rating, 0) / (allReviews.length || 1);

    res.json({
      ...book,
      reviews,
      avgRating: avgRating.toFixed(2),
      pagination: {
        total: totalReviews,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalReviews / limit)
      }
    });
  } catch (err) {
    console.error(err);
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
