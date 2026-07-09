import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Check,
  CheckSquare,
  Clock,
  CreditCard,
  List,
  Plus,
  Tag,
  Trash,
  Type,
  X,
} from "react-feather";
import Editable from "../../Editable/Editable";
import Modal from "../../Modal/Modal";
import "./CardDetails.css";
import { v4 as uuidv4 } from "uuid";
import Label from "../../Label/Label";

export default function CardDetails(props) {
  const colors = ["#61bd4f", "#f2d600", "#ff9f1a", "#eb5a46", "#c377e0"];

  const [values, setValues] = useState({ ...props.card });
  const [input, setInput] = useState(false);
  const [text, setText] = useState(values.title);
  const [labelShow, setLabelShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
  values.date ? new Date(values.date) : null
);
  const Input = (props) => {
    return (
      <div>
        <input
          autoFocus
          defaultValue={text}
          type={"text"}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
      </div>
    );
  };
const addTask = (value) => {
  const newTask = {
    id: uuidv4(),
    task: value,
    completed: false,
  };

  setValues((prev) => ({
    ...prev,
    task: [...prev.task, newTask],
  }));
};

  const removeTask = (id) => {
    const remaningTask = values.task.filter((item) => item.id !== id);
    setValues({ ...values, task: remaningTask });
  };

  const deleteAllTask = () => {
    setValues({
      ...values,
      task: [],
    });
  };

const updateTask = (id) => {
  const updatedTasks = values.task.map((task) =>
    task.id === id
      ? { ...task, completed: !task.completed }
      : task
  );

  setValues((prev) => ({
    ...prev,
    task: updatedTasks,
  }));
};
  const updateTitle = (value) => {
    setValues({ ...values, title: value });
  };

const calculatePercent = () => {
  const totalTask = values.task.length;
  const completedTask = values.task.filter(
    (item) => item.completed === true
  ).length;

  console.log({
    totalTask,
    completedTask,
    percent: Math.floor((completedTask * 100) / totalTask) || 0,
    tasks: values.task,
  });

  return Math.floor((completedTask * 100) / totalTask) || 0;
};

  const removeTag = (id) => {
    const tempTag = values.tags.filter((item) => item.id !== id);
    setValues({
      ...values,
      tags: tempTag,
    });
  };

const addTag = (value, color) => {
  console.log("Tag:", value, color);

  const newTag = {
    id: uuidv4(),
    tagName: value,
    color: color || "#61bd4f",
  };

  setValues((prev) => ({
    ...prev,
    tags: [...prev.tags, newTag],
  }));
};

  const handelClickListner = (e) => {
    if (e.code === "Enter") {
      setInput(false);
      updateTitle(text === "" ? values.title : text);
    } else return;
  };

  useEffect(() => {
    document.addEventListener("keypress", handelClickListner);
    return () => {
      document.removeEventListener("keypress", handelClickListner);
    };
  });
  useEffect(() => {
  setValues((prev) => ({
    ...prev,
    date: selectedDate,
  }));
}, [selectedDate]);
  useEffect(() => {
    if (props.updateCard) props.updateCard(props.bid, values.id, values);
  }, [values]);

  return (
    <Modal onClose={props.onClose}>
      <div className="carddetails__container">
        <div className="carddetails__row carddetails__row--header">
          <div className="carddetails__header">
            <div className="carddetails__icon">
              <CreditCard size={22} />
            </div>
            {input ? (
              <Input title={values.title} />
            ) : (
              <h3
                className="carddetails__title"
                style={{ cursor: "pointer" }}
                onClick={() => setInput(true)}
              >
                {values.title}
              </h3>
            )}
            <button
              className="carddetails__close"
              onClick={() => props.onClose(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="carddetails__row">
          <div className="carddetails__left">
            <h5 className="section__title">Labels</h5>
            <div className="label__color">
              {values.tags.length !== 0 ? (
                values.tags.map((item) => (
                  <span style={{ backgroundColor: item.color }}>
                    {item.tagName.length > 10
                      ? item.tagName.slice(0, 6) + "..."
                      : item.tagName}
                    <X
                      onClick={() => removeTag(item.id)}
                      style={{ width: "15px", height: "15px" }}
                    />
                  </span>
                ))
              ) : (
                <span style={{ color: "var(--text-muted)" }}>
                  <i> No Labels</i>
                </span>
              )}
            </div>
            <div className="check__list">
              <div className="checklist__header">
                <div className="checklist__title-group">
                  <CheckSquare className="icon__md" />
                  <h5 className="section__title">Checklist</h5>
                  <span className="progress__percent">
                    {calculatePercent()}%
                  </span>
                </div>
                {values.task.length !== 0 && (
                  <button
                    className="task__delete-btn"
                    onClick={() => deleteAllTask()}
                  >
                    Delete All Tasks
                  </button>
                )}
              </div>
              <div className="progress__bar">
                <div className="progress__track">
                  <div
                    className="progress__fill"
                    role="progressbar"
                    style={{ width: calculatePercent() + "%" }}
                    aria-valuenow={calculatePercent()}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
              </div>

              <div className="task__list">
                {values.task.length !== 0 ? (
                  values.task.map((item, index) => (
                    <div className="task__card">
                      <input
                        className="task__checkbox"
                        type="checkbox"
                        defaultChecked={item.completed}
                        onChange={() => {
                          updateTask(item.id);
                        }}
                      />

                      <h6
                        className={
                          item.completed === true ? "task__strike-through" : undefined
                        }
                      >
                        {item.task}
                      </h6>
                      <Trash
                        onClick={() => {
                          removeTask(item.id);
                        }}
                        style={{
                          cursor: "pointer",
                          width: "18px",
                          height: "18px",
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <></>
                )}

                <Editable
                  parentClass={"task__editable"}
                  name={"Add Task"}
                  btnName={"Add task"}
                  onSubmit={addTask}
                />
              </div>
            </div>
          </div>
          <div className="carddetails__right">
            <h5 className="section__title">Actions</h5>
            <div className="card__actions">
              <button className="action__btn" onClick={() => setLabelShow(true)}>
                <span className="action__icon">
                  <Tag />
                </span>
                Add Label
              </button>
              {labelShow && (
                <Label
                  color={colors}
                  addTag={addTag}
                  tags={values.tags}
                  onClose={setLabelShow}
                />
              )}
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select Due Date"
                customInput={
                  <button className="action__btn">
                    <span className="action__icon">
                      <Clock />
                    </span>
                    {selectedDate
                      ? selectedDate.toLocaleDateString()
                      : "Date"}
                  </button>
                }
              />

              <button
                className="action__btn action__btn--danger"
                onClick={() => props.removeCard(props.bid, values.id)}
              >
                <span className="action__icon">
                  <Trash />
                </span>
                Delete Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
