import { connectToDB } from "@/lib/database";
import Comment from "@/models/comments";

export async function PATCH(req: Request, { params }: any) {
  const body = await req.json();
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
    console.log(params.id, " going to delete");
    await Comment.findByIdAndRemove(params.id);

    return new Response("Prompt deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Error deleting prompt", { status: 500 });
  }
};
