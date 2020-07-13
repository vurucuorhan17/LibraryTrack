const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require("express-session");
const exphbs = require("express-handlebars");
const fileUpload = require("express-fileupload");
//const busboy = require("connect-busboy");
const connectMongo = require("connect-mongo");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const passport = require("passport");
const passportSetup = require("./config/passport-setup");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const booksRouter = require("./routes/books");
const authorRouter = require("./routes/authors");
const adminRouter = require("./routes/admin");
const paymentRouter = require("./routes/payment");

const app = express();

mongoose.connect(process.env.MONGOLAB_URI || "mongodb://127.0.0.1:27017/librarytrack-db",{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
.then(() => console.log("MongoDB: Bağlandı"))
.catch((err) => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine("handlebars",exphbs());
app.set('view engine', 'handlebars');

const mongoStore = connectMongo(session);

app.use(session({
  secret:"test",
  resave: false,
  saveUninitialized: true,
  store: new mongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/books",booksRouter);
app.use("/authors",authorRouter);
app.use("/admin",adminRouter);
app.use("/payment",paymentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
