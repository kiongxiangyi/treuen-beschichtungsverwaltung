import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function Entnahme({ fertigungsauftragDB }) {
  const [beschichtungsart, setBeschichtungsart] = useState("");
  const [beschichtungsdicke, setBeschichtungsdicke] = useState("");
  const [filter, setFilter] = useState(false);
  const [filterDB, setFilterDB] = useState([]);

  //bootstrap modal prompt message
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

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
      console.log(selectOrder);

      fetch(`${process.env.REACT_APP_API}/Auftragsnummer/Entnahme`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          selectOrder,
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
      fertigungsauftragDB
        .filter(
          (element) =>
            //element.Auftragsnummer === location.state.fertigungsauftrag &&
            element.BeschichtungsArt === beschichtungsart &&
            element.BeschichtungsDicke > lower &&
            element.BeschichtungsDicke < upper &&
            element.Menge > 0
          // && element.Auslagerung === false
        )
        .map((item) => {
          return (
            <tr key={item.ID}>
              <td className="checkbox">
                <input
                  type="checkbox"
                  value={item.Auftragsnummer}
                  {...register("selectOrder", { required: true })}
                ></input>
              </td>
              <td>{item.Auftragsnummer}</td>
              <td>{item.BeschichtungsArt}</td>
              <td>{item.BeschichtungsDicke}</td>
              <td>{item.Menge}</td>
            </tr>
          );
        })
    );
    setFilter(false);
  }
  //filter function
  /* const uniqueArrBeschichtungsart = [
    ...new Set(fertigungsauftragDB.map((data) => data.Zusatztext1)),
  ];
  console.log(uniqueArrBeschichtungsart); */

  //reset form tutorial https://react-hook-form.com/api/useform/reset/
  React.useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  return (
    <div>
      <form onSubmit={handleSubmitOrder}>
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
        &nbsp;&ensp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;
        <Button className="modalButton" type="submit">
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
            </tr>
          </thead>
          <tbody className="table-body">{filterDB}</tbody>
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
