import { connectToDB } from "@/lib/database";
import Comment from "@/models/comments";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    await connectToDB();
    const newComment = new Comment(body);
    await newComment.save();
    console.log('saved')
    return new Response(JSON.stringify(newComment), { status: 201 });
  } catch (err) {
    return new Response("failed", { status: 500 });
  }
}
