const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { loginSchema } = require("../../validations");
const { db } = require("../../lib/db");

const login = async (req, res) => {
  try {
    // get data from request body
    const data = req.body;
    // validate data
    const validatedData = loginSchema.safeParse(data);

    // check if data is valid
    if (!validatedData.success) {
      return res.status(400).json({
        success: false,
        errors: validatedData.error.errors,
      });
    }

    // get validated data
    const { email, password } = validatedData.data;

    // check if user exists
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);

    // if password is not correct
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // create token
    const jwtContent = {
      id: user.id,
      email: user.email,
    };

    const accessToken = jwt.sign(jwtContent, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30 days",
    });

    // send token as cookie
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    const userData = await db.user.findUnique({
      where: {
        id: user.id,
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

    // send user data
    return res.status(200).json({
      success: true,
      message: "User logged in",
      user: userData,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

module.exports = login;
