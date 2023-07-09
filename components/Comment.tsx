import { FC } from "react";

interface CommentProps extends React.HTMLAttributes<HTMLElement> {
  comment: string;
  id: string;
}

const Comment: FC<CommentProps> = ({ comment, is, ...props }) => {
  console.log(comment);
  return <div className=" text-black bg-fuchsia-600">{comment}</div>;
};

export default Comment;
