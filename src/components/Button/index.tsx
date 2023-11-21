import { FC } from "react";

import "./index.scss";

interface ButtonProps {
  className?: string;
  text: string;
  clickHandle?: () => void;
}

const Button: FC<ButtonProps> = ({ className, text, clickHandle }) => {
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
