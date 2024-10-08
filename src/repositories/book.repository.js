import { book_model } from "../models/book.models.js";
const create_book_repo = (book_data) => {
  const { title, ISBN, publication_date, genre, total_copies, author } =
    book_data;
  const book = new book_model({
    title: title,
    ISBN: ISBN,
    publication_date: publication_date,
    genre: genre,
    total_copies: total_copies,
    author: author,
  });
  return book.save();
};
const update_book_repo = (book_data) => {
  const { title, ISBN, publication_date, genre, total_copies, id, author } =
    book_data;
  return book_model.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        title: title,
        ISBN: ISBN,
        publication_date: publication_date,
        genre: genre,
        total_copies: total_copies,
        author: author,
      },
    }
  );
};
const delete_book_repo = (id) => {
  return book_model.deleteOne({ _id: id });
};

const list_book_repo = (filter_data) => {
  let { page, genre, author } = filter_data;
  if (page == undefined || page == "") {
    page = 1;
  }
  const limit = 5;

  let match = {};
  if (genre !== "") {
    match["genre"] = genre;
  }
  if (author !== "") {
    match["author"] = author;
  }

  const skip = (page - 1) * limit;

  return book_model.aggregate([
    { $match: match },
    { $skip: skip },
    { $limit: limit },
  ]);
};
const find_book_by_id = (id) => {
  return book_model.findOne({ _id: id });
};
const book_total_copies_update = async (data, return_status) => {
  data.total_copies += return_status ? 1 : -1;
  await data.save();
};
const total_book_count = () => {
  return book_model.find().countDocuments();
};
const total_available_books = () => {
  return book_model.find({total_copies:{$gt:0}})
};

export {
  create_book_repo,
  update_book_repo,
  delete_book_repo,
  list_book_repo,
  find_book_by_id,
  book_total_copies_update,
  total_book_count,
  total_available_books
};
