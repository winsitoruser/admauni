import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

export const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user.id);

  const userData = {
    id: user.id,
    email: user.email,
    nim: user.nim,
    fullName: user.fullName,
    role: user.role,
    isVerified: user.isVerified
  };

  res.status(statusCode).json({
    success: true,
    token,
    user: userData
  });
};
