import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import image from "./edit.png";

export default function ListeNotes({ SetIsConnected }) {
  const [notes, setNotes] = useState([]);
  const [users, setUsers] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [sharedWith, setSharedWith] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const name = localStorage.getItem("name");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Fetch Notes from API
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("https://notes.devlop.tech/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Users from API
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("https://notes.devlop.tech/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userOptions = response.data.map((user) => ({
        value: user.id,
        label: `${user.first_name} ${user.last_name}`,
      }));
      setUsers(userOptions);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Delete Note
  const deleteNote = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.delete(`https://notes.devlop.tech/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Add or Edit Note
  const handleAddNote = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const updatedNote = {
        title: newNoteTitle,
        content: newNoteContent,
        shared_with: sharedWith.map((user) => user.value),
      };

      if (editingNoteId) {
        // Update existing note
        const response = await axios.put(
          `https://notes.devlop.tech/api/notes/${editingNoteId}`,
          updatedNote,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === editingNoteId ? response.data : note
          )
        );
      } else {
        // Add new note
        const response = await axios.post(
          "https://notes.devlop.tech/api/notes",
          updatedNote,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setNotes((prevNotes) => [...prevNotes, response.data]);
      }

      setNewNoteTitle("");
      setNewNoteContent("");
      setSharedWith([]);
      setShowSidebar(false);
      setEditingNoteId(null);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found for logout");

      await axios.post(
        "https://notes.devlop.tech/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.removeItem("token");
      SetIsConnected(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
      localStorage.removeItem("token");
      SetIsConnected(false);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  // Populate Sidebar for Editing
  const handleEditNote = (note) => {
    setEditingNoteId(note.id);
    setNewNoteTitle(note.title);
    setNewNoteContent(note.content);
    setSharedWith(
      note.shared_with.map((user) => ({
        value: user.id,
        label: `${user.first_name} ${user.last_name}`,
      }))
    );
    setShowSidebar(true);
  };

  // Fetch Notes and Users on Component Mount
  useEffect(() => {
    fetchNotes();
    fetchUsers();
  }, []);

  return (
    <div className="all">
      <div className="header">
        <p>Hello {name}👋</p>
        <div>
          <button
            className="logout"
            onClick={() => navigate("/change-password")}
          >
            Change Password
          </button>
          <button className="newNote" onClick={() => setShowSidebar(true)}>
            +Add Note
          </button>
          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <hr />
      {loading ? (
        <div className="loading"></div>
      ) : (
        <div className="listes">
          {notes.map((note) => (
            <div className="note-card" key={note.id}>
              <small>{new Date(note.date).toLocaleString()}</small>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={() => deleteNote(note.id)}
                style={{ cursor: "pointer" }}
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <img
                src={image}
                alt="Edit Note"
                onClick={() => handleEditNote(note)}
                style={{ cursor: "pointer" }}
              />
              <h3 className="note-title">{note.title}</h3>
              <hr />
              <p className="note-content">{note.content}</p>
              {note.shared_with && note.shared_with.length > 0 && (
                <>
                  <hr />
                  <p className="note-content">
                    Shared with:{" "}
                    {note.shared_with
                      .map((user) => `${user.first_name} ${user.last_name}`)
                      .join(", ")}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      <div
        className="sideBar"
        style={{ display: showSidebar ? "block" : "none" }}
      >
        <div>
          <div className="sideCnt">
            <input
              type="text"
              placeholder="Add Note Title"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
            />
            <Select
              isMulti
              options={users}
              value={sharedWith}
              onChange={(selectedOptions) => setSharedWith(selectedOptions)}
              placeholder="Share with"
            />
            <hr />
            <textarea
              rows="10"
              placeholder="Write your note here"
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
            ></textarea>
          </div>
          <div>
            <button className="newNote" onClick={handleAddNote}>
              Save
            </button>
            <button
              className="logout"
              onClick={() => {
                setNewNoteTitle("");
                setNewNoteContent("");
                setSharedWith([]);
                setShowSidebar(false);
                setEditingNoteId(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
