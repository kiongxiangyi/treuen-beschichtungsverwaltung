import { useState } from "react";
import { motion } from "framer-motion";
import "./Button.css";

//https://www.youtube.com/watch?v=3IN9gXS-UKk
const Button = ({ children }) => {
  const [hovered, setHovered] = useState(false);
  const backgroundVariants = {
    closed: {
      width: 0,
    },
    open: {
      width: "100%",
    },
  };

  const textVariants = {
    closed: {
      color: "var(--button-text-color)",
    },
    open: {
      color: "var(--button-text-color-hovered)",
      
    },
  };

  return (
    <button
      className="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="button__background"
        variants={backgroundVariants}
        initial="closed"
        animate={hovered ? "open" : "closed"}
        transition={
          hovered
            ? { type: "easeIn", stiffness: 100, duration: 0.2 }
            : { type: "easeOut", stiffness: 100, duration: 0.2 }
        }
      ></motion.div>
      <motion.div
        className="button__text"
        variants={textVariants}
        initial="closed"
        animate={hovered ? "open" : "closed"}
        transition={{
          ease: "easeOut",
          duration: 0.3,
          delay: hovered ? 0 : 0.2,
        }}
      >
        {children}
      </motion.div>
    </button>
  );
};

export default Button;
