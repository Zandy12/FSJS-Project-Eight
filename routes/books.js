const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

/* GET books listing. */
router.get('/', asyncHandler(async (req, res) => {
  // might need to fix models/index.js
  const books = await Book.findAll({ order: [["createdAt", "DESC"]] });
  res.render("index", {books});
}));

/* Create a new book form. */
router.get('/new', (req, res) => {
  res.render("new-book", { book: {} });
});

/* POST create book. */
router.post('/', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/");
  } catch (error) {
    if (error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      if (error.errors.length > 1) {
        res.render("new-book", { book, errors: [error.errors[0], error.errors[1]] });
      } else {
        res.render("new-book", { book, errors: [error.errors[0]] });
      }
    } else {
      throw error; // error caught in the asyncHandler's catch block 
    }
  }
  res.redirect("/books/" + book.id);
}));

/* GET/edit individual book. */
router.get("/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("update-book", { book });
  } else {
    res.sendStatus(404);
  }
}));

/* Update a book. */
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books/");
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body); 
      book.id = req.params.id; // make sure correct book gets updated
      if (error.errors.length > 1) {
        res.render("update-book", { book, errors: [error.errors[0], error.errors[1]] });
      } else {
        res.render("update-book", { book, errors: [error.errors[0]] });
      }
    } else {
      throw error;
    }
  }
}));

/* Delete book form. */
router.get("/:id/delete", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('update-book', { book });
  } else {
    res.sendStatus(404);
  }
})); 

/* Delete individual book. */
router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  }

}));

module.exports = router;