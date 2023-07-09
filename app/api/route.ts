// import clientPromise from "@/lib/mongoDb";
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/database";
import Comment from "@/models/comments";

export interface CommentsByIdProps {
  [key: string]: any;
}

export async function GET() {
  try {
    await connectToDB();

    const comments = await Comment.find({});
    console.log(comments);

    let commentsById: CommentsByIdProps = {};

    for (let comment of comments) {
      commentsById[comment._id] = { ...comment._doc, replies: [] };

      for (let comment of comments) {
        if (comment.parentCommentId) {
          commentsById[comment.parentCommentId].replies.push(
            commentsById[comment._id]
          );
        }
      }
    }

    console.log(commentsById);

    let topLevelComments = comments.filter(
      (comment) => !comment.parentCommentId
    );
    return new Response(JSON.stringify(topLevelComments));
  } catch (err) {
    return new Response("failed", { status: 500 });
  }
}