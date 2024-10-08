import {
  book_total_copies_update,
  find_book_by_id,
} from "../repositories/book.repository.js";
import { borrow_book_repo } from "../repositories/borrow.repository.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const borrow_book = asyncHandler(async (req, res) => {
  const { id } = req.body;
  let book_data = await find_book_by_id(id);
  if (book_data?.total_copies <= 0) {
    throw new apiError(
      409,
      "The book is currently out of stock and cannot be borrowed"
    );
  }
  await borrow_book_repo(req);
  await book_total_copies_update(id);

  res.status(201).json(new apiResponse(201, [], "borrow book successfully"));
});

export { borrow_book };
