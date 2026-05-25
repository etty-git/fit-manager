const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Users = require("../models/User");

// פונקציה לניקוי שם (מונעת ג'יבריש במקרים מסוימים)
const fixName = (name) => {
  if (!name) return "";

  try {
    return decodeURIComponent(escape(name));
  } catch {
    return name;
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/users/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        console.log("GOOGLE NAME:", profile.displayName);

        // חיפוש משתמש לפי googleId או email
        let user = await Users.findOne({
          $or: [
            { googleId: profile.id },
            { email: email },
          ],
        });

        // אם המשתמש לא קיים - יוצרים חדש
        if (!user) {
          user = await Users.create({
            googleId: profile.id,
            name: fixName(profile.displayName),
            email: email,
            username: email ? email.split("@")[0] : profile.id,
            role: "member",
          });
        } else {
          // אם קיים אבל אין googleId - מחברים חשבון
          if (!user.googleId) {
            user.googleId = profile.id;
          }

          // עדכון שם אם חסר / לא תקין
          if (!user.name && profile.displayName) {
            user.name = fixName(profile.displayName);
          }

          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// שמירת משתמש בסשן (נדרש אם אתה משתמש ב-session של passport)
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// שליפה לפי ID מהמסד
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Users.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});