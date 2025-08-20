import { defaultClothingItems } from "../../utils/constants";
import ItemCard from "../ItemCard/ItemCard";
import "./ClothesSection.css";

function ClothesSection({ handleCardClick, weatherData }) {
  const type = weatherData?.type;
  const items = type
    ? defaultClothingItems.filter((item) => item.weather === type)
    : defaultClothingItems;

  return (
    <div className="clothes-section">
      <div className="clothes-section__panel">
        <p>Your Items</p>
        <button className="clothes-section__add-clothes-btn">+ Add New</button>
      </div>
      <ul className="cards__list">
        {items.map((item) => (
          <ItemCard
            key={item._id ?? item.id}
            item={item}
            onCardClick={handleCardClick}
          />
        ))}
      </ul>
    </div>
  );
}

export default ClothesSection;
