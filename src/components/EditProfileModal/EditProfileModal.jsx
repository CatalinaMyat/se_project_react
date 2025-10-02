import React, { useState, useEffect } from "react";
import "./EditProfileModal.css";

export default function EditProfileModal({
  isOpen,
  onClose,
  onSubmit,
  defaultName = "",
  defaultAvatar = "",
  isSubmitting = false,
  errorText = "",
}) {
  const [name, setName] = useState(defaultName);
  const [avatar, setAvatar] = useState(defaultAvatar);

  useEffect(() => {
    if (isOpen) {
      setName(defaultName);
      setAvatar(defaultAvatar);
    }
  }, [isOpen, defaultName, defaultAvatar]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, avatar });
  };

  return (
    <div className="edit-profile__overlay" onMouseDown={handleOverlayClick}>
      <div className="edit-profile" role="dialog" aria-modal="true">
        <h2 className="edit-profile__title">Change profile data</h2>

        <button
          className="edit-profile__close"
          type="button"
          aria-label="Close"
          onClick={onClose}
        />

        <form className="edit-profile__form" onSubmit={handleSubmit}>
          <label className="edit-profile__label">
            Name *
            <input
              className="edit-profile__input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="edit-profile__label">
            Avatar *
            <input
              className="edit-profile__input"
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              required
            />
          </label>

          {errorText ? (
            <div style={{ color: "#d00", fontSize: 12 }}>{errorText}</div>
          ) : null}

          <button className="edit-profile__submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
