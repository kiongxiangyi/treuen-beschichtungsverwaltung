import React, { useState, Fragment } from "react";
import Table from "react-bootstrap/Table";
import WithdrawalRow from "./WithdrawalRow";

export default function EntnahmeTable({
  setSubmittedOrders,
  filterDB,
  setFilterDB,
  withdrawalrowFilterDB,
}) {
  //Edit, Save, Cancel quantity buttons function https://youtu.be/dYjdzpZv5yc
  const [editItemId, setEditItemId] = useState(null);

  const [editQuantity, setEditQuantity] = useState({
    ID: "",
    Auftragsnummer: "",
    BeschichtungsArt: "",
    BeschichtungsDicke: "",
    Lagerplatz: "",
    Menge: "",
    BestandNeu: "",
  });

  //when click to edit
  const handleEditQuantityClick = (event, item) => {
    console.log(item);
    event.preventDefault();
    event.stopPropagation(); //prevent click to activate checkbox

    setEditItemId(item.ID); //get the id of the edited row

    const formValues = {
      Auftragsnummer: item.Auftragsnummer,
      BeschichtungsArt: item.BeschichtungsArt,
      BeschichtungsDicke: item.BeschichtungsDicke,
      Lagerplatz: item.Lagerplatz,
      Menge: item.Menge,
      BestandNeu: item.BestandNeu,
    };

    setEditQuantity(formValues); //show the original quantity
  };

  //when change the quantity
  const handleEditQuantityChange = (event) => {
    const fieldName = event.target.name; // Get the name attribute of the input tag -> Menge
    const fieldValue = parseInt(event.target.value); // Get the current value and parse it to an integer

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
      Lagerplatz: editQuantity.Lagerplatz,
      Menge: editQuantity.Menge,
      BestandNeu: editQuantity.Menge, //change the BestandNeu to widthrawal qty to show in the withdrawal table after save quantity
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
    const { name } = e.target;
    if (name === "allSelect") {
      let tempOrder = filterDB.map((order) => {
        return { ...order, isChecked: e.target.checked };
      });
      setFilterDB(tempOrder);

      const selectedOrders = tempOrder.filter(
        //filter checked orders for submit later
        (order) => order.isChecked === true
      );
      setSubmittedOrders(selectedOrders);
    }
  };

  const rowClicked = (event) => {
    //when select row
    if (
      event.target.parentElement.childNodes[0].type !== "checkbox"
      // || event.target.parentElement.childNodes[0].type !== "action"
    ) {
      event.target.parentElement.childNodes[0].childNodes[0].checked =
        !event.target.parentElement.childNodes[0].childNodes[0].checked;

      //check which item is click based on Auftragsnummer and Lagerplatz
      let tempOrder = filterDB.map((order) =>
        order.Auftragsnummer ===
          event.target.parentElement.childNodes[0].childNodes[0].name &&
        order.Lagerplatz ===
          event.target.parentElement.childNodes[0].childNodes[0].getAttribute(
            "storagebin"
          )
          ? {
              ...order,
              isChecked:
                event.target.parentElement.childNodes[0].childNodes[0].checked,
            }
          : order
      );
      setFilterDB(tempOrder);

      const selectedOrders = tempOrder.filter(
        (order) => order.isChecked === true
      );
      setSubmittedOrders(selectedOrders);

      let selectAllCheckbox =
        document.getElementsByClassName("selectAllCheckbox");

      if (
        tempOrder.filter((order) => order.isChecked === true).length !==
        tempOrder.length
      ) {
        selectAllCheckbox[0].checked = false;
      } else {
        selectAllCheckbox[0].checked = true;
      }
    } else {
      //when select checkbox
      let tempOrder = filterDB.map((order) =>
        order.Auftragsnummer ===
          event.target.parentElement.parentElement.childNodes[1].childNodes[0] //childNodes[1] refer to td Fertigungsauftrag
            .data &&
        order.Lagerplatz ===
          event.target.parentElement.parentElement.childNodes[4].childNodes[0] //childNodes[4] refer to td Lagerplatz
            .data
          ? {
              ...order,
              isChecked: event.target.checked,
            }
          : order
      );
      setFilterDB(tempOrder);

      const selectedOrders = tempOrder.filter(
        (order) => order.isChecked === true
      );
      setSubmittedOrders(selectedOrders);

      let selectAllCheckbox =
        document.getElementsByClassName("selectAllCheckbox");

      if (
        tempOrder.filter((order) => order.isChecked === true).length !==
        tempOrder.length
      ) {
        selectAllCheckbox[0].checked = false;
      } else {
        selectAllCheckbox[0].checked = true;
      }
    }

    //if to click table header to select all
    /* if (event.target.nodeName === "TH") {
      let checkboxList = document.getElementsByClassName("checkedID");
      for (let i = 0; i < checkboxList.length; i++) {
        checkboxList[i].checked = !checkboxList[i].checked;
      }
    } */
  };

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
            //onClick={(event) => rowClicked(event)}
          >
            <th className="checkbox">
              <input
                id="tableHeaderCheckbox"
                type="checkbox"
                className="form-check-input selectAllCheckbox"
                name="allSelect"
                onChange={handleChangeCheckbox}
              ></input>
            </th>

            <th>Fertigungsauftrag</th>
            <th>Beschichtungsart</th>
            <th>Beschichtungsdicke</th>
            <th>Lagerplatz</th>
            <th>Menge</th>
            {/*  <th className="aktion">Aktion</th> */}
          </tr>
        </thead>
        <tbody className="table-body">
          <WithdrawalRow
            rowClicked={rowClicked}
            withdrawalrowFilterDB={withdrawalrowFilterDB}
            setEditQuantity={setEditQuantity}
            editQuantity={editQuantity}
            filterDB={filterDB}
            setFilterDB={setFilterDB}
          />
        </tbody>
      </Table>
    </div>
  );
}
