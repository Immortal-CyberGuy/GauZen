import "../style/BreedCards.css";

const BreedModal = ({ breed, closeModal }) => {
  return (
    <div className="modal show" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{breed.name}</h2>
        <img src={breed.image} alt={breed.name} className="card-image" />
        <table className="breed-table">
          <tbody>
            <tr>
              <th>Milk Capacity</th>
              <td>{breed.milk_capacity} L/day</td>
            </tr>
            <tr>
              <th>Best Breeding Partners</th>
              <td>{breed.breeding_partners.join(", ")}</td>
            </tr>
          </tbody>
        </table>
        <button className="close-btn" onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

export default BreedModal;
