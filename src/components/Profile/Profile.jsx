import React from "react";
import "./Profile.css";
import SideBar from "../SideBar/SideBar";
import ClothesSection from "../ClothesSection/ClothesSection";

const Profile = ({
  currentUser,
  onEditProfile,
  onLogout,
  onAddNew,
  clothingItems,
  handleCardClick,
  onCardLike,
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

          <ClothesSection
            handleCardClick={handleCardClick}
            clothingItems={clothingItems}
            onCardLike={onCardLike}
          />
        </div>
      </div>
    </section>
  );
};

export default Profile;
