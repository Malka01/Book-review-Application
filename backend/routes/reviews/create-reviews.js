const { reviewSchema } = require("../../validations");
const { db } = require("../../lib/db");

const createReview = async (req, res) => {
  try {
    // get data from request body
    const data = req.body;
    // validate data
    const validatedData = reviewSchema.safeParse(data);

    // check if data is valid
    if (!validatedData.success) {
      return res.status(400).json({
        success: false,
        errors: validatedData.error.errors,
      });
    }

    // get validated data
    const { isbn, title, author, rating, review } = validatedData.data;

    // get user id from request
    const userId = req.user.id;

    // create a transaction to create a review
    await db.$transaction(async (tx) => {
      // check if isbn exists in database
      let book = await tx.book.findUnique({
        where: {
          isbn,
        },
      });

      // if book does not exist, create a new book
      if (!book) {
        book = await tx.book.create({
          data: {
            isbn,
          },
        });

        // if book is not created, return error
        if (!book) {
          return res.status(500).json({ message: "Failed to create book." });
        }
      }

      // create a new review
      const newReview = await tx.review.create({
        data: {
          title,
          author,
          rating,
          review,
          userId: parseInt(userId),
          isbn,
        },
      });

      // if review is not created, return error
      if (!newReview) {
        return res.status(500).json({
          success: false,
          message: "Failed to create review.",
        });
      }

      // update total rating and total reviews of the book
      book = await tx.book.update({
        where: {
          isbn,
        },
        data: {
          totalRating: {
            increment: rating,
          },
          totalReviews: {
            increment: 1,
          },
        },
      });

      // if book is not updated, return error
      if (!book) {
        return res.status(500).json({
          success: false,
          message: "Failed to update book.",
        });
      }

      // return success message
      return res.status(200).json({
        success: true,
        message: "Review created successfully.",
      });
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create review. Please try again later.",
    });
  }
};

module.exports = createReview;
