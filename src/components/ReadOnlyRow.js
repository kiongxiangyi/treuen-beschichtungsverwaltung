import React from "react";

const ReadOnlyRow = ({ item, handleEditQuantityClick }) => {
  return (
    <>
      <td>{item.Auftragsnummer}</td>
      <td>{item.BeschichtungsArt}</td>
      <td>{item.BeschichtungsDicke}</td>
      <td>{item.Menge}</td>
      <td>
        <button
          type="button"
          onClick={(event) => handleEditQuantityClick(event, item)}
        >
          Menge ändern
        </button>
      </td>
    </>
  );
};

export default ReadOnlyRow;
