const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const GithubStrategy = require("passport-github").Strategy;
const keys = require("../config/keys");
const User = require("../models/User");

passport.serializeUser((user,done) => {
    done(null,user.id);
});

passport.deserializeUser((id,done) => {
    User.findById(id)
    .then((user) => {
        done(null,user);
    })
    .catch((err) => {
        done(err,null);
    });

});

passport.use(
    new GoogleStrategy({
        callbackURL: "/users/login/google/redirect",
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    },(accessToken,refreshToken,profile,done) => {
        //console.log(profile);
        User.findOne({googleID: profile.id})
        .then((currentUser) => {
            if(currentUser)
            {
                console.log("Kullanıcı: " + currentUser);
                done(null,currentUser);
            }
            else
            {
                User.create({
                    name: profile.displayName,
                    googleID: profile.id,
                    picture: profile.photos[0].value,
                })
                .then((user) => {
                    console.log("Yeni Google Kullanıcısı Oluşturuldu: " + user);
                    done(null,user);
                })
                .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
        

    })
    
);

passport.use(new GithubStrategy({
        callbackURL: "/users/login/github/redirect",
        clientID: keys.github.clientID,
        clientSecret: keys.github.clientSecret
    },(accessToken,refreshToken,profile,done) => {
        console.log(profile);
        User.findOne({githubID:profile.id})
        .then((currentUser) => {
            if(currentUser)
            {
                done(null,currentUser);
            }
            else
            {
                User.create({
                    name: profile._json.name,
                    githubID: profile.id,
                    address: profile._json.location,
                    picture: profile._json.avatar_url
                })
                .then((newUser) => {
                    done(null,newUser);
                })
                .catch(err => console.log(err));
            }
        
            
        })
        .catch(err => console.log(err));
    })
);

