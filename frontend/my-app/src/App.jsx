import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [editItem, setEditItem] = useState({ id: null, name: "" });

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/items")
      .then((response) => setItems(response.data))
      .catch((err) =>
        console.log("There seem to be some error while fetching data : ", err)
      );
  }, []);

  //additem
  const addItem = () => {
    axios
      .post("http://127.0.0.1:5000/items", { name: newItem })
      .then((response) => {
        setItems([...items, response.data]);
        setNewItem("");
      })
      .catch((err) => console.log("error while adding Items : ", err));
  };

  // edititem
  const updateItem = () => {
    if (!editItem.id) {
      console.log("No item ID specified for update.");
      return;
    }
    axios
      .put(`http://127.0.0.1:5000/items/${editItem.id}`, {
        name: editItem.name,
      })
      .then((response) => {
        if (response.data && response.data._id) {
          setItems(
            items.map((item) =>
              item._id === response.data._id ? response.data : item
            )
          );
          setEditItem({ id: null, name: "" });
        } else {
          console.log("Unexpected response format:", response.data);
        }
      })
      .catch((err) => console.log("Error while updating Item: ", err));
  };

  //deleteItem
  const deleteItem = (id) => {
    axios
      .delete(`http://127.0.0.1:5000/items/${id}`)
      .then(() => {
        setItems(items.filter((item) => item._id !== id));
        if (editItem.id === id) {
          setEditItem({ id: null, name: "" });
        }
      })
      .catch((err) => console.log("Error while deleting Item :", err));
  };

  return (
    <div className="app-container">
      <h1>ADD ITEMS</h1>
      <input
        type="text"
        value={newItem}
        onChange={(event) => setNewItem(event.target.value)}
        placeholder="ADD NEW ITEMs"
      />
      <button onClick={addItem}>ADD THIS ITEM</button>

      <h2>EDIT ITEMS</h2>
      <input
        type="text"
        value={editItem.name}
        onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
        placeholder="EDIT ITEM"
      />
      <button onClick={updateItem} disabled={!editItem.id}>
        UPDATE ITEM
      </button>

      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.name}
            <button
              onClick={() => setEditItem({ id: item._id, name: item.name })}
            >
              EDIT ME
            </button>
            <button onClick={() => deleteItem(item._id)}>REMOVE ME</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
