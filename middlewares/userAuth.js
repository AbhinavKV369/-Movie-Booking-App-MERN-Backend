import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
  let token;
  if (req.headers.client === "not-browser") {
    token = req.headers.authorization;
  } else {
    token = req.cookies["Autorization"];
  }
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized Access" });
  }
  try {
    const userToken = token.split(" ")[1];
    const verified = jwt.verify(userToken, process.env.JWT_SECRET);
    if (verified) {
      req.user = verified;
      next();
    } else {
      throw new Error("Error in token");
    }
  } catch (error) {
    console.log(error);
  }
};
