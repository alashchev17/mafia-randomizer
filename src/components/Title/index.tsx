import { FC } from "react";

import "./index.scss";

interface TitleProps {
  text: string;
}
const Title: FC<TitleProps> = (props: TitleProps) => {
  const { text } = props;

  return <h1 className="title">{text}</h1>;
};

export default Title;
