import React, { useState, useEffect } from "react";

// WithdrawalRow component definition
const WithdrawalRow = ({
  rowClicked, // Function to handle row clicks
  withdrawalrowFilterDB, // Array of items for the table
  setEditQuantity, // Function to set the quantity being edited
  editQuantity, // The quantity being edited
  filterDB, // Array of items for the table
  setFilterDB, // Function to set the items for the table
}) => {
  // State for managing quantities of each item in the table
  const [qtyArray, setQtyArray] = useState([]);
  // State for storing initial maximum quantities of each item
  const [maxQuantities, setMaxQuantities] = useState([]);

  // useEffect hook to set initial quantities and maximum quantities
  useEffect(() => {
    // Set initial quantity for each row
    const initialQtyArray = withdrawalrowFilterDB.map(
      (item) => item.BestandNeu
    );
    setQtyArray(initialQtyArray);

    // Store initial BestandNeu values as maximum quantities
    const initialMaxQuantities = withdrawalrowFilterDB.map(
      (item) => item.BestandNeu
    );
    setMaxQuantities(initialMaxQuantities);
  }, [withdrawalrowFilterDB]);

  // Function to handle decrease button clicks
  const handleDecreaseClick = (index, item) => {
    if (qtyArray[index] > 1) {
      const newQtyArray = [...qtyArray];
      newQtyArray[index] -= 1;
      setQtyArray(newQtyArray);
      const event = { target: { value: newQtyArray[index], name: "Menge" } };
      handleChangeQty(event, index, maxQuantities[index], item);
    }
  };

  // Function to handle increase button clicks
  const handleIncreaseClick = (index, item) => {
    if (qtyArray[index] < maxQuantities[index]) {
      const newQtyArray = [...qtyArray];
      newQtyArray[index] += 1;
      setQtyArray(newQtyArray);
      const event = { target: { value: newQtyArray[index], name: "Menge" } };
      handleChangeQty(event, index, maxQuantities[index], item);
    }
  };

  // Function to handle quantity changes
  const handleChangeQty = (event, index, maxQuantity, item) => {
    let newValue = parseInt(event.target.value, 10) || 0;
    newValue = Math.max(Math.min(newValue, maxQuantity), 1);
    const newQtyArray = [...qtyArray];
    newQtyArray[index] = newValue;
    setQtyArray(newQtyArray);

    // Update the quantity being edited
    const fieldName = event.target.name;
    const newQuantity = { ...editQuantity };
    newQuantity[fieldName] = newValue;
    setEditQuantity(newQuantity);

    // Update the item quantity in the filterDB
    const editedQuantity = {
      ID: item.ID,
      Auftragsnummer: item.Auftragsnummer,
      BeschichtungsArt: item.BeschichtungsArt,
      BeschichtungsDicke: item.BeschichtungsDicke,
      Lagerplatz: item.Lagerplatz,
      BestandNeu: newValue,
    };
    const newQuantityForOrder = [...filterDB];
    const findIndex = filterDB.findIndex((DBitem) => DBitem.ID === item.ID);
    newQuantityForOrder[findIndex] = editedQuantity;
    setFilterDB(newQuantityForOrder);
  };

  // Render the component
  return (
    <>
      {filterDB.map((item, index) => (
        <tr key={item.ID} onClick={(event) => rowClicked(event)}>
          <td className="checkbox">
            <input
              type="checkbox"
              className="form-check-input checkedID"
              name={item.Auftragsnummer}
              storagebin={item.Lagerplatz}
            />
          </td>
          <td>{item.Auftragsnummer}</td>
          <td>{item.BeschichtungsArt}</td>
          <td>{item.BeschichtungsDicke}</td>
          <td>{item.Lagerplatz}</td>

          <td>
            <button
              className="button-anzahl-steckbretter"
              type="button"
              onClick={(event) => {
                handleDecreaseClick(index, item);
                event.stopPropagation();
              }}
            >
              -
            </button>
            <input
              className="text-anzahl-steckbretter"
              type="tel"
              name="Menge"
              inputMode="numeric"
              min={1}
              max={maxQuantities[index]}
              value={qtyArray[index]}
              onChange={(event) => {
                handleChangeQty(event, index, item.BestandNeu, item);
              }}
              onClick={(event) => event.stopPropagation()}
            />
            <button
              className="button-anzahl-steckbretter"
              type="button"
              onClick={(event) => {
                handleIncreaseClick(index, item);
                event.stopPropagation();
              }}
            >
              +
            </button>
          </td>
        </tr>
      ))}
    </>
  );
};

export default WithdrawalRow;
