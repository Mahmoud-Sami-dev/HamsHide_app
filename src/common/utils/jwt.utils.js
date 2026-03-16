import jwt from "jsonwebtoken";
import crypto from "node:crypto";
export function signToken(payload, secret, options) {
  payload.jti = crypto.randomBytes(10).toString("hex");
  return jwt.sign(payload, secret, options);
}
export function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

export function generateTokens(payload) {
  const accessToken = signToken(
    payload,
    "ihuujgbvvvbcfujuujbjvjudvujjjjeuvjb",
    {
      issuer: "whatsapp.com",
      audience: ["instagram.com", "facebook.com"],
      expiresIn: 30,
    },
  );
  const refreshToken = signToken(
    payload,
    "aihuujgbvvvbcfujuujbjvjudvujjjjeuvjb",
    { expiresIn: "1y" },
  );
  return { accessToken, refreshToken };
}
