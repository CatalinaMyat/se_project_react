import "./ConfirmDeleteModal.css";
import crossIcon from "../../assets/cross.png";

function ConfirmDeleteModal({ isOpen, onConfirm, onCancel }) {
  return (
    <div
      className={`modal ${isOpen ? "modal__opened" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div className="modal__content modal__content_type_confirm">
        <button
          className="modal__close"
          type="button"
          onClick={onCancel}
          aria-label="Close"
        >
          <img className="modal__close-icon" src={crossIcon} alt="" />
        </button>

        <h2 id="confirm-title" className="confirm__title">
          Are you sure you want to delete this item?
        </h2>
        <p className="confirm__subtitle">This action is irreversible.</p>

        <button className="confirm__delete" type="button" onClick={onConfirm}>
          Yes, delete item
        </button>
        <button className="confirm__cancel" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
