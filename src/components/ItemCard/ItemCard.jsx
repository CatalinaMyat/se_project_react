import "./ItemCard.css";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ItemCard({ item, onCardClick, onCardLike }) {
  const currentUser = useContext(CurrentUserContext);

  const handleCardClick = () => onCardClick(item);

  // likes is an array of user id strings
  const likedByMe =
    Array.isArray(item.likes) &&
    item.likes.some((id) => id === currentUser?._id);

  // toggle like without opening the preview
  const handleLike = (e) => {
    e.stopPropagation();
    onCardLike?.({ id: item._id, isLiked: likedByMe });
  };

  return (
    <li className="card">
      <div className="card__header">
        <h2 className="card__name">{item.name}</h2>
        <button
          type="button"
          className={`card__like ${likedByMe ? "card__like--active" : ""}`}
          aria-pressed={likedByMe}
          aria-label={likedByMe ? "Unlike" : "Like"}
          onClick={handleLike}
        />
      </div>

      <img
        onClick={handleCardClick}
        className="card__image"
        src={item.link}
        alt={item.name}
      />
    </li>
  );
}

export default ItemCard;
