// src/components/components/Card.jsx
import React, { forwardRef } from "react";

const Card = forwardRef(({ children }, ref) => {
  return (
    <div
      ref={ref}
      className="card"
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
});

export default Card;
