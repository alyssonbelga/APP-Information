import React from "react";
import "../styles/ui.css";

type CardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <section className={`ui-card ${className ?? ""}`.trim()}>
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
};
