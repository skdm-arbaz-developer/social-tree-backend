import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

export const verifySuperadmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.userRole !== 'superadmin') {
      return res.status(403).json({ message: 'Require Superadmin Role' });
    }
    next();
  });
};

export const verifyClient = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.userRole !== 'client') {
      return res.status(403).json({ message: 'Require Client Role' });
    }
    next();
  });
};
