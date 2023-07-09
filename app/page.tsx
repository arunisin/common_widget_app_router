"use client";
import { useEffect, useRef, useState } from "react";
import Comment from "@/components/Comment";
import { CommentsByIdProps } from "./api/route";
import { set } from "mongoose";

export default function Home() {
  const [comments, setComments] = useState<CommentsByIdProps[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const postData = async () => {
    if (!inputRef.current) return console.log("no input");
    const comment = inputRef.current.value;

    try {
      fetch("/api/new", {
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

  return (
    <main>
      <input type="text" ref={inputRef} />
      <button onClick={postData}>fetch data</button>
      {Object.values(comments).map((comment, index) => (
        <Comment comment={comment.body} key={index} id={comment._id} />
      ))}
       {/* <Comment comment={"gassd"} id="sss" /> */}
    </main>
  );
}
