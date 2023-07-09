"use client";
import React, { FC, useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface NewCommentProps extends React.HTMLAttributes<HTMLDivElement> {
  parentId: string;
  onSave: () => void;
}

const NewComment: FC<NewCommentProps> = ({ parentId, ...props }) => {
  const [NewComment, setNewComment] = useState("");

  const handleSave = async () => {
    try {
      fetch("/api/new", {
        method: "POST",
        body: JSON.stringify({
          body: NewComment,
          parentCommentId: parentId,
        }),
      });
    } catch (error) {
      console.log(error, " from POST");
    }
  };

  return (
    <Card className={cn(" text-black w-96 p-5", props.className)}>
      <Input
        placeholder="Add a reply..."
        onChange={(e) => setNewComment(e.target.value)}
        className="mb-5 rounded-sm"
      />
      <div className=" flex gap-2 justify-end">
        <Button onClick={handleSave}>save</Button>
      </div>
    </Card>
  );
};

export default NewComment;
