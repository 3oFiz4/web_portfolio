// src/components/Card.jsx
import React, { forwardRef } from "react";

const Card = forwardRef(({ children }, ref) => {
  return (
    <div className="outer card-container center" ref={ref}>
      <div className="inner card-container">{children}</div>
    </div>
  );
});

Card.displayName = "Card";

export default Card;
