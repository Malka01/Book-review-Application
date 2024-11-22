const logout = async (req, res) => {
  try {
    res.clearCookie("access_token");
    res.json({
      success: true,
      message: "Logout successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = logout;
