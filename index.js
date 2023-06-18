const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const {
  registerValidation,
  loginValidation,
  postCreateValidation,
} = require('./validations/index');
const checkAuth = require('./utils/checkAuth');
const UserController = require('./controllers/UserController');
const PostController = require('./controllers/PostController');

const app = express();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('DB OK'))
  .catch((err) => console.log(('DB error', err)));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/auth/register', registerValidation, UserController.register);
app.post('/auth/login', loginValidation, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
app.patch('/posts/:id', checkAuth, postCreateValidation, PostController.update);
app.delete('/posts/:id', checkAuth, PostController.remove);

app.post('/posts/:id/comment', checkAuth, PostController.addComment);
app.delete('/posts/:id/uncomment/:comm', checkAuth, PostController.removeComment);

app.listen(7777, (err) => {
  if (err) {
    console.log(err);
  }

  console.log('Server OK');
});
