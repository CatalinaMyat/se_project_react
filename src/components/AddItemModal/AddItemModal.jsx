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

  // Reset the form when the modal opens
  useEffect(() => {
    if (isOpen) {
      reset({ name: "", imageUrl: "", weather: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
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
          Hot
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
          Warm
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
          Cold
        </label>
      </fieldset>
    </ModalWithForm>
  );
}
