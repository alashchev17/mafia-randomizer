import { FC } from "react";
import { motion } from "framer-motion";

import "./index.scss";

interface ButtonProps {
  className?: string;
  text: string;
  clickHandle?: () => void;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({ className, text, clickHandle, disabled }) => {
  const buttonVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };

  return (
    <motion.button
      className={`button ${className ? className : ""} ${disabled ? "disabled" : ""}`}
      onClick={clickHandle}
      disabled={disabled}
      variants={buttonVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {text}
    </motion.button>
  );
};

export default Button;
