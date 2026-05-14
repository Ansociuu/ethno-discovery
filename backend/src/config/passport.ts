import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import prisma from '../lib/prisma';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'mock_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock_secret',
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) return done(new Error('No email found from Google'));

        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { providerId: profile.id, provider: 'google' },
              { email: email }
            ]
          }
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: email,
              name: profile.displayName,
              avatarUrl: profile.photos?.[0].value,
              provider: 'google',
              providerId: profile.id,
              password: '', // Không dùng password cho OAuth
            }
          });
        } else if (!user.provider) {
          // Nếu user đã có email nhưng chưa liên kết OAuth
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              provider: 'google',
              providerId: profile.id,
              avatarUrl: user.avatarUrl || profile.photos?.[0].value,
            }
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID || 'mock_id',
      clientSecret: process.env.FACEBOOK_APP_SECRET || 'mock_secret',
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/facebook/callback`,
      profileFields: ['id', 'displayName', 'photos', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value || `${profile.id}@facebook.com`;
        
        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { providerId: profile.id, provider: 'facebook' },
              { email: email }
            ]
          }
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: email,
              name: profile.displayName,
              avatarUrl: profile.photos?.[0].value,
              provider: 'facebook',
              providerId: profile.id,
              password: '',
            }
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});
