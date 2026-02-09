import React from "react";
import "../styles/ui.css";

type WindowFrameProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export const WindowFrame: React.FC<WindowFrameProps> = ({ title, children, className }) => {
  return (
    <div className={`window-frame ${className ?? ""}`.trim()}>
      <div className="window-title">
        <span>{title}</span>
        <div className="window-controls">
          <span className="control">—</span>
          <span className="control">□</span>
          <span className="control close">×</span>
        </div>
      </div>
      <div className="window-body">{children}</div>
    </div>
  );
};
