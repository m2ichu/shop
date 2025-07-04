import jwt from 'jsonwebtoken';

export const isGuest = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(403).json({ message: 'Already logged in' });
    } catch (err) {

      return next();
    }
  }
  next();
};
