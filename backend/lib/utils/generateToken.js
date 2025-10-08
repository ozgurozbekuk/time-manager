import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  const fifteenDaysInMs = 15 * 24 * 60 * 60 * 1000;
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("jwt", token, {
    maxAge: fifteenDaysInMs,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
  });
};
