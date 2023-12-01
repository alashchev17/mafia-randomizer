import { FC } from "react";

import "./index.scss";

interface ButtonProps {
  className?: string;
  text: string;
  clickHandle?: () => void;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({
  className,
  text,
  clickHandle,
  disabled,
}) => {
  return (
    <button
      className={`button ${className ? className : ""} ${
        disabled ? "disabled" : ""
      }`}
      onClick={clickHandle}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
