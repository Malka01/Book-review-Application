const { db } = require("../../lib/db");

const deleteReview = async (req, res) => {
  try {
    // get review id from request
    const id = parseInt(req.params.id);

    // create a transaction to delete a review
    await db.$transaction(async (tx) => {
      // check if review exists in database
      const review = await tx.review.findUnique({
        where: {
          id,
        },
      });

      // if review does not exist, return error
      if (!review) {
        return res.status(404).json({
          success: false,
          message: "Review not found.",
        });
      }

      // delete review
      await tx.review.delete({
        where: {
          id,
        },
      });

      //  decrement review count in book
      await tx.book.update({
        where: {
          isbn: review.isbn,
        },
        data: {
          totalReviews: {
            decrement: 1,
          },
          totalRating: {
            decrement: review.rating,
          },
        },
      });

      // return success message
      return res.status(200).json({
        success: true,
        message: "Review deleted successfully.",
      });
    });
  } catch (error) {
    // return error message
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { deleteReview };
