import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { Check, X } from "react-feather";
import "./Label.css";
export default function (props) {
  const input = useRef();
  const [selectedColor, setSelectedColor] = useState("");
  const [label, setLabel] = useState("");

  const isColorUsed = (color) => {
    const isFound = props.tags.find((item) => item.color === color);

    return isFound ? true : false;
  };

  return (
    
      <div className="popover__wrapper">
        <div className="popover__content">
          <div className="label__heading">
            <p className="label__title">
              <b>Label</b>
            </p>
            <X
              onClick={() => props.onClose(false)}
              style={{ cursor: "pointer", width: "15px", height: "15px" }}
            />
          </div>
          <div>
            <p className="label__field-label">Name</p>
            <div className="label__input">
              <input
                type="text"
                ref={input}
                defaultValue={label}
                placeholder="Name of label"
                onChange={(e) => {
                  setLabel(e.target.value);
                }}
              />
            </div>
            <p className="label__field-label label__field-label--spaced">
              Select color
            </p>
            <div className="color__palette">
              {props.color.map((item, index) => (
              <span
  onClick={() => setSelectedColor(item)}
  key={index}
  style={{ backgroundColor: item, cursor: "pointer" }}
>
  {selectedColor === item ? <Check className="icon__sm" /> : ""}
</span>
              ))}
            </div>
            <div>
              <button
                className="create__btn"
onClick={() => {
  if (!label.trim()) {
    alert("Enter label name");
    return;
  }

  if (!selectedColor) {
    alert("Please select color for label.");
    return;
  }

  props.addTag(label, selectedColor);

  setSelectedColor("");
  setLabel("");
  input.current.value = "";
}}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    
  );
}
