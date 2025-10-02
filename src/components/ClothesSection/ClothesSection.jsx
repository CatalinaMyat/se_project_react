import { useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";
import ItemCard from "../ItemCard/ItemCard";
import "./ClothesSection.css";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ClothesSection({
  handleCardClick,
  handleAddClick, // unchanged
  clothingItems = [],
  onCardLike, // NEW
}) {
  const currentUser = useContext(CurrentUserContext);
  const { pathname } = useLocation();

  const visibleItems = useMemo(() => {
    if (pathname === "/profile" && currentUser?._id) {
      return clothingItems.filter((i) => i.owner === currentUser._id);
    }
    return clothingItems;
  }, [pathname, currentUser, clothingItems]);

  return (
    <div className="clothes-section">
      <ul className="cards__list">
        {clothingItems.map((item) => (
          <ItemCard
            key={item._id ?? item.id}
            item={item}
            onCardClick={handleCardClick}
            onCardLike={onCardLike}
          />
        ))}
      </ul>
    </div>
  );
}

export default ClothesSection;
