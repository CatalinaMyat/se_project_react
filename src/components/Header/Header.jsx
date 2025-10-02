import { useContext } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/logo.svg";
import avatarFallback from "../../assets/avatar.png";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function Header({
  handleAddClick,
  weatherData,
  isLoggedIn,
  onOpenLogin,
  onOpenRegister,
}) {
  const currentUser = useContext(CurrentUserContext);

  const currentDate = new Date().toLocaleString("default", {
    month: "long",
    day: "numeric",
  });

  const name = currentUser?.name || "User";
  const avatar = currentUser?.avatar || avatarFallback;

  return (
    <header className="header">
      <Link to="/">
        <img className="header__logo" src={logo} alt="App Logo" />
      </Link>

      <p className="header__date-and-location">
        {currentDate}
        {weatherData?.city ? `, ${weatherData.city}` : ""}
      </p>

      <ToggleSwitch className="header__toggle" />

      {!isLoggedIn ? (
        <div className="header__auth">
          <button
            type="button"
            className="header__link"
            onClick={onOpenRegister}
          >
            Sign Up
          </button>
          <button type="button" className="header__link" onClick={onOpenLogin}>
            Log In
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={handleAddClick}
            type="button"
            className="header__add-clothes-btn"
          >
            + Add clothes
          </button>

          {/* Use a dedicated profile link class so the avatar isn’t affected by text-link styles */}
          <Link
            to="/profile"
            className="header__profile-link"
            aria-label="Open profile"
          >
            <span className="header__username">{name}</span>
            <img src={avatar} alt={name} className="header__avatar" />
          </Link>
        </>
      )}
    </header>
  );
}

export default Header;
