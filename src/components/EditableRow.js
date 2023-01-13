import React from "react";

const EditableRow = ({
  item,
  editQuantity,
  handleEditQuantityChange,
  handleCancelClick,
}) => {
  return (
    <>
      <td>{item.Auftragsnummer}</td>
      <td>{item.BeschichtungsArt}</td>
      <td>{item.BeschichtungsDicke}</td>
      <td>
        <input
          type="number"
          name="Menge"
          inputMode="numeric"
          pattern="[0-9]*"
          min="0"
          max={item.Menge}
          placeholder={item.Menge}
          value={editQuantity.Menge}
          onChange={handleEditQuantityChange}
        ></input>
      </td>
      <td>
        <button type="submit">Speichern</button>
        <button type="button" onClick={handleCancelClick}>
          Abbrechen
        </button>
      </td>
    </>
  );
};

export default EditableRow;
