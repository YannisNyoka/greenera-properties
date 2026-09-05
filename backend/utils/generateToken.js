import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true, // JS on the frontend can NEVER read this cookie — kills XSS token theft
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict', // blocks the cookie being sent on cross-site requests — CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, matches token expiry
  });
};

export default generateToken;