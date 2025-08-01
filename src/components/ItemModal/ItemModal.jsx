import "./ItemModal.css";
import crossIcon from "../../assets/cross.png";

function ItemModal({ activeModal, onClose, card }) {
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
          <h2 className="modal__caption">{card.name}</h2>
          <p className="modal__weather">Weather: {card.weather}</p>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
