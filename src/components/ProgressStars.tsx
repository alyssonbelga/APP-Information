import React from "react";
import "../styles/ui.css";

type ProgressStarsProps = {
  stars: number;
  size?: "small" | "large";
};

export const ProgressStars: React.FC<ProgressStarsProps> = ({ stars, size = "small" }) => {
  return (
    <div className={`stars ${size}`}>
      {[0, 1, 2].map((index) => (
        <span key={index} className={index < stars ? "filled" : "empty"}>
          ★
        </span>
      ))}
    </div>
  );
};
