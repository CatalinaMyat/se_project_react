import React from "react";
import "./Profile.css";
import SideBar from "../SideBar/SideBar";

const Profile = ({
  currentUser,
  onEditProfile,
  onLogout,
  onAddNew,
  children,
}) => {
  return (
    <section className="profile">
      <div className="profile__grid">
        <SideBar
          name={currentUser?.name}
          avatar={currentUser?.avatar}
          onEditProfile={onEditProfile}
          onLogout={onLogout}
        />

        <div className="profile__content">
          <div className="profile__header">
            <h2 className="profile__title">Your items</h2>
            {onAddNew && (
              <button type="button" className="profile__add" onClick={onAddNew}>
                + Add new
              </button>
            )}
          </div>

          {/* clothes grid comes from children */}
          {children}
        </div>
      </div>
    </section>
  );
};

export default Profile;
