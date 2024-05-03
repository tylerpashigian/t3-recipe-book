import React, { useState } from "react";

import { motion } from "framer-motion";
import { IoHeart } from "react-icons/io5";

type Props = {
  isDisabled?: boolean;
  isInitiallyLiked: boolean;
  onClick?: (isLiked: boolean) => void;
};

const LikeButton = ({
  isDisabled = false,
  isInitiallyLiked,
  onClick,
}: Props) => {
  const [isLiked, setLiked] = useState(isInitiallyLiked);

  const handleClick = (event: React.FormEvent) => {
    event.preventDefault();
    setLiked((prev) => {
      onClick?.(!prev);
      return !prev;
    });
  };

  return (
    <motion.div
      whileTap={{ scale: 0.8 }}
      transition={{ type: "spring", stiffness: 500, damping: 15 }}
    >
      <button
        className="flex h-6 w-6 items-center justify-center rounded-full focus:outline-none"
        disabled={isDisabled}
        onClick={handleClick}
      >
        <IoHeart
          className={`h-6 w-6 fill-current ${
            isLiked ? "text-red-500" : "text-gray-300"
          }`}
        />
      </button>
    </motion.div>
  );
};

export default LikeButton;
