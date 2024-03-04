import React from "react";
import Button from "react-bootstrap/Button";

const ReadOnlyRow = ({ item, handleEditQuantityClick }) => {
  return (
    <>
      <td>{item.Auftragsnummer}</td>
      <td>{item.BeschichtungsArt}</td>
      <td>{item.BeschichtungsDicke}</td>
      <td>{item.Lagerplatz}</td>
      <td>{item.BestandNeu}</td>
      <td>
        <Button
          className="actionBtn"
          type="button"
          onClick={(event) => handleEditQuantityClick(event, item)}
        >
          Menge ändern
        </Button>
      </td>
    </>
  );
};

export default ReadOnlyRow;
