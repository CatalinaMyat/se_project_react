import ItemCard from "../ItemCard/ItemCard";
import "./ClothesSection.css";

function ClothesSection({
  handleCardClick,
  handleAddClick,
  clothingItems = [],
}) {
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
        {clothingItems.map((item) => (
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
