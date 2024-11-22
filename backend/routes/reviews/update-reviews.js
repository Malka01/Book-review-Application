const { db } = require("../../lib/db");
const { reviewSchema } = require("../../validations");

const updateReview = async (req, res) => {
  try {
    // get review id from request
    const id = parseInt(req.params.id);

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
    const { title, author, rating, review } = validatedData.data;

    // create a transaction to update a review
    await db.$transaction(async (tx) => {
      // check if review exists in database
      const savedReview = await tx.review.findUnique({
        where: {
          id,
        },
      });

      // if review does not exist, return error
      if (!savedReview) {
        return res.status(404).json({
          success: false,
          message: "Review not found.",
        });
      }

      // update review
      const updatedReview = await tx.review.update({
        where: {
          id,
        },
        data: {
          title,
          author,
          rating,
          review,
        },
      });

      // if review is not updated, return error
      if (!updatedReview) {
        return res.status(500).json({
          success: false,
          message: "Failed to update review.",
        });
      }

      // change total rating in book
      await tx.book.update({
        where: {
          isbn: savedReview.isbn,
        },
        data: {
          totalRating: {
            increment: rating - savedReview.rating,
          },
        },
      });

      // return success message
      return res.status(200).json({
        success: true,
        message: "Review updated successfully.",
      });
    });
  } catch (error) {
    // return error message
    return res.status(500).json({
      success: false,
      message: "Failed to update review.",
    });
  }
};

module.exports = updateReview;
