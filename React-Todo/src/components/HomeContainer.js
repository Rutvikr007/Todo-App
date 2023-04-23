import React from "react";
import Form from "./Form";
import TodoContainer from "./TodoContainer";
import { addTodoInDataBase, DeleteFromDataBase, updateDataBase } from "./utils";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const HomeContainer = () => {
  const { user } = useContext(AuthContext);

  /// states
  const [todoList, setTodoList] = useState();
  const [inputValue, setInputValue] = useState("");
  const [TitleValue, setTitleValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  /// ==============================
  //       crud functions
  /// ==============================

  //create todo
  async function addTask(key) {
    if (inputValue !== "" && TitleValue !== "") {
      if (!isEditing) {
        setIsSaving(true);
        const addData = await addTodoInDataBase(
          {
            task: inputValue,
            title: TitleValue,
          },
          user?.token
        );
        setTodoList([
          ...todoList,
          {
            task: addData.Task.task,
            title: addData.Task.title,
            _id: addData.Task.title,
            completed: false,
          },
        ]);

        setInputValue("");
        setTitleValue("");

        setIsSaving(false);
      } else {
        if (key.data._id) {
          setIsSaving(true);
          const updatedData = updateDataBase(
            {
              id: key.data._id,
              task: inputValue,
              title: TitleValue,
            },
            user.token
          );
          updatedData.then((data) => {
            setTodoList(
              todoList.map((item) => {
                if (item._id === data.Task._id) {
                  return {
                    ...item,
                    task: inputValue,
                    title: TitleValue,
                  };
                }
                return item;
              })
            );
          });
          setIsSaving(false);
        }

        setTitleValue("");
        setInputValue("");
        setIsEditing(false);
        setEditId("");
      }
    }
    // else alert("please fil all fields");
  }

  // read all tasks
  useEffect(() => {
    async function fetchData() {
      const data = await fetch(
        "https://mern-todo-app-roan.vercel.app/api/v1/tasks",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const tasksdata = await data.json();

      setTodoList(tasksdata);
    }
    fetchData();
  }, []);

  //  for updating data
  const editTask = (key, valueObj) => {
    setIsEditing(true);
    setInputValue(valueObj.task);
    setTitleValue(valueObj.title);
    setEditId({ key: key, data: valueObj });
  };

  // for changing  complete
  const completeTask = (key, id) => {
    console.log(id);
    let dataId;
    let completedCheck;
    setTodoList(
      todoList.map((item, index) => {
        if (index === key) {
          dataId = item._id;
          completedCheck = !item.completed;
          return { ...item, completed: !item.completed };
        }
        return item;
      })
    );

    const updatedData = updateDataBase(
      {
        id: id,
        completed: completedCheck,
      },
      user.token
    );
  };

  // delete data
  const deleteTask = async (id, key) => {
    setTodoList((prevList) =>
      prevList.filter((listItem, index) => index !== key)
    );
    if (id) {
      DeleteFromDataBase(id, user.token);
    }
  };

  return (
    <>
      <Form
        inputValue={inputValue}
        TitleValue={TitleValue}
        setTitleValue={setTitleValue}
        setInputValue={setInputValue}
        editId={editId}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        addTask={addTask}
        isSaving={isSaving}
      />
      <hr />
      <TodoContainer
        editTask={editTask}
        todoList={todoList}
        completeTask={completeTask}
        deleteTask={deleteTask}
      />
    </>
  );
};

export default HomeContainer;
