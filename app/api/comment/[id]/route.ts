import { connectToDB } from "@/lib/database";
import Comment from "@/models/comments";
import { comment } from "postcss";

export async function PATCH(req: Request, { params }: any) {
  // console.log(req, ' is the request')
  const body = await req.json();
  // console.log(body);
  try {
    await connectToDB();
    const comment = await Comment.findById(params.id);
    console.log("comment found", comment);
    if (!comment) {
      return new Response("failed", { status: 500 });
    }

    comment.body = body.body;

    await comment.save();
    console.log("edited");
  } catch (err) {
    return new Response("failed", { status: 500 });
  }
}

export const DELETE = async (req: Request, { params }: any) => {
  try {
    await connectToDB();

    // Find the prompt by ID and remove it
    await Comment.findByIdAndRemove(params.id);

    return new Response("Prompt deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Error deleting prompt", { status: 500 });
  }
};
