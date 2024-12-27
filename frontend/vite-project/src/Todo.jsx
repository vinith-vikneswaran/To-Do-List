import React, { useEffect, useState } from "react";
import './index.css'
export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);
  const apiUrl = "http://localhost:8000"; // Corrected URL for API

  // For Edit
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Handle Submit
  const handleSubmit = async () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      try {
        const res = await fetch(apiUrl + "/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description }),
        });

        if (res.ok) {
          const newTodo = { title, description };
          setTodos((prevTodos) => [...prevTodos, newTodo]);
          setMessage("Item added successfully");
          setTimeout(() => setMessage(""), 3000);
          
          // Clear input fields after successful addition
          setTitle("");
          setDescription("");
        } else {
          setError("Unable to create Todo item");
          setTimeout(() => setError(""), 3000);
        }
      } catch (error) {
        setError("An error occurred: " + error.message);
        setTimeout(() => setError(""), 3000);
      }
    }
  };

  // Get TODO Items
  const getItems = async () => {
    try {
      const res = await fetch(apiUrl + "/todos");
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      setError("An error occurred while fetching todos: " + error.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  // Handle Edit
  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  // Handle Update
  const handleUpdate = async () => {
    setError("");
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      try {
        const res = await fetch(apiUrl + "/todos/" + editId, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: editTitle, description: editDescription }),
        });

        if (res.ok) {
          setTodos((prevTodos) =>
            prevTodos.map((item) =>
              item._id === editId
                ? { ...item, title: editTitle, description: editDescription }
                : item
            )
          );
          setMessage("Item Updated successfully");
          setTimeout(() => setMessage(""), 3000);
          setEditId(-1);
        } else {
          setError("Unable to update Todo item");
          setTimeout(() => setError(""), 3000);
        }
      } catch (error) {
        setError("An error occurred: " + error.message);
        setTimeout(() => setError(""), 3000);
      }
    }
  };

  // Handle Cancel Edit
  const handleEditCancel = () => {
    setEditId(-1);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await fetch(apiUrl + "/todos/" + id, {
          method: "DELETE",
        });
        setTodos((prevTodos) => prevTodos.filter((item) => item._id !== id));
      } catch (error) {
        setError("An error occurred while deleting: " + error.message);
        setTimeout(() => setError(""), 3000);
      }
    }
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row p-3 bg-success text-light rounded mb-4">
          <h1 className="text-center">ToDo List Project</h1>
        </div>
        
        <div className="row mb-3">
          <h3>Add Item</h3>
          {message && <p className="text-success">{message}</p>}
          <div className="form-group d-flex gap-2">
            <input
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
              type="text"
              value={title}
            />
            <input
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
              type="text"
              value={description}
            />
            <button className="btn btn-dark" onClick={handleSubmit}>
              Submit
            </button>
          </div>
          {error && <p className="text-danger mt-2">{error}</p>}
        </div>

        <div className="row mt-4">
          <h2>Tasks</h2>
          <div className="col-md-8">
            <ul className="list-group">
              {todos.map((item) => (
                <li
                  key={item._id}
                  className="list-group-item bg-light d-flex justify-content-between align-items-center my-2 p-3 rounded shadow-sm"
                >
                  <div className="d-flex flex-column me-2">
                    {editId === -1 || editId !== item._id ? (
                      <>
                        <span className="fw-bold">{item.title}</span>
                        <span>{item.description}</span>
                      </>
                    ) : (
                      <div>
                        <div className="form-group d-flex gap-2">
                          <input
                            placeholder="Title"
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="form-control"
                            type="text"
                            value={editTitle}
                          />
                          <input
                            placeholder="Description"
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="form-control"
                            type="text"
                            value={editDescription}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="d-flex gap-2">
                    {editId === -1 || editId !== item._id ? (
                      <button className="btn btn-warning" onClick={() => handleEdit(item)}>
                        Edit
                      </button>
                    ) : (
                      <button className="btn btn-primary" onClick={handleUpdate}>
                        Update
                      </button>
                    )}
                    {editId === -1 || editId !== item._id ? (
                      <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>
                        Delete
                      </button>
                    ) : (
                      <button className="btn btn-secondary" onClick={handleEditCancel}>
                        Cancel
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
