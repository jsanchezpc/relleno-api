const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const answerSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

const questionSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answers: [answerSchema],
  other: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const pollSchema = new Schema({
  author: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  questions: [questionSchema],
  shareLink : {
    type: String,
    required: false
  }
});

module.exports = mongoose.model("Poll", pollSchema);