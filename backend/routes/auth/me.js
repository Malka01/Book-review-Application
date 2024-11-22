const { db } = require("../../lib/db");

const me = async (req, res) => {
  try {
    // get user id from request
    const userId = req.user.id;
    // get user data
    const userData = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        reviews: {
          select: {
            isbn: true,
            title: true,
            author: true,
            rating: true,
            review: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = me;
