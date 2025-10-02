import React from "react";
import "./SideBar.css";

const SideBar = ({ name, avatar, onEditProfile, onLogout }) => {
  const initial = (name || "U").slice(0, 1).toUpperCase();

  return (
    <aside className="sidebar">
      <div className="sidebar__user">
        {avatar ? (
          <img className="sidebar__avatar" src={avatar} alt={name || "User"} />
        ) : (
          <div className="sidebar__initial" aria-hidden>
            {initial}
          </div>
        )}
        <div className="sidebar__name">{name}</div>
      </div>

      <button type="button" className="sidebar__link" onClick={onEditProfile}>
        Change profile data
      </button>
      <button type="button" className="sidebar__link" onClick={onLogout}>
        Log out
      </button>
    </aside>
  );
};

export default SideBar;
