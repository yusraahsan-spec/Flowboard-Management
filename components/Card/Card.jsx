import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Calendar, CheckSquare, Clock, MoreHorizontal } from "react-feather";
import Dropdown from "../Dropdown/Dropdown";
import Modal from "../Modal/Modal";
import Tag from "../Tags/Tag";
import "./Card.css";
import CardDetails from "./CardDetails/CardDetails";
const Card = (props) => {
  const calculatePercent = () => {
  const total = props.card.task?.length || 0;
  const completed =
    props.card.task?.filter((item) => item.completed).length || 0;

  return total ? Math.floor((completed * 100) / total) : 0;
};
  const [dropdown, setDropdown] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  return (
    <Draggable
      key={props.id.toString()}
      draggableId={props.id.toString()}
      index={props.index}
    >
      {(provided) => (
        <>
          {modalShow && (
            <CardDetails
              updateCard={props.updateCard}
              onClose={setModalShow}
              card={props.card}
              bid={props.bid}
              removeCard={props.removeCard}
            />
          )}

          <div
            className="custom__card"
            onClick={() => {
              setModalShow(true);
            }}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div className="card__text">
              <p>{props.title}</p>
              <MoreHorizontal
                className="card__more"
                onClick={() => {
                  setDropdown(true);
                }}
              />
            </div>

            <div className="card__tags">
              {props.tags?.map((item, index) => (
                <Tag key={index} tagName={item.tagName} color={item.color} />
              ))}
            </div>

    <div className="card__footer">
  {props.card.date && (
    <div className="time">
      <Calendar size={16} />
     <span>{new Date(props.card.date).toLocaleDateString()}</span>
    </div>
  )}

  {props.card.task.length !== 0 && (
    <div className="task">
      <CheckSquare size={16} />
      <span>
        {(props.card.task.filter((item) => item.completed)).length}
        {" / "}
        {props.card.task.length}
      </span>
    </div>
  )}
</div>
{props.card.task.length > 0 && (
  <div className="card_progress">
    <div
      className="card_progress_fill"
      style={{ width: `${calculatePercent()}%` }}
    ></div>
  </div>
)}

            {provided.placeholder}
          </div>
        </>
      )}
    </Draggable>
  );
};

export default Card;
