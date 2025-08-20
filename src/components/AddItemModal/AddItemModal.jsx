import { useState } from "react";
import "./AddItemModal.css";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

export default function AddItemModal({
  onClose,
  isOpen,
  onAddItemModalSubmit,
}) {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [weather, setWeather] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddItemModalSubmit({ name, imageUrl, weather });
    setName("");
    setImageUrl("");
    setWeather("");
  };

  return (
    <ModalWithForm
      title="New garment"
      buttonText="Add garment"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label htmlFor="clothing-name" className="modal__label">
        Name
        <input
          id="clothing-name"
          type="text"
          name="name"
          className="modal__input modal__input_type_card-name"
          placeholder="Name"
          required
          minLength="1"
          maxLength="30"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label htmlFor="clothing-link" className="modal__label">
        Image URL
        <input
          id="clothing-link"
          type="url"
          name="link"
          className="modal__input modal__input_type_url"
          placeholder="Image URL"
          required
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </label>

      <fieldset className="modal__radio-buttons">
        <legend className="modal__legend">Select the weather type:</legend>

        <label htmlFor="hot" className="modal__label modal__label_type_radio">
          <input
            id="hot"
            type="radio"
            name="weather"
            value="hot"
            className="modal__radio-input"
            checked={weather === "hot"}
            onChange={(e) => setWeather(e.target.value)}
          />
          Hot
        </label>

        <label htmlFor="warm" className="modal__label modal__label_type_radio">
          <input
            id="warm"
            type="radio"
            name="weather"
            value="warm"
            className="modal__radio-input"
            checked={weather === "warm"}
            onChange={(e) => setWeather(e.target.value)}
          />
          Warm
        </label>

        <label htmlFor="cold" className="modal__label modal__label_type_radio">
          <input
            id="cold"
            type="radio"
            name="weather"
            value="cold"
            className="modal__radio-input"
            checked={weather === "cold"}
            onChange={(e) => setWeather(e.target.value)}
          />
          Cold
        </label>
      </fieldset>
    </ModalWithForm>
  );
}
