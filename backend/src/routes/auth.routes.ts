import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { 
  register, login, refresh, getMe, updateMe, changePassword,
  forgotPassword, verifyOTP, resetPassword, verifyRegisterOTP 
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/verify-register', verifyRegisterOTP);
router.post('/login', login);
router.post('/refresh', refresh);
router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, updateMe);
router.post('/change-password', authenticate, changePassword);

// Password reset
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

// OAuth Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed` }),
  (req: any, res) => {
    const user = req.user;
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
    );
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  }
);

// OAuth Facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed` }),
  (req: any, res) => {
    const user = req.user;
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
    );
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  }
);

export default router;
