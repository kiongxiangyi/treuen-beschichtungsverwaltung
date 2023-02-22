import React, { useState, Fragment } from "react";
import Table from "react-bootstrap/Table";
import ReadOnlyRow from "./ReadOnlyRow";
import EditableRow from "./EditableRow";

export default function EntnahmeTable({
  setSubmittedOrders,
  filterDB,
  setFilterDB,
}) {
  const [clicked, setClicked] = useState(false);

  //Edit, Save, Cancel quantity buttons function https://youtu.be/dYjdzpZv5yc
  const [editItemId, setEditItemId] = useState(null);

  const [editQuantity, setEditQuantity] = useState({
    Auftragsnummer: "",
    BeschichtungsArt: "",
    BeschichtungsDicke: "",
    Menge: "",
  });

  //when click to edit
  const handleEditQuantityClick = (event, item) => {
    event.preventDefault();
    event.stopPropagation(); //prevent click to activate checkbox

    setEditItemId(item.ID); //get the id of the edited row

    const formValues = {
      Auftragsnummer: item.Auftragsnummer,
      BeschichtungsArt: item.BeschichtungsArt,
      BeschichtungsDicke: item.BeschichtungsDicke,
      Menge: item.Menge,
    };

    setEditQuantity(formValues); //show the original quantity
  };

  //when change the quantity
  const handleEditQuantityChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name"); //get the name attribute of the input tag -> Menge
    const fieldValue = event.target.value; //get the current value

    const newQuantity = { ...editQuantity }; //new object of quantity
    newQuantity[fieldName] = fieldValue; //change the quantity to the current value
    setEditQuantity(newQuantity); //update the current value
  };

  //submit the changed quantity
  const handleEditQuantitySubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const editedQuantity = {
      ID: editItemId,
      Auftragsnummer: editQuantity.Auftragsnummer,
      BeschichtungsArt: editQuantity.BeschichtungsArt,
      BeschichtungsDicke: editQuantity.BeschichtungsDicke,
      Menge: editQuantity.Menge,
    };

    const newQuantity = [...filterDB];
    const index = filterDB.findIndex((item) => item.ID === editItemId);
    newQuantity[index] = editedQuantity;

    setFilterDB(newQuantity); //update value to current table in website
    setEditItemId(null); //go to ReadOnlyRow
  };

  //not to change the quantity click
  const handleCancelClick = (event) => {
    setEditItemId(null);
    event.stopPropagation();
  };

  //checkbox
  const handleChangeCheckbox = (e) => {
    let checkboxList = document.getElementsByClassName("checkedID");

    for (let i = 0; i < checkboxList.length; i++) {
      checkboxList[i].checked = e.target.checked;
    }

    let tempOrder = filterDB.map((order) => {
      return { ...order, isChecked: e.target.checked };
    });
    setFilterDB(tempOrder);

    const selectedOrders = tempOrder.filter(
      //filter checked orders for submit later
      (order) => order.isChecked === true
    );
    setSubmittedOrders(selectedOrders);
  };

  const rowClicked = (event) => {
    event.target.parentElement.childNodes[0].childNodes[0].checked =
      !event.target.parentElement.childNodes[0].childNodes[0].checked;

    let tempOrder = filterDB.map((order) =>
      order.Auftragsnummer ===
      event.target.parentElement.childNodes[0].childNodes[0].name
        ? {
            ...order,
            isChecked:
              event.target.parentElement.childNodes[0].childNodes[0].checked,
          }
        : order
    );
    setFilterDB(tempOrder);
    console.log(event.target.parentElement.childNodes[0].childNodes[0].name);
    const selectedOrders = tempOrder.filter(
      (order) => order.isChecked === true
    );
    setSubmittedOrders(selectedOrders);

    /* if (event.target.nodeName === "TH") {
      let checkboxList = document.getElementsByClassName("checkedID");
      for (let i = 0; i < checkboxList.length; i++) {
        checkboxList[i].checked = !checkboxList[i].checked;
      }
    } */
  };

  /* //checkbox
  const handleChangeCheckbox = (e) => {
    const { name, checked } = e.target;
    if (name === "allSelect") {
      //when allSelect, all assigned isChecked
      let tempOrder = filterDB.map((order) => {
        return { ...order, isChecked: checked };
      });
      setFilterDB(tempOrder);

      const selectedOrders = tempOrder.filter(
        //filter checked orders for submit later
        (order) => order.isChecked === true
      );
      setSubmittedOrders(selectedOrders);
    } else {
      let tempOrder = filterDB.map((order) =>
        order.Auftragsnummer === name ? { ...order, isChecked: checked } : order
      );
      setFilterDB(tempOrder);

      const selectedOrders = tempOrder.filter(
        (order) => order.isChecked === true
      );
      setSubmittedOrders(selectedOrders);
    }
  }; */

  return (
    <div>
      <p>
        <b>Warenkorb:</b>
      </p>
      <Table bordered hover className="table">
        <thead>
          <tr
            name="row"
            className="table-header"
            onClick={(event) => rowClicked(event)}
          >
            <th className="checkbox">
              <input
                id="tableHeaderCheckbox"
                type="checkbox"
                className="form-check-input"
                name="allSelect"
                onChange={handleChangeCheckbox}
              ></input>
            </th>

            <th>Fertigungsauftrag</th>
            <th>Beschichtungsart</th>
            <th>Beschichtungsdicke</th>
            <th>Menge</th>
            <th>Aktion</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {filterDB.map((item) => (
            <tr key={item.ID} onClick={(event) => rowClicked(event)}>
              <td className="checkbox">
                <input
                  type="checkbox"
                  className="form-check-input checkedID"
                  name={item.Auftragsnummer}
                />
              </td>

              <Fragment>
                {editItemId === item.ID ? (
                  <EditableRow
                    item={item}
                    editQuantity={editQuantity}
                    handleEditQuantityChange={handleEditQuantityChange}
                    handleCancelClick={handleCancelClick}
                    handleEditQuantitySubmit={handleEditQuantitySubmit}
                  />
                ) : (
                  <ReadOnlyRow
                    item={item}
                    handleEditQuantityClick={handleEditQuantityClick}
                  />
                )}
              </Fragment>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
