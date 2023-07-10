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
    // console.log(comments);

    let commentsById: CommentsByIdProps = {};

    comments.forEach(comment => {
      commentsById[comment._id] = {...comment, replies: []};
    });
    
    // Build the replies arrays for each comment
    comments.forEach(comment => {
      if (comment.parentCommentId && commentsById[comment.parentCommentId]) {
        commentsById[comment.parentCommentId].replies.push(commentsById[comment._id]);
      }
    });

    // console.log(commentsById);

    // let topLevelComments = comments.filter(
    //   (comment) => !comment.parentCommentId
    // );
    return new Response(JSON.stringify(commentsById));
  } catch (err) {
    return new Response("failed", { status: 500 });
  }
}
