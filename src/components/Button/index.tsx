import { FC } from "react";

import "./index.scss";

interface ButtonProps {
  className?: string;
  text: string;
  clickHandle?: () => void;
}

const Button: FC<ButtonProps> = (props: ButtonProps) => {
  const { className, text, clickHandle } = props;
  return (
    <button
      className={`button ${className ? className : ""}`}
      onClick={clickHandle}
    >
      {text}
    </button>
  );
};

export default Button;
