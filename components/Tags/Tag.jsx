import React from "react";
import "./Tag.css";
const Tag = (props) => {
  return (
    <span className="tag" style={{ backgroundColor: `${props?.color}` }}>
      {props?.tagName}
    </span>
  );
};

export default Tag;
