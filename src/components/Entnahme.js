import React, { useState, useEffect, Fragment } from "react";
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
  const [arrAuftragsQuittieren, setArrAuftragsQuittieren] = useState([]);

  //bootstrap modal prompt message
  const [show, setShow] = useState(false);
  const handleClose = () => {
    console.log(arrAuftragsQuittieren);

    //update new quantity to DB tblEShelfBeschichtung
    /* fetch(`${process.env.REACT_APP_API}/Auftragsnummer/ChangeQuantity`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        editItemId,
        filterDB,
      }),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err)); 
*/
    setShow(false);
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
  const handleEditQuantitySubmit = async (event) => {
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

    await setFilterDB(newQuantity); //update value to current table in website
    console.log(filterDB[0].Menge);
    await setArrAuftragsQuittieren(filterDB);
    console.log(filterDB[0].Menge);
    setEditItemId(null); //go to ReadOnlyRow
  };

  //not to change the quantity click
  const handleCancelClick = () => {
    setEditItemId(null);
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {
    if (selectAll) {
      console.log(selectAll);
    } else if (selectOrder) {
      /* console.log(filterDB);

      let selectedOrderID = filterDB.map((x) => {
        return x.Auftragsnummer;
      });

      console.log(selectedOrderID);
      let selectedOrder = selectOrder.filter(
        (x) => !selectedOrderID.includes(x)
      ); 

      console.log(selectedOrder); */

      fetch(`${process.env.REACT_APP_API}/Auftragsnummer/Entnahme`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          selectOrder,
          filterDB,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          setBeschichtungsart("");
          setBeschichtungsdicke("");
          setFilterDB([]);
        })
        .catch((err) => console.log(err));

      setShow(true);
    } else {
      // toast.error("Bitte wählen Sie mindestens einen Artikel");
    }
    //return selectAll ?  : console.log(selectAll);
    //return selectOrder ? console.log(selectOrder) : console.log(selectOrder);
  };
  const selectAll = watch("selectAll");
  // console.log("selectAll", selectAll);
  const selectOrder = watch("selectOrder");
  //console.log("selectOrder", selectOrder);

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
    setFilterDB(
      fertigungsauftragDB.filter(
        (element) =>
          //element.Auftragsnummer === location.state.fertigungsauftrag &&
          element.BeschichtungsArt === beschichtungsart &&
          element.BeschichtungsDicke > lower &&
          element.BeschichtungsDicke < upper &&
          element.Menge > 0 &&
          element.Auslagerung === false
      )
    );
    setFilter(false);
  }
  //reset form tutorial https://react-hook-form.com/api/useform/reset/
  React.useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

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
              <option value="">--Bitte eine Option auswählen--</option>
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
              className="beschichtung-select"
              name="beschichtungsdicke"
              id="beschichtungsdicke-select"
              value={beschichtungsdicke}
              onChange={handleChangeBeschichtungsdicke}
            >
              <option value="">--Bitte eine Option auswählen--</option>
              <option>&lt;= 2</option>
              <option>2 - 6</option>
              <option>&gt; 6</option>
            </select>
          </div>
        </div>
        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;
        <Button className="showOrderButton" onClick={handleSubmitOrder}>
          Aufträge anzeigen
        </Button>
        <p>
          <b>Warenkorb:</b>
        </p>
        <Table bordered hover>
          <thead>
            <tr className="table-header">
              <th className="checkbox">
                <input
                  type="checkbox"
                  value="all"
                  {...register("selectAll")}
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
                    value={item.Auftragsnummer}
                    {...register("selectOrder", { required: true })}
                  ></input>
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
        {/* errors will return when field validation fails  */}
        {errors.selectOrder && (
          <p>Bitte wählen Sie mindestens einen Artikel!</p>
        )}

        <Button className="modalButton" type="submit">
          Weiter
        </Button>
      </form>
      <Button className="modalButton" onClick={handleWareneingang}>
        Teilmenge Rückgabe
      </Button>

      <Modal
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
        <Modal.Body></Modal.Body>
        <Modal.Footer>
          <Button className="modalButton" onClick={handleClose}>
            Quittieren
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
