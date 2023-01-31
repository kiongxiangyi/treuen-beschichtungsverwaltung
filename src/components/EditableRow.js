import React from "react";
import Button from "react-bootstrap/Button";

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
        <Button className="actionBtn" type="submit">
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
