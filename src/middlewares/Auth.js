const jwt = require("jsonwebtoken");

let Auth = (req, res, next) => {
  try {
    jwt.verify(req.body.token, process.env.SEED, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          err: {
            message: "Invalid token",
          },
        });
      }
      req.body.user = decoded.user;
      next();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = Auth;
