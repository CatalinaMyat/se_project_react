import ItemCard from "../ItemCard/ItemCard";
import "./ClothesSection.css";

function ClothesSection({
  handleCardClick,
  handleAddClick,
  weatherData,
  clothingItems = [],
}) {
  const type = weatherData?.type;

  const items = type
    ? clothingItems.filter((item) => item.weather === type)
    : clothingItems;

  return (
    <div className="clothes-section">
      <div className="clothes-section__panel">
        <p>Your Items</p>
        <button
          type="button"
          className="clothes-section__add-clothes-btn"
          onClick={handleAddClick}
        >
          + Add New
        </button>
      </div>

      <ul className="cards__list">
        {items.map((item) => (
          <ItemCard
            key={item.id ?? item._id}
            item={item}
            onCardClick={handleCardClick}
          />
        ))}
      </ul>
    </div>
  );
}

export default ClothesSection;
