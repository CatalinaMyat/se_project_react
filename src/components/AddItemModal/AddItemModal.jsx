import { useEffect } from "react";
import "./AddItemModal.css";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import useForm from "../../hooks/useForm";

export default function AddItemModal({
  onClose,
  isOpen,
  onAddItemModalSubmit,
}) {
  const { values, handleChange, reset } = useForm({
    name: "",
    imageUrl: "",
    weather: "",
  });

  useEffect(() => {
    if (isOpen) reset({ name: "", imageUrl: "", weather: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const isReady =
    values.name.trim().length > 0 &&
    values.imageUrl.trim().length > 0 &&
    values.weather.trim().length > 0;

  function handleSubmit(e) {
    e.preventDefault();
    if (!isReady) return;
    onAddItemModalSubmit({
      name: values.name,
      imageUrl: values.imageUrl,
      weather: values.weather,
    });
  }

  return (
    <ModalWithForm
      title="New garment"
      name="add-garment"
      buttonText="Add garment"
      onClose={onClose}
      isOpen={isOpen}
      onSubmit={handleSubmit}
      isSubmitDisabled={!isReady} // <-- keep button at 50% until valid
      contentClass="modal__content--add-garment" // <-- 496×436 size & padding
    >
      <label className="modal__label" htmlFor="name">
        Name*
      </label>
      <input
        id="name"
        type="text"
        name="name"
        className="modal__input"
        placeholder="Name"
        minLength="1"
        required
        value={values.name || ""}
        onChange={handleChange}
      />

      <label className="modal__label" htmlFor="imageUrl">
        Image URL*
      </label>
      <input
        id="imageUrl"
        type="url"
        name="imageUrl"
        className="modal__input"
        placeholder="Image URL"
        required
        value={values.imageUrl || ""}
        onChange={handleChange}
      />

      <fieldset className="modal__fieldset">
        <legend className="modal__legend">Select the weather type</legend>

        <label className="modal__radio">
          <input
            id="hot"
            type="radio"
            name="weather"
            value="hot"
            className="modal__radio-input"
            checked={values.weather === "hot"}
            onChange={handleChange}
          />
          <span className="modal__radio-text">Hot</span>
        </label>

        <label className="modal__radio">
          <input
            id="warm"
            type="radio"
            name="weather"
            value="warm"
            className="modal__radio-input"
            checked={values.weather === "warm"}
            onChange={handleChange}
          />
          <span className="modal__radio-text">Warm</span>
        </label>

        <label className="modal__radio">
          <input
            id="cold"
            type="radio"
            name="weather"
            value="cold"
            className="modal__radio-input"
            checked={values.weather === "cold"}
            onChange={handleChange}
          />
          <span className="modal__radio-text">Cold</span>
        </label>
      </fieldset>
    </ModalWithForm>
  );
}
