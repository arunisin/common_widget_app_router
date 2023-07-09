import { Schema, model, models } from "mongoose";

const commentsSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  timeStapm: {
    type: Date,
    default: Date.now,
  },
  parentCommentId: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
});

const Comment = models.Comment || model("Comment", commentsSchema);

export default Comment;
