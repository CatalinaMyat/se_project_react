import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import { coordinates, apiKey } from "../../utils/constants";

import Header from "../Header/Header";
import Main from "../Main/Main";
import ClothesSection from "../ClothesSection/ClothesSection";
import ItemModal from "../ItemModal/ItemModal";
import Profile from "../Profile/Profile";
import Footer from "../Footer/Footer";
import AddItemModal from "../AddItemModal/AddItemModal";

import CurrentTemperatureUnitContext from "../../contexts/currentTemperatureUnit";
import CurrentUserContext from "../../contexts/CurrentUserContext";

import { getWeather, filterWeatherData } from "../../utils/weatherApi";
import {
  getItems,
  addItem,
  deleteItem,
  updateUser,
  addCardLike,
  removeCardLike,
} from "../../utils/api";
import { signup, signin, getUser } from "../../utils/auth";

import RegisterModal from "../RegisterModal/RegisterModal.jsx";
import LoginModal from "../LoginModal/LoginModal.jsx";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute.jsx";
import EditProfileModal from "../EditProfileModal/EditProfileModal.jsx";

function App() {
  // ===== Weather =====
  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 999, C: 999 },
    city: "",
    condition: "",
    isDay: false,
  });

  // ===== Items =====
  const [clothingItems, setClothingItems] = useState([]);
  const [activeModal, setActiveModal] = useState(""); // "", "preview", "add-garment", "edit-profile"
  const [selectedCard, setSelectedCard] = useState({});

  // ===== Temp unit =====
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const handleToggleSwitchChange = () =>
    setCurrentTemperatureUnit((u) => (u === "F" ? "C" : "F"));

  // ===== Auth + user =====
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // auth modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // edit profile modal
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // generic submit/error flags
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [updateUserError, setUpdateUserError] = useState("");

  // ===== Handlers (cards & modals) =====
  const handleCardClick = (card) => {
    setSelectedCard(card);
    setActiveModal("preview");
  };

  // Likes: toggle like/unlike for a card
  // App.jsx (add this next to your other handlers)
  const handleCardLike = ({ id, isLiked }) => {
    const token = localStorage.getItem("jwt");
    const req = isLiked ? removeCardLike : addCardLike; // <— not api.*

    req(id, token)
      .then((updated) => {
        if (!updated || !updated._id) return; // defensive
        setClothingItems((prev) =>
          prev.map((it) => (it._id === id ? updated : it))
        );
      })
      .catch(console.error);
  };

  const handleAddClothesClick = () => setActiveModal("add-garment");
  const handleEditProfileClick = () => setIsEditProfileOpen(true);
  const closeActiveModal = () => setActiveModal("");

  // ===== CRUD Items =====
  const handleAddItemModalSubmit = ({ name, imageUrl, weather }) => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      // If the user isn't logged in, show the login modal instead of calling the API.
      setIsLoginOpen(true);
      return Promise.reject(new Error("Not authenticated"));
    }

    return addItem({ name, imageUrl, weather }, token)
      .then((created) => {
        const normalized = {
          _id: created._id,
          name: created.name,
          link: created.imageUrl, // server returns imageUrl
          weather: created.weather,
          owner: created.owner,
        };
        setClothingItems((prev) => [normalized, ...prev]);
        closeActiveModal();
      })
      .catch(console.error);
  };

  // In App.jsx
  const handleDeleteItem = (idFromModal) => {
    const id = idFromModal || selectedCard?._id;
    if (!id) return;

    const token = localStorage.getItem("jwt");

    // call the named import you already have: deleteItem(id, token)
    return deleteItem(id, token)
      .then(() => {
        setClothingItems((items) => items.filter((i) => i._id !== id));
        setActiveModal("");
        setSelectedCard({});
      })
      .catch((err) => console.error(err));
  };

  // ===== Weather on load =====
  useEffect(() => {
    getWeather(coordinates, apiKey)
      .then((data) => setWeatherData(filterWeatherData(data)))
      .catch((e) => console.error("Failed to fetch weather data:", e));
  }, []);

  // ===== Public items on load =====
  useEffect(() => {
    getItems()
      .then((data) => {
        const normalized = data.map(
          ({ _id, name, imageUrl, weather, owner }) => ({
            _id,
            name,
            link: imageUrl,
            weather,
            owner,
          })
        );
        setClothingItems(normalized);
      })
      .catch(console.error);
  }, []);

  // ===== Auth: register → login → get user =====
  function handleRegister({ name, avatar, email, password }) {
    setIsSubmitting(true);
    setAuthError("");
    signup({ name, avatar, email, password })
      .then(() => signin({ email, password }))
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setIsLoggedIn(true);
        return getUser(res.token);
      })
      .then((user) => {
        setCurrentUser(user);
        setIsRegisterOpen(false);
      })
      .catch(() => setAuthError("Registration or sign-in failed"))
      .finally(() => setIsSubmitting(false));
  }

  function handleLogin({ email, password }) {
    setIsSubmitting(true);
    setAuthError("");
    signin({ email, password })
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setIsLoggedIn(true);
        return getUser(res.token);
      })
      .then((user) => {
        setCurrentUser(user);
        setIsLoginOpen(false);
      })
      .catch(() => setAuthError("Email or password incorrect"))
      .finally(() => setIsSubmitting(false));
  }

  // ===== Token check on page load =====
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;
    getUser(token)
      .then((user) => {
        setCurrentUser(user);
        setIsLoggedIn(true);
      })
      .catch(() => {
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        setCurrentUser(null);
      });
  }, []);

  // ===== Sign out =====
  function handleSignOut() {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setIsEditProfileOpen(false);
  }

  // ===== Task 3: update profile (PATCH /users/me) =====
  function handleUpdateUser({ name, avatar }) {
    setIsUpdatingUser(true);
    setUpdateUserError("");
    const token = localStorage.getItem("jwt");
    return updateUser({ name, avatar }, token)
      .then((updated) => {
        setCurrentUser(updated);
        setIsEditProfileOpen(false);
      })
      .catch(() => setUpdateUserError("Failed to update profile"))
      .finally(() => setIsUpdatingUser(false));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CurrentTemperatureUnitContext.Provider
        value={{ currentTemperatureUnit, handleToggleSwitchChange }}
      >
        <div className="page">
          <div className="page__content">
            <Header
              weatherData={weatherData}
              isLoggedIn={isLoggedIn}
              handleAddClick={handleAddClothesClick}
              onOpenLogin={() => setIsLoginOpen(true)}
              onOpenRegister={() => setIsRegisterOpen(true)}
            />

            <Routes>
              <Route
                path="/"
                element={
                  <Main
                    weatherData={weatherData}
                    handleCardClick={handleCardClick}
                    clothingItems={clothingItems}
                    onCardLike={handleCardLike} // <-- add this
                  />
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Profile
                      currentUser={currentUser}
                      onEditProfile={handleEditProfileClick}
                      onLogout={handleSignOut}
                      onAddNew={() => setActiveModal("add-garment")}
                      clothingItems={clothingItems} // pass items
                      handleCardClick={handleCardClick} // pass opener for preview
                      onCardLike={handleCardLike} // pass like handler
                    />
                  </ProtectedRoute>
                }
              />
            </Routes>

            <Footer />
          </div>

          {/* Modals */}
          <AddItemModal
            isOpen={activeModal === "add-garment"}
            onClose={closeActiveModal}
            onAddItemModalSubmit={handleAddItemModalSubmit}
          />

          <ItemModal
            activeModal={activeModal}
            card={selectedCard}
            onClose={closeActiveModal}
            onDeleteItem={handleDeleteItem}
          />

          <EditProfileModal
            isOpen={isEditProfileOpen}
            onClose={() => setIsEditProfileOpen(false)}
            onSubmit={handleUpdateUser}
            isSubmitting={isUpdatingUser}
            errorText={updateUserError}
          />

          <RegisterModal
            isOpen={isRegisterOpen}
            onClose={() => setIsRegisterOpen(false)}
            onOpenLogin={() => {
              setIsRegisterOpen(false);
              setIsLoginOpen(true);
            }}
            onRegister={handleRegister}
            isSubmitting={isSubmitting}
            errorText={authError}
          />

          <LoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onOpenSignup={() => {
              setIsLoginOpen(false);
              setIsRegisterOpen(true);
            }}
            onLogin={handleLogin}
            isSubmitting={isSubmitting}
            errorText={authError}
          />
        </div>
      </CurrentTemperatureUnitContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
