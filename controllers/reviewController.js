const Review = require('../models/reviewModel');
const Book = require('../models/bookModel');

exports.addReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.userId;

  const existing = await Review.findOne({ user: userId, book: id });
  if (existing) return res.status(400).json({ message: 'Review already exists' });

  const review = await Review.create({ user: userId, book: id, rating, comment });
  await Book.findByIdAndUpdate(id, { $push: { reviews: review._id } });

  res.status(201).json(review);
};

exports.updateReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (review.user.toString() !== req.user.userId)
    return res.status(403).json({ message: 'Unauthorized' });

  review.rating = req.body.rating || review.rating;
  review.comment = req.body.comment || review.comment;
  await review.save();
  res.json(review);
};

exports.deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (review.user.toString() !== req.user.userId)
    return res.status(403).json({ message: 'Unauthorized' });

  await review.deleteOne();
  res.json({ message: 'Review deleted' });
};
