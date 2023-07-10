"use client";
import { useEffect, useRef, useState } from "react";
import Comment from "@/components/Comment";
import { CommentsByIdProps } from "./api/route";
import { set } from "mongoose";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [comments, setComments] = useState<CommentsByIdProps[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const postData = async () => {
    if (!inputRef.current) return console.log("no input");
    const comment = inputRef.current.value;

    try {
      fetch("/api/comment/new", {
        method: "POST",
        body: JSON.stringify({
          body: comment,
        }),
      });
    } catch (error) {}
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api", {
          method: "GET",
        });

        const data = await response.json();
        console.log(data);
        setComments(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect((   ) => {console.log(comments, ' is the comments')},[comments])

  return (
    <main className=" flex flex-col gap-3 px-36 pt-36">
      <Card className=" text-black p-5 flex flex-col gap-3">
        <CardTitle> add a new comment</CardTitle>
        <CardContent className="flex flex-col gap-3">
           
            {/* <Input type="text" ref={inputRef} /> */}
            <textarea placeholder=" write your comment" ref={inputRef} className="h-32 border rounded-sm border-gray-500"/>
            <Button onClick={postData} className="w-64">Save</Button>
        </CardContent>
      </Card>
      <hr/>
      {Object.values(comments).map((comment, index) => (
       comment.replies.length<1 &&<Comment comment={comment._doc.body} key={index} id={comment._doc._id} replies={comment.replies}/>
      ))}
       {/* <Comment comment={"gassd"} id="sss" /> */}
    </main>
  );
}
