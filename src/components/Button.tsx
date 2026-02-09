import React from "react";
import "../styles/ui.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export const Button: React.FC<ButtonProps> = ({ variant = "primary", ...props }) => {
  return <button className={`ui-button ${variant}`} {...props} />;
};
