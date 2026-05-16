import { FC } from "react";

import "./index.scss";

interface TitleProps {
  text: string;
  className?: string;
}
const Title: FC<TitleProps> = ({ text, className }) => {
  return <h1 className={`title ${className || ""}`}>{text}</h1>;
};

export default Title;
