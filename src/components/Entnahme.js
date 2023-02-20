import React, { useState, Fragment } from "react";
import Table from "react-bootstrap/Table";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import ReadOnlyRow from "./ReadOnlyRow";
import EditableRow from "./EditableRow";

export default function Entnahme({ fertigungsauftragDB }) {
  const navigate = useNavigate(); //hook for navigation
  const [beschichtungsart, setBeschichtungsart] = useState("");
  const [beschichtungsdicke, setBeschichtungsdicke] = useState("");
  const [filter, setFilter] = useState(false);
  const [filterDB, setFilterDB] = useState([]);
  const [submittedOrders, setSubmittedOrders] = useState([]);
  const [withdrawnOrders, setWithdrawnOrders] = useState([]);
  const fullscreen = true;
  //bootstrap modal prompt message
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setWithdrawnOrders([]);
  };

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
  const handleCancelClick = () => {
    setEditItemId(null);
  };

  const {
    //register,
    handleSubmit,
    //watch,
    reset,
    formState,
    //formState: { errors },
  } = useForm();

  const onSubmit = () => {
    if (submittedOrders.length > 0) {
      let selectedOrders;
      let withdrawnQuantityOfSelectedOrder;
      let fertigungsauftrag;
      let arrWithdrawnOrders = [];
      //loop and update quantity of selected orders
      for (let i = 0; i < submittedOrders.length; i++) {
        selectedOrders = fertigungsauftragDB.find(
          //current quantity in DB
          ({ Auftragsnummer }) =>
            Auftragsnummer === submittedOrders[i].Auftragsnummer
        );
        withdrawnQuantityOfSelectedOrder = filterDB.find(
          //withdrawal quantity input in frontend
          ({ Auftragsnummer }) =>
            Auftragsnummer === submittedOrders[i].Auftragsnummer
        );

        fertigungsauftrag = submittedOrders[i].Auftragsnummer;

        let newQuantity =
          selectedOrders.Menge - withdrawnQuantityOfSelectedOrder.Menge;

        let withdrawnQuantity = withdrawnQuantityOfSelectedOrder.Menge;

        arrWithdrawnOrders.push({
          ...selectedOrders,
          newQty: newQuantity,
          withdrawnQty: withdrawnQuantity,
        }); //save orders of loops in a local variable because useState does not render in loop

        fetch(`${process.env.REACT_APP_API}/Auftragsnummer/Entnahme`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fertigungsauftrag,
            newQuantity,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            setBeschichtungsart("Fire");
            setBeschichtungsdicke("<= 2");
            setFilterDB([]);
            setSubmittedOrders([]); //reset, if not when click "weiter", previous order will be booked.
          })
          .catch((err) => console.log(err));

        fetch(`${process.env.REACT_APP_API}/Lagerplatz/UpdateQty`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fertigungsauftrag,
            newQuantity,
          }),
        })
          .then((res) => res.json())
          .catch((err) => console.log(err));
      }

      setWithdrawnOrders(arrWithdrawnOrders); //save the orders in useState
      setShow(true);
    } else {
    }
  };

  //tutorial: https://www.simplilearn.com/tutorials/reactjs-tutorial/how-to-create-functional-react-dropdown-menu
  //select beschichtungsart
  const handleChangeBeschichtungsart = (event) => {
    setBeschichtungsart(event.target.value);
  };

  //select beschichtungsdicke
  const handleChangeBeschichtungsdicke = (event) => {
    setBeschichtungsdicke(event.target.value);
  };

  //Aufträge anzeigen button submit
  const handleSubmitOrder = (event) => {
    event.preventDefault();
    setFilter(true);

    return <></>;
  };

  //jump to Wareneingang
  const handleWareneingang = (event) => {
    navigate("/Wareneingang");
  };

  let lower = "";
  let upper = "";
  if (beschichtungsdicke === "<= 2") {
    lower = 0;
    upper = 3;
  } else if (beschichtungsdicke === "2 - 6") {
    lower = 1;
    upper = 7;
  } else if (beschichtungsdicke === "> 6") {
    lower = 6;
    upper = 100;
  }

  if (filter) {
    if (beschichtungsart === "") {
      setFilterDB(
        fertigungsauftragDB.filter(
          (element) =>
            //element.Auftragsnummer === location.state.fertigungsauftrag && element.Auslagerung === false
            element.BeschichtungsDicke > lower &&
            element.BeschichtungsDicke < upper &&
            element.Menge > 0
        )
      );
    } else if (beschichtungsdicke === "") {
      setFilterDB(
        fertigungsauftragDB.filter(
          (element) =>
            element.BeschichtungsArt === beschichtungsart && element.Menge > 0
        )
      );
    } else {
      setFilterDB(
        fertigungsauftragDB.filter(
          (element) =>
            element.BeschichtungsArt === beschichtungsart &&
            element.BeschichtungsDicke > lower &&
            element.BeschichtungsDicke < upper &&
            element.Menge > 0
        )
      );
    }
    setFilter(false);
  }
  //reset form tutorial https://react-hook-form.com/api/useform/reset/
  React.useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  //checkbox
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
  };

  return (
    <div>
      <form onSubmit={handleEditQuantitySubmit}>
        <div className="beschichtung">
          <label htmlFor="beschichtungsart-select">
            <b>Beschichtungsart</b>&ensp;&ensp;&ensp;&ensp;&ensp;
          </label>
          <div>
            <select
              className="beschichtung-select"
              name="beschichtungsart"
              id="beschichtungsart-select"
              value={beschichtungsart}
              onChange={handleChangeBeschichtungsart}
            >
              <option value="" disabled hidden>
                --Bitte eine Option auswählen--
              </option>
              <option value="Fire">Fire</option>
              <option value="Gold">Gold</option>
              <option value="Silber">Silber</option>
              <option value="TiN">TiN</option>
            </select>
          </div>
        </div>
        <div className="beschichtung">
          <label htmlFor="beschichtungsdicke-select">
            <b>Beschichtungsdicke</b>&ensp;&ensp;&nbsp;
          </label>
          <div>
            <select
              className="beschichtung-select2"
              name="beschichtungsdicke"
              id="beschichtungsdicke-select"
              value={beschichtungsdicke}
              onChange={handleChangeBeschichtungsdicke}
            >
              <option value="" disabled hidden>
                --Bitte eine Option auswählen--
              </option>
              <option>&lt;= 2</option>
              <option>2 - 6</option>
              <option>&gt; 6</option>
            </select>
          </div>
        </div>
        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;
        <button
          variant="outline-secondary"
          className="pushable"
          onClick={handleSubmitOrder}
        >
          <span className="front">Aufträge anzeigen</span>
        </button>
        <p>
          <b>Warenkorb:</b>
        </p>
        <Table bordered hover className="table">
          <thead>
            <tr className="table-header">
              <th className="checkbox">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="allSelect"
                  checked={
                    filterDB.length > 0
                      ? filterDB.filter((order) => order.isChecked !== true)
                          .length < 1
                      : false
                  }
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
              <tr key={item.ID}>
                <td className="checkbox">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={item.isChecked || false}
                    onChange={handleChangeCheckbox}
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
      </form>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Button
          variant="outline-secondary"
          className="modalButton"
          type="submit"
        >
          Weiter
        </Button>
      </form>
      <Button
        variant="outline-secondary"
        className="modalButton"
        onClick={handleWareneingang}
      >
        Teilmenge Rückgabe
      </Button>

      <Modal
        fullscreen={fullscreen}
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="modalHeader" closeButton>
          <Modal.Title className="modalHeader">
            Aktuelle Buchung: 1001 - Entnahme
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="table">
            <thead>
              <tr>
                <td>Fertigungsauftrag</td>
                <td>Beschichtungsart</td>
                <td>Beschichtungsdicke</td>
                <td>Menge</td>
                <td>Restmenge</td>
                <td>Lagerplatz</td>
              </tr>
            </thead>
            <tbody>
              {withdrawnOrders.map((item) => (
                <tr>
                  <td>{item.Auftragsnummer}</td>
                  <td>{item.BeschichtungsArt}</td>
                  <td>{item.BeschichtungsDicke}</td>
                  <th>{item.withdrawnQty}</th>
                  <td>{item.newQty}</td>
                  <td>{item.Lagerplatz}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modalButton" onClick={handleClose}>
            Quittieren
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
