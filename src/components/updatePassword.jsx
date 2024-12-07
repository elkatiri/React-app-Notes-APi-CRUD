import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading,setLoading]=useState(false);
  const navigate = useNavigate();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      await axios.put(
        "https://notes.devlop.tech/api/update-password",
        {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

        localStorage.removeItem("token");
        navigate("/login");
    } catch (err) {
      setErrorMessage("Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="loading"></div>
      ) : (
        <div className="login-container">
          <form className="form" onSubmit={handleUpdatePassword}>
            <p className="big-title" style={{ fontSize: "30px" }}>
              Update Password 🔑
            </p>
            <p className="form-title">Change your password</p>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="input-container">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
                autoComplete="current-password"
              />
            </div>
            <div className="input-container">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                autoComplete="new-password"
              />
            </div>
            <div className="input-container">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                autoComplete="new-password"
              />
            </div>
            <button className="submit" type="submit">
              Update Password
            </button>
          </form>
        </div>)}
       </>   
  );
}
