import { FC } from 'react'
import { motion } from 'framer-motion'

import './index.scss'

interface ButtonProps {
  className?: string
  text: string
  clickHandle?: () => void
  disabled?: boolean
  ref?: React.RefObject<HTMLButtonElement>
}

const Button: FC<ButtonProps> = ({ className, text, clickHandle, disabled, ref }) => {
  const buttonVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  }

  return (
    <motion.button
      className={`button ${className ? className : ''} ${disabled ? 'disabled' : ''}`}
      onClick={clickHandle}
      disabled={disabled}
      variants={buttonVariants}
      initial="hidden"
      animate="visible"
      ref={ref}
      exit="hidden"
    >
      {text}
    </motion.button>
  )
}

export default Button
