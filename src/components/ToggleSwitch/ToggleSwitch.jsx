import { useContext } from "react";
import "./ToggleSwitch.css";
import CurrentTemperatureUnitContext from "../../contexts/currentTemperatureUnit";

export default function ToggleSwitch({ className = "" }) {
  const { handleToggleSwitchChange, currentTemperatureUnit } = useContext(
    CurrentTemperatureUnitContext
  );

  return (
    <label className={`toggle-switch ${className}`}>
      <input
        onChange={handleToggleSwitchChange}
        type="checkbox"
        className="toggle-switch__checkbox"
      />
      <span className="toggle-switch__circle"></span>
      <span
        className={`toggle-switch__text toggle-switch__text_F ${
          currentTemperatureUnit === "F"
            ? "toggle-switch__text_color_white"
            : ""
        }`}
      >
        F
      </span>

      <span
        className={`toggle-switch__text toggle-switch__text_C ${
          currentTemperatureUnit === "C"
            ? "toggle-switch__text_color_white"
            : ""
        }`}
      >
        C
      </span>
    </label>
  );
}
