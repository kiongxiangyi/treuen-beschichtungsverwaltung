import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const fullscreen = true;
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const selectAllCheckbox =
    document.getElementsByClassName("selectAllCheckbox");
  let quittiertWithdrawnOrders = [];

  const handleQuittieren = async () => {
    selectAllCheckbox[0].checked = false; //uncheck AllSelect
    setShow(false); //close message box
    let orders;
    if (withdrawnOrders.length === 0) {
      orders = quittiertWithdrawnOrders;
    } else {
      orders = withdrawnOrders;
    }

    for (let i = 0; i < orders.length; i++) {
      //loop withdrawn orders
      let fertigungsauftrag = orders[i].Auftragsnummer; // get order number
      let withdrawnQuantity = orders[i].Menge;
      let storageBin = orders[i].Lagerplatz;
      // without await, the booking data in the loop could not be finished.
      /* await fetch(`${process.env.REACT_APP_API}/Buchungsdaten/Entnahme`, {
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
        .catch((err) => console.log(err)); */

      //Buchungsdaten have to be first updated, because the BestandAlt in Auftragsnummer will be updated after that.
      //update newQty and Bemerkung of withdrawn storage bins
      await fetch(
        `${process.env.REACT_APP_API}/Auftragsnummer/EntnahmeSuccess`,
        {
          //update new Qty to DB
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fertigungsauftrag,
            storageBin,
            withdrawnQuantity,
          }),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          setBeschichtungsart(""); //reset filter Beschichtungsart
          setBeschichtungsdicke(""); //reset filter Beschichtungsdicke
          setFilterDB([]); //reset filter of orders
          setSubmittedOrders([]); //reset, if not when click "weiter", previous order will be booked.
        })
        .catch((err) => console.log(err));
      /* 
      await fetch(`${process.env.REACT_APP_API}/Lagerplatz/UpdateQty`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          fertigungsauftrag,
          newQuantity,
          storageBin,
        }),
      })
        .then((res) => res.json())
        .catch((err) => console.log(err));*/
    }

    setButtonDisabled(true); //reset button to disabled
    setWithdrawnOrders([]); //reset previous withdrawals record
  };

  //if close button, nothing happen, reset everything, close message box
  const handleCloseButton = () => {
    setButtonDisabled(true); //reset Button after timeout
    setShow(false);
    setWithdrawnOrders([]);
    setFilterDB([]);
    setSubmittedOrders([]);
    setBeschichtungsart("");
    setBeschichtungsdicke("");

    for (let i = 0; i < withdrawnOrders.length; i++) {
      //loop withdrawn orders
      let fertigungsauftrag = withdrawnOrders[i].Auftragsnummer;
      let storageBin = withdrawnOrders[i].Lagerplatz;

      //Withrawal not successful in Bemerkung. If total Quantity 0, will delete the all the data also
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
            storageBin,
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
      //console.log("withdrawnOrders", withdrawnOrders);
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
                  results[j].Bemerkung ===
                    "E-Label wurde angeklickt - Entnahme fertig" && //check if it is set to TRUE
                  withdrawnOrders[i].Lagerplatz === results[j].Lagerplatz
                ) {
                  console.log("withdrawnOrders", withdrawnOrders);
                  quittiertWithdrawnOrders.push(withdrawnOrders[i]); //save the orders in array for the function handleQuittieren
                  withdrawnOrders.splice(i, 1); // make the orders disappear line by line
                }

                if (withdrawnOrders.length === 0) {
                  handleQuittieren();
                  break;
                }
              }
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

  const [time, setTime] = useState(1000);
  //Timeout for Quittieren Button
  useEffect(() => {
    let timer;
    const fetchTimeout = async () => {
      await fetch(`${process.env.REACT_APP_API}/LagerPlatz/ButtonTimeout`)
        .then((res) => res.json())
        .then((data) => {
          setTime(data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
    fetchTimeout();

    if (show) {
      timer = setTimeout(() => {
        setButtonDisabled(false);
      }, time);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [show]);

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
                <td>Lagerplatz</td>
                <td>Menge</td>
                <td>Restmenge</td>
              </tr>
            </thead>
            <tbody>
              {withdrawnOrders.map((item, i) => (
                <tr key={i}>
                  <td>{item.Auftragsnummer}</td>
                  <td>{item.BeschichtungsArt}</td>
                  <td>{item.BeschichtungsDicke}</td>
                  <td>{item.Lagerplatz}</td>
                  <th>{item.Menge}</th>
                  <td>{item.BestandNeu - item.Menge}</td>
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
      <ToastContainer />
    </div>
  );
}
