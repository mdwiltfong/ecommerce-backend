const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const findUserByEmail = require("../models/user").findUserByEmail;

module.exports = (app) => {
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Set method to serialize data to store in cookie
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Set method to deserialize data stored in cookie and attach to req.user
  passport.deserializeUser((id, done) => {
    done(null, { id });
  });

  // Configure local strategy to be use for local login
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" }, //opts
      async (email, password, done) => {
        // Check for user in PostgreSQL database
        const user = await findUserByEmail(email);
        if (!user) {
          // no user found
          return done(null, false, {
            message: "No user found with that email",
          });
        }

        try {
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) {
            return done(null, false, { message: "Wrong password." });
          }
          // if inputted password matches the database password for that user
          return done(null, user);
        } catch (err) {
          // return callback with error if we made it to this point
          return done(err);
        }
      }
    )
  );

  return passport;
};
