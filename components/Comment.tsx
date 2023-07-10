"use client";
import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
interface CommentProps {
  comment: string;
  id: string;
  replies?: CommentProps[];
}
import NewComment from "./NewComment";

const Comment: FC<CommentProps> = ({ comment, id,replies=[], ...props }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState("");
  const [currentComment, setCurrentComment] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    setCurrentComment(comment);
    console.log(comment)
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      const response = fetch(`/api/comment/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          body: editedComment,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setIsEditing(false);
      setCurrentComment(editedComment);
      // const data = await response.json();
      // console.log(data);
    } catch (err) {
      console.log(err, " is the error from save");
    }
  };

  const handleDelete  = async () => {
    try {
      const response = fetch(`/api/comment/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      // setIsEditing(false);
      // setCurrentComment(editedComment);
      // const data = await response.json();
      // console.log(data);
    } catch (err) {
      console
  }
}

  const handleReply = () => setIsReplying(true);
  return (
    <div className=" flex">
      <Card className=" text-black w-96 p-5">
        {isEditing ? (
          <>
            <Input
              defaultValue={currentComment}
              onChange={(e) => setEditedComment(e.target.value)}
              className="mb-5 rounded-sm"
            />
            <div className=" flex gap-2 justify-end">
              <Button onClick={handleSave}>save</Button>
            </div>
          </>
        ) : (
          <>
            <CardContent className="  mb-5 rounded-sm">
              {currentComment}
            </CardContent>
            <div className=" flex gap-2 justify-between">
              <div className=" flex gap-2">
                <Button onClick={handleEdit}>edit</Button>
                <Button onClick={handleDelete}>delete</Button>
              </div>
              <Button onClick={handleReply}>Reply</Button>
            </div>
          </>
        )}
      </Card>

      {replies.length > 0 && replies.map((reply,index)=><Comment comment={reply.comment} id={reply.id} key={index} />)}

      {isReplying && (
        <NewComment
          parentId={id}
          className=" absolute left-5 "
          onSave={() => setIsReplying(false)}
        />
      )}
    </div>
  );
};

export default Comment;
