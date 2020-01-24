import {PassportStatic} from "passport";
import { Strategy } from "passport-local";
import passportJwt from "passport-jwt";
import { User, UserDocument } from "../models/User";
import { JWT_SECRET } from "../config/secrets";


/*
const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

passport.use(new LocalStrategy({ usernameField: "username" }, (username, password, done) => {
  console.log("authenticating");
  User.findOne({ username: username.toLowerCase() }, (err, user: any) => {
    if (err) { return done(err); }
    if (!user) {
      return done(undefined, false, { message: `username ${username} not found.` });
    }
    user.comparePassword(password, (err: Error, isMatch: boolean) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(undefined, user);
      }
      return done(undefined, false, { message: "Invalid username or password." });
    });
  });
}));

passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
  }, function (jwtToken, done) {
    User.findOne({ username: jwtToken.username }, function (err, user) {
      if (err) { return done(err, false); }
      if (user) {
        return done(undefined, user , jwtToken);
      } else {
        return done(undefined, false);
      }
    });
  }));
*/
//Logique d'authentification JWT
export const JwtAuthentication = function (passport: PassportStatic) {
  const opts: passportJwt.StrategyOptions = {
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderWithScheme("jwt"),
    secretOrKey: JWT_SECRET
  };
  passport.use(new passportJwt.Strategy(opts, function (jwtPayload: any, done) {
    User.findOne({ id: jwtPayload.id }, function (err: any, user: any) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }));
  return passport;
};

export const Login = function (passport: PassportStatic) {
  console.log("Login");
  passport.use(new Strategy({ usernameField: "email",   passwordField: "password"  },
  (username, password, done) => {
    console.log("passport.local");
    User.findOne({ email: username.toLowerCase() }, (err, user: any) => {
      if (err) { return done(err); }
      if (!user) {
        return done(undefined, false, { message: `username ${username} not found.` });
      }
      user.comparePassword(password, (err: Error, isMatch: boolean) => {
        if (err) { return done(err); }
        if (isMatch) {
          return done(undefined, user);
        }
        return done(undefined, false, { message: "Invalid username or password." });
      });
    });
  }));
  return passport;
};
