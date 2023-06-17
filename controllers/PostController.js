const PostModel = require('../models/Post');
const { validationResult } = require('express-validator');

const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to get Posts',
    });
  }
};

const getOne = async (req, res) => {
  try {
    const postId = await req.params.id;

    await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: {
          viewCount: 1,
        },
      },
      {
        returnDocument: 'after',
      },
    )
      .populate('user')
      .populate('comments.user')
      .exec()
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: 'Post not Found',
          });
        }

        res.json(doc);
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          message: 'Failed to get Post',
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to get Post',
    });
  }
};

const create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to Create a Post',
    });
  }
};

const update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to Update a Post',
    });
  }
};

const remove = async (req, res) => {
  try {
    const postId = await req.params.id;

    await PostModel.findOneAndDelete({
      _id: postId,
    })
      .populate('user')
      .exec()
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: 'Post not Found',
          });
        }

        res.json({
          _id: postId,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          message: 'Failed to Delete a Post',
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to Delete a Post',
    });
  }
};

const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const comment = {
      text: req.body.text,
      user: req.userId,
    };

    await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $push: {
          comments: comment,
        },
      },
      {
        returnDocument: 'after',
      },
    )
      .populate('user')
      .populate('comments.user')
      .exec()
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: 'Post not Found',
          });
        }

        res.json(doc.comments[doc.comments.length - 1]);
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          message: 'Failed to get Post',
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to add comment',
    });
  }
};

const removeComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commId = req.params.comm;

    await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $pull: {
          comments: { _id: commId },
        },
      },
      {
        returnDocument: 'after',
      },
    )
      .populate('user')
      .exec()
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: 'Post not Found',
          });
        }

        res.json({
          success: true,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          message: 'Failed to get Post',
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to remove comment',
    });
  }
};

module.exports = { create, update, remove, getAll, getOne, addComment, removeComment };
