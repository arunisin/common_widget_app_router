"use client";
import { useEffect, useRef, useState } from "react";
import Comment from "@/components/Comment";
import { CommentsByIdProps } from "./api/route";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  comment: z.string().min(2, {
    message: "Enter a valid comment",
  }),
});

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  const postData = async () => {
    try {
      const response = await fetch("/api/comment/new", {
        method: "POST",
        body: JSON.stringify({
          body: form.getValues("comment"),
        }),
      });
      const data = await response.json();
      fetchData();
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

  const processReplies = (replies: any) =>
    replies.map((reply: any) => ({
      comment: reply._doc.body,
      id: reply._doc._id,
      replies: processReplies(reply.replies),
    }));

  return (
    <main className=" flex flex-col gap-3 px-36 pt-36">
      <Card className=" text-black p-5 flex flex-col gap-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(postData)}>
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem className=" flex flex-col">
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder=" write your comment"
                      className="h-32 border rounded-sm border-gray-500 p-5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className=" flex gap-2 justify-end pt-4">
              <Button type="submit">save</Button>
            </div>
          </form>
        </Form>
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
