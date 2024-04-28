import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GithubStrategy } from 'passport-github2'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import UserModel from '../models/user.model.js'
import { createHash, isValidPassword, JWT_SECRET } from '../utils.js'

export const init = () => {
  const registerOpts = {
    usernameField: 'email',
    passReqToCallback: true,
  }

  const githubOpts = {
    clientID: 'Iv1.6939e7339922c1cd',
    clientSecret: "aff09d33f754360b19243556b8b759dfb30cbce8",
    callbackURL: 'http://localhost:8080/api/sessions/github/callback',
  }
  passport.use('github', new GithubStrategy(githubOpts, async (accesstoken, refreshToken, profile, done) => {
    const email = profile._json.email
    console.log('email es: ',email)
    let user = await UserModel.findOne({ email })
    if (user) {
      return done(null, user)
    }
    user = {
      first_name: profile._json.name,
      last_name: '',
      email, 
      password: '',
      provider: 'github',
      providerId: profile.id,
      age: 18,
    };
    const newUser = await UserModel.create(user)
    done(null, newUser)
  }));

  const cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies) {
      token = req.cookies['access_token']
    }
    console.log('token', token)
    return token
  }

  passport.use('current', new JwtStrategy({
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  }, (payload, done) => {
    console.log('payload', payload)
    done(null, payload)
  }))
} 

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser(async (uid, done) => {
  const user = await UserModel.findById(uid)
  done(null, user)
})
