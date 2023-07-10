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
interface CommentProps extends React.HTMLAttributes<HTMLElement> {
  comment: string;
  id: string;
  replies?: CommentProps[];
  newComment: () => void;
  onDelete: () => void;
  onReply: () => void;
}
import NewComment from "./NewComment";
import { cn } from "@/lib/utils";

const Comment: FC<CommentProps> = ({
  comment,
  id,
  replies = [],
  newComment,
  onDelete,
  onReply,
  ...props
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState("");
  const [currentComment, setCurrentComment] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [localReplies, setLocalReplies] = useState(replies);

  const fetchCommentAndReplies = async () => {
    const response = await fetch(`/api/comment/${id}`);
    const commentData = await response.json();

    setLocalReplies(
      commentData.replies.map((reply: any) => ({
        comment: reply._doc.body,
        id: reply._doc._id,
        replies: reply.replies,
      }))
    );
  };

  useEffect(() => {
    setCurrentComment(comment);
    console.log(comment);
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleEditSave = async () => {
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
    } catch (err) {
      console.log(err, " is the error from save");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/comment/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      onDelete();
    } catch (err) {
      console;
    }
  };

  const handleCancel = () => setIsEditing(false);

  const handleReply = () => setIsReplying(true);

  const handleNewCommentSave = () => {
    newComment();
    setIsReplying(false);
  };

  return (
    <div className={cn(" flex flex-col gap-3 ", props.className)}>
      <Card className=" text-black w-96 p-5">
        {isEditing ? (
          <>
            <Input
              defaultValue={currentComment}
              onChange={(e) => setEditedComment(e.target.value)}
              className="mb-5 rounded-sm"
            />
            <div className=" flex gap-2 justify-end">
              <Button onClick={handleCancel}>cancel</Button>
              <Button onClick={handleEditSave}>save</Button>
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

      {replies.length > 0 &&
        replies.map((reply, index) => (
          <div key={reply.id} className=" border-l-2">
            <Comment
              comment={reply.comment}
              id={reply.id}
              key={reply.id}
              replies={reply.replies}
              className=" ml-5 "
              newComment={newComment}
              onDelete={onDelete}
              onReply={onReply}
            />
          </div>
        ))}

      {isReplying && (
        <div className="relative ">
          <NewComment
            parentId={id}
            className=" absolute left-5 "
            onSave={handleNewCommentSave}
            onCancel={() => setIsReplying(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Comment;
