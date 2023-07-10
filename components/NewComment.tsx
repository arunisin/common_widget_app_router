"use client";
import React, { FC, useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
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

interface NewCommentProps extends React.HTMLAttributes<HTMLDivElement> {
  parentId: string;
  onSave: () => void;
  onCancel: () => void;
}

const NewComment: FC<NewCommentProps> = ({
  parentId,
  onSave,
  onCancel,
  ...props
}) => {
  const [NewComment, setNewComment] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  const handleSave = async () => {
    try {
      await fetch("/api/comment/new", {
        method: "POST",
        body: JSON.stringify({
          body: form.getValues("comment"),
          parentCommentId: parentId,
        }),
      });
      console.log(form.getValues("comment"));
      onSave();
    } catch (error) {
      console.log(error, " from POST");
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Card className={cn(" text-black w-96 p-5", props.className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)}>
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Add a reply..."
                    className="mb-5 rounded-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className=" flex gap-2 justify-end pt-4">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="submit">save</Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default NewComment;
