import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";

import styles from "./index.module.css";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");

  useEffect(() => {
    axios
      .get<Todo[]>("http://localhost:8000/api/todos")
      .then((response) => setTodos(response.data))
      .catch((error) =>
        console.error("There was an error fetching the todos!", error)
      );
  }, []);

  const addTodo = () => {
    if (newTodo.trim()) {
      axios
        .post<Todo>("http://localhost:8000/api/todos", {
          title: newTodo,
        })
        .then((response) => {
          setTodos([...todos, response.data]);
          setNewTodo("");
        })
        .catch((error) =>
          console.error("There was an error adding the todo!", error)
        );
    }
  };

  const deleteTodo = (id: number) => {
    axios
      .delete(`http://localhost:8000/api/todos/${id}`)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((error) =>
        console.error("There was an error deleting the todo!", error)
      );
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>TODO List</h1>
      <div className={styles.headerActions}>
        <input
          type="text"
          value={newTodo}
          onChange={handleInputChange}
          placeholder="Add a new todo"
          className={styles.input}
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul className={styles.list}>
        {todos.map((todo) => (
          <li key={todo.id} className={styles.item}>
            <div className={styles.title}>{todo.title}</div>
            <div>{todo.completed ? "Completed" : "Not completed"}</div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className={styles.buttonDanger}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;
