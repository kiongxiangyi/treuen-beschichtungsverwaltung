import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

export default function EntnahmeModal({
  setBeschichtungsart,
  setBeschichtungsdicke,
  setFilterDB,
  setSubmittedOrders,
  setShow,
  show,
  withdrawnOrders,
  setWithdrawnOrders,
}) {
  const countRef = useRef(0); //count initial value 0
  const fullscreen = true;
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const selectAllCheckbox =
    document.getElementsByClassName("selectAllCheckbox");

  const handleQuittieren = async () => {
    for (let i = 0; i < withdrawnOrders.length; i++) {
      //loop withdrawn orders
      let fertigungsauftrag = withdrawnOrders[i].Auftragsnummer; // get order number
      let newQuantity = withdrawnOrders[i].newQty; // get new qty
      let oldQuantity = withdrawnOrders[i].Menge;
      let storagebin = withdrawnOrders[i].Lagerplatz;
      let withdrawnQuantity = withdrawnOrders[i].withdrawnQty;

      console.log(withdrawnOrders[i])

      await fetch(`${process.env.REACT_APP_API}/Auftragsnummer/EntnahmeSuccess`, {
        //update new Qty to DB
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
          setBeschichtungsart("Fire"); //reset filter Beschichtungsart
          setBeschichtungsdicke("<= 2"); //reset filter Beschichtungsdicke
          setFilterDB([]); //reset filter of orders
          setSubmittedOrders([]); //reset, if not when click "weiter", previous order will be booked.
        })
        .catch((err) => console.log(err));

      await fetch(`${process.env.REACT_APP_API}/Lagerplatz/UpdateQty`, {
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

      // without await, the booking data in the loop could not be finished.
      await fetch(`${process.env.REACT_APP_API}/Buchungsdaten/Entnahme`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          fertigungsauftrag,
          newQuantity,
          oldQuantity,
          storagebin,
          withdrawnQuantity,
        }),
      })
        .then((res) => res.json())
        .catch((err) => console.log(err));
    }

    setButtonDisabled(true); //reset button to disabled
    setShow(false); //close message box
    setWithdrawnOrders([]); //reset previous withdrawals record

    selectAllCheckbox[0].checked = false; //uncheck AllSelect
  };

  //if close button, nothing happen, reset everything, close message box
  const handleCloseButton = () => {
    setShow(false);
    setWithdrawnOrders([]);
    setFilterDB([]);
    setSubmittedOrders([]);
    setBeschichtungsart("");
    setBeschichtungsdicke("");

    for (let i = 0; i < withdrawnOrders.length; i++) {
      //loop withdrawn orders
      let fertigungsauftrag = withdrawnOrders[i].Auftragsnummer;
      fetch(
        `${process.env.REACT_APP_API}/Auftragsnummer/EntnahmeAuslagerungFalse`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fertigungsauftrag,
          }),
        }
      )
        .then((res) => res.json())
        .catch((err) => console.log(err));
    }

    selectAllCheckbox[0].checked = false; //uncheck AllSelect
  };

  //get tblEShelfBeschichtung
  useEffect(() => {
    let interval;
    if (show) {
      const fetchWithdrawalOrders = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API}/Auftragsnummer`
          );
          const results = await response.json();

          if (withdrawnOrders.length > 0) {
            //if withdrawals exist
            for (let i = 0; i < withdrawnOrders.length; i++) {
              //loop withdrawal orders
              for (let j = 0; j < results.length; j++) {
                //loop data in DB
                if (
                  results[j].Auftragsnummer ===
                    withdrawnOrders[i].Auftragsnummer && //find withdrawal order in DB
                  results[j].Auslagerung === true &&
                  results[j].Erledigt === true //check if it is set to TRUE
                ) {
                  let fertigungsauftrag = withdrawnOrders[i].Auftragsnummer;
                  countRef.current++; // update count when one order in array withdrawnOrders done

                  fetch(
                    `${process.env.REACT_APP_API}/Auftragsnummer/EntnahmePending`,
                    {
                      method: "PUT",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                      },

                      body: JSON.stringify({
                        fertigungsauftrag,
                      }),
                    }
                  )
                    .then((res) => res.json())
                    .catch((err) => console.log(err));
                }
              }
            }
 
            if (countRef.current === withdrawnOrders.length) {
              countRef.current = 0; //reset count when all withdrawnOrders processed
              setButtonDisabled(false);
            }
          }
        } catch (err) {
          console.log(err);
          toast.error(
            "There is no connection to database. Please check the database server."
          );
        }
      };
      fetchWithdrawalOrders();

      //fetch Artikel every X second
      interval = setInterval(() => {
        fetchWithdrawalOrders();
      }, 1 * 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [show, withdrawnOrders]);

  return (
    <div>
      <Modal
        fullscreen={fullscreen}
        show={show}
        onHide={handleCloseButton}
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
                <tr key={item.ID}>
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
          <Button
            className="modalButton"
            disabled={buttonDisabled}
            onClick={handleQuittieren}
          >
            Quittieren
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
