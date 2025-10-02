import { useContext } from "react";
import "./ItemModal.css";
import crossIcon from "../../assets/cross.png";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ItemModal({ activeModal, onClose, card, onDeleteItem }) {
  const currentUser = useContext(CurrentUserContext);
  if (!card) return null;

  const isOwn = currentUser && card?.owner === currentUser._id;

  const handleDelete = () => onDeleteItem(card._id);

  return (
    <div
      className={`modal ${activeModal === "preview" ? "modal__opened" : ""}`}
    >
      <div className="modal__content modal__content_type_image">
        <button onClick={onClose} className="modal__close" type="button">
          <img src={crossIcon} alt="Close" className="modal__close-icon" />
        </button>
        <img src={card.link} alt={card.name} className="modal__image" />
        <div className="modal__footer">
          <div className="modal__info">
            <h2 className="modal__caption">{card.name}</h2>
            <p className="modal__weather">Weather: {card.weather}</p>
          </div>

          {isOwn && (
            <button
              onClick={handleDelete}
              className="modal__delete-btn"
              type="button"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
