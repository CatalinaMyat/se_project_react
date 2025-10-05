import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import { coordinates, apiKey } from "../../utils/constants";

import Header from "../Header/Header";
import Main from "../Main/Main";
import ItemModal from "../ItemModal/ItemModal";
import Profile from "../Profile/Profile";
import Footer from "../Footer/Footer";
import AddItemModal from "../AddItemModal/AddItemModal";

import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
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
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal.jsx";

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
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setActiveModal("preview");
  };

  const unwrap = (x) => (x && x.data ? x.data : x);

  const handleCardLike = ({ id, isLiked }) => {
    const token = localStorage.getItem("jwt");

    const mergeNormalized = (prevItem, apiCard) => ({
      ...prevItem,

      ...apiCard,

      link: apiCard.imageUrl ?? prevItem.link,
      weather: apiCard.weather ?? prevItem.weather,
      likes: Array.isArray(apiCard.likes)
        ? apiCard.likes
        : Array.isArray(prevItem.likes)
        ? prevItem.likes
        : [],
    });

    !isLiked
      ? addCardLike(id, token)
          .then((updatedCard) => {
            const apiCard = unwrap(updatedCard);
            setClothingItems((cards) =>
              cards.map((item) =>
                item._id === id ? mergeNormalized(item, apiCard) : item
              )
            );
          })
          .catch((err) => console.log(err))
      : removeCardLike(id, token)
          .then((updatedCard) => {
            const apiCard = unwrap(updatedCard);
            setClothingItems((cards) =>
              cards.map((item) =>
                item._id === id ? mergeNormalized(item, apiCard) : item
              )
            );
          })
          .catch((err) => console.log(err));
  };

  const handleAddClothesClick = () => setActiveModal("add-garment");
  const handleEditProfileClick = () => setIsEditProfileOpen(true);
  const closeActiveModal = () => setActiveModal("");

  // ===== CRUD Items =====
  const handleAddItemModalSubmit = ({ name, imageUrl, weather }) => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      setIsLoginOpen(true);
      return Promise.reject(new Error("Not authenticated"));
    }

    return addItem({ name, imageUrl, weather }, token)
      .then((res) => {
        const created = res?.data ?? res;

        const normalized = {
          _id: created._id,
          name: created.name,
          link: created.imageUrl,
          weather: created.weather ?? weather,
          owner: created.owner,
          likes: [],
        };

        setClothingItems((prev) => [normalized, ...prev]);
        closeActiveModal();
      })
      .catch(console.error);
  };

  const handleDeleteItem = (idFromModal) => {
    const id = idFromModal || selectedCard?._id;
    if (!id) return;

    const token = localStorage.getItem("jwt");

    return deleteItem(id, token)
      .then(() => {
        setClothingItems((items) => items.filter((i) => i._id !== id));
        setActiveModal("");
        setSelectedCard({});
      })
      .catch((err) => console.error(err));
  };

  const requestDeleteItem = (idFromModal) => {
    const id = idFromModal || selectedCard?._id;
    if (!id) return;
    setPendingDeleteId(id);
    setActiveModal("confirm-delete");
  };

  const confirmDeleteItem = () => {
    const id = pendingDeleteId;
    if (!id) return;
    const token = localStorage.getItem("jwt");
    return deleteItem(id, token)
      .then(() => {
        setClothingItems((items) => items.filter((i) => i._id !== id));
        setActiveModal("");
        setSelectedCard({});
        setPendingDeleteId(null);
      })
      .catch((err) => console.error(err));
  };

  const cancelDeleteItem = () => {
    setPendingDeleteId(null);
    setActiveModal("preview");
  };

  useEffect(() => {
    getWeather(coordinates, apiKey)
      .then((data) => setWeatherData(filterWeatherData(data)))
      .catch((e) => console.error("Failed to fetch weather data:", e));
  }, []);

  useEffect(() => {
    getItems()
      .then((data) => {
        const normalized = data.map(
          ({ _id, name, imageUrl, weather, owner, likes }) => ({
            _id,
            name,
            link: imageUrl,
            weather,
            owner,
            likes,
          })
        );
        setClothingItems(normalized);
      })
      .catch(console.error);
  }, []);

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

  function handleSignOut() {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setIsEditProfileOpen(false);
  }

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
                    onCardLike={handleCardLike}
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
                      clothingItems={clothingItems}
                      handleCardClick={handleCardClick}
                      onCardLike={handleCardLike}
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
            onDeleteItem={requestDeleteItem}
          />

          <ConfirmDeleteModal
            isOpen={activeModal === "confirm-delete"}
            onConfirm={confirmDeleteItem}
            onCancel={cancelDeleteItem}
          />

          <EditProfileModal
            isOpen={isEditProfileOpen}
            onClose={() => setIsEditProfileOpen(false)}
            onSubmit={handleUpdateUser}
            isSubmitting={isUpdatingUser}
            errorText={updateUserError}
            defaultName={currentUser?.name || ""}
            defaultAvatar={currentUser?.avatar || ""}
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
