const { db } = require("../../lib/db");

const getAllReviews = async (req, res) => {
  try {
    // get all reviews
    const reviews = await db.review.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        book: {
          select: {
            totalRating: true,
            totalReviews: true,
          },
        },
      },
      // sort reviews by latest first
      orderBy: {
        createdAt: "desc",
      },
    });

    // if no reviews found, return error
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reviews found.",
      });
    }

    // add average rating to each review with 2 decimal places and  add review given by user or not
    reviews.forEach((review) => {
      review.book.averageRating = (
        review.book.totalRating / review.book.totalReviews
      ).toFixed(2);
      review.isReviewGiven = review.userId === req.user?.id;
    });

    // return reviews
    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.log(error);
    // return error message
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getReviewById = async (req, res) => {
  try {
    // get review id from request
    const id = parseInt(req.params.id);

    // check if review exists in database
    const review = await db.review.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        book: {
          select: {
            totalRating: true,
            totalReviews: true,
          },
        },
      },
    });

    // if review does not exist, return error
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    // add average rating to review with 2 decimal places and add review given by user or not
    review.book.averageRating = (
      review.book.totalRating / review.book.totalReviews
    ).toFixed(2);
    review.isReviewGiven = review.userId === req.user?.id;

    // return review
    return res.status(200).json({
      success: true,
      review: review,
    });
  } catch (error) {
    // return error message
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { getAllReviews, getReviewById };
