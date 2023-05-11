import { useEffect, useState } from "react";
import "./App.css";

import List from "./List";
import Alert from "./Alert";

function getLocalStorage() {
  let list = localStorage.getItem("list");
  if (list) return JSON.parse(localStorage.getItem("list"));
  else {
    return [];
  }
}

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    type: "",
  });

  function handleSubmit(e) {
    e.preventDefault();

    if (!name) {
      showAlert(true, "danger", "Please enter value");
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editId) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName("");
      setEditId(null);
      setIsEditing(false);
      showAlert(true, "success", "item edited");
    } else {
      showAlert(true, "success", "Item added to the list");
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
    }
  }

  function showAlert(show = false, type = "", msg = "") {
    setAlert({ show, type, msg });
  }

  function clearList() {
    showAlert(true, "danger", "list cleared");
    setList([]);
  }

  function removeItem(id) {
    showAlert(true, "danger", "item removed");
    setList(list.filter((item) => item.id !== id));
  }

  function editItem(id) {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditId(id);
    setName(specificItem.title);
  }

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>grocery list</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.g. eggs"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? "Edit" : "Submit"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            clear items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
