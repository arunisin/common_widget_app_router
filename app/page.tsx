"use client";
import { useEffect, useRef, useState } from "react";
import Comment from "@/components/Comment";
import { CommentsByIdProps } from "./api/route";
import { set } from "mongoose";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface CommentData {
  _doc: {
    parentCommentId: string | null;
    body: string;
    _id: string;
  };
  replies: any[]; // replace any with your reply object type if available
}
export default function Home() {
  const [comments, setComments] = useState<CommentsByIdProps[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const postData = async () => {
    if (!inputRef.current) return console.log("no input");
    const comment = inputRef.current.value;

    try {
      const response = await fetch("/api/comment/new", {
        method: "POST",
        body: JSON.stringify({
          body: comment,
        }),
      });
      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    setComments([]);
    try {
      const response = await fetch("/api", {
        method: "GET",
      });

      const data: CommentData[] = await response.json();

      const topLevelComments = Object.values(data).filter(
        (comment) => comment._doc.parentCommentId == null
      );
      
      console.log(data);
      setComments(topLevelComments);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log(comments, " is the comments");
  }, [comments]);

  const processReplies = (replies: any) =>
    replies.map((reply: any) => ({
      comment: reply._doc.body,
      id: reply._doc._id,
      replies: processReplies(reply.replies),
    }));

  return (
    <main className=" flex flex-col gap-3 px-36 pt-36">
      <Card className=" text-black p-5 flex flex-col gap-3">
        <CardTitle> add a new comment</CardTitle>
        <CardContent className="flex flex-col gap-3">
          <textarea
            placeholder=" write your comment"
            ref={inputRef}
            className="h-32 border rounded-sm border-gray-500"
          />
          <Button onClick={postData} className="w-64">
            Save
          </Button>
        </CardContent>
      </Card>
      <hr />

      {Object.values(comments).map((comment) => (
        <Comment
          comment={comment._doc.body}
          key={comment._doc._id}
          id={comment._doc._id}
          replies={processReplies(comment.replies)}
          newComment={fetchData}
          onDelete={fetchData}
          onReply={fetchData}
        />
      ))}
    </main>
  );
}
