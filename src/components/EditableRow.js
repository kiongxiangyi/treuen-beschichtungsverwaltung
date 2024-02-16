import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";

const EditableRow = ({
  item,
  editQuantity,
  handleEditQuantityChange,
  handleCancelClick,
  handleEditQuantitySubmit,
  maximumValueDB,
}) => {
  //get the original Maximum Quantity array of each order
  const maxQuantityFromDisplayedOrders = maximumValueDB.filter(
    (currentValue) =>
      currentValue.Lagerplatz === item.Lagerplatz &&
      currentValue.Auftragsnummer === item.Auftragsnummer
  );
  //set the maxQuantity from the array
  const maxQuantity = maxQuantityFromDisplayedOrders[0].Menge;
  const minQuantity = 1;
  // Handle input change, limiting to maximum value
  const handleInputChange = (event) => {
    let inputValue = event.target.value;
    const parsedInputValue = parseInt(inputValue);

    // If input value is less than minQuantity, set it to 1
    if (parsedInputValue < minQuantity) {
      inputValue = "1";
      event.target.value = inputValue;
    }
    // If input value exceeds max, set to max
    else if (parsedInputValue > maxQuantity) {
      inputValue = maxQuantity.toString();
      event.target.value = inputValue;
    }
    handleEditQuantityChange(event); // Call the original change handler
  };

  return (
    <>
      <td>{item.Auftragsnummer}</td>
      <td>{item.BeschichtungsArt}</td>
      <td>{item.BeschichtungsDicke}</td>
      <td>{item.Lagerplatz}</td>
      <td>
        <input
          type="number"
          name="Menge"
          inputMode="numeric"
          pattern="[0-9]+"
          min={minQuantity}
          max={maxQuantity}
          placeholder={item.Menge}
          value={editQuantity.Menge}
          onChange={handleInputChange}
          onClick={(event) => event.stopPropagation()} //prevent error because of the activation of rowclick when clicking in the box to change quantity
        ></input>
      </td>
      <td>
        <Button
          className="actionBtn"
          type="button"
          onClick={handleEditQuantitySubmit}
        >
          Speichern
        </Button>
        <Button className="actionBtn" type="button" onClick={handleCancelClick}>
          Abbrechen
        </Button>
      </td>
    </>
  );
};

export default EditableRow;
