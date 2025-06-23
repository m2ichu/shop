import jwt from 'jsonwebtoken';
export const isLogged = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded; 
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
