import React, { useState, useEffect } from "react";
import "../App.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

export default function Wareninggang({ articleDB }) {
  const [fertigungsauftrag, setFertigungsauftrag] = useState("");
  const [freeStorageBins, setFreeStorageBins] = useState("");
  const [occupiedStorageBins, setOccupiedStorageBins] = useState("");
  const [fertigungsauftragDummy, setFertigungsauftragDummy] = useState("");
  const [fertigungsauftragDB, setFertigungsauftragDB] = useState([]);

  //bootstrap modal prompt message
  const [show, setShow] = useState(false);
  const [showSAPchecked, setShowSAPchecked] = useState(false);
  const [showNotFoundOrderMessage, setShowNotFoundOrderMessage] =
    useState(false);

  const handleClose = () => {
    setShowSAPchecked(false);
  };

  const handleCloseNotFoundOrderMessage = () => {
    setShowNotFoundOrderMessage(false);
  };

  const [showNoInput, setShowNoInput] = useState(false);
  const handleCloseNoInput = () => setShowNoInput(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/LagerPlatz/freeStorageBins`)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        setFreeStorageBins(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/LagerPlatz/occupiedStorageBins`)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        setOccupiedStorageBins(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!fertigungsauftrag) {
      setShowNoInput(true);
    } else {
      setFertigungsauftragDummy(fertigungsauftrag);
      //find auftragsnummer in DB
      const findAuftrag = fertigungsauftragDB.find(
        (tblEShelfBeschichtung) =>
          tblEShelfBeschichtung.Auftragsnummer === fertigungsauftrag
      );

      //find Artikel in DB
      const findArticle = articleDB.find(
        (tblArtikel) => tblArtikel.Artikel === fertigungsauftrag
      );

      if (!findArticle) {
        fetch(`${process.env.REACT_APP_API}/Artikel`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fertigungsauftrag,
          }),
        })
          .then((res) => res.json())
          .catch((err) => console.log(err));

        fetch(`${process.env.REACT_APP_API}/ArtikelLieferanten`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fertigungsauftrag,
          }),
        })
          .then((res) => res.json())
          .catch((err) => console.log(err));

        fetch(`${process.env.REACT_APP_API}/LagerArtikel`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fertigungsauftrag,
          }),
        })
          .then((res) => res.json())
          .catch((err) => console.log(err));

        fetch(`${process.env.REACT_APP_API}/LagerPlatz/assignStorageBin`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fertigungsauftrag,
          }),
        })
          .then((res) => res.json())
          .catch((err) => console.log(err));
      }

      //if not found in tblEShelfBeschichtung, create a new data
      if (findAuftrag) {
        fetch(`${process.env.REACT_APP_API}/Auftragsnummer/Wareneingang`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fertigungsauftrag,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            setFertigungsauftrag("");
          })
          .catch((err) => console.log(err));
      } else {
        fetch(`${process.env.REACT_APP_API}/Auftragsnummer`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fertigungsauftrag,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            setFertigungsauftrag("");
          })
          .catch((err) => console.log(err));
      }

      setShow(true);
    }
  };

  //get tblEShelfBeschichtung
  useEffect(() => {
    let interval;
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}/Auftragsnummer`
        );
        const results = await response.json();
        setFertigungsauftragDB(results);
        for (let i = 0; i < results.length; i++) {
          let fertigungsauftrag = results[i].Auftragsnummer;

          if (
            //Wareneingang fertig
            results[i].Einlagerung === true &&
            results[i].Erledigt === true
          ) {
            //reset tblEShelf
            fetch(
              `${process.env.REACT_APP_API}/Auftragsnummer/WareneingangErledigtFalse`,
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

            //update qty from SAP when Erledigt is TRUE
            let qty = results[i].Menge;
            fetch(`${process.env.REACT_APP_API}/Lagerplatz/UpdateQty`, {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                fertigungsauftrag,
                qty,
              }),
            })
              .then((res) => res.json())
              .catch((err) => console.log(err));

            setShow(false);
            setShowSAPchecked(true);
          } else if (results[i].Bemerkung === "not found") {
            //reset tblEShelf
            fetch(
              `${process.env.REACT_APP_API}/Auftragsnummer/WareneingangErledigtFalse`,
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

            setShow(false);
            setShowNotFoundOrderMessage(true);
          }
        }
      } catch (err) {
        console.log(err);
        toast.error(
          "There is no connection to database. Please check the database server."
        );
      }
    };
    fetchOrders();

    //fetch Artikel every X second
    interval = setInterval(() => {
      fetchOrders();
    }, 2 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <div className="scan-field">
        <h1>Bitte Fertigungsauftrag scannen:</h1>
        <form onSubmit={handleSubmit}>
          <input
            className="InputFertigungsauftrag"
            autoFocus
            type="text"
            id="fertigungsauftrag"
            name="fertigungsauftrag"
            size="35"
            value={fertigungsauftrag}
            onChange={(e) => setFertigungsauftrag(e.target.value)}
          />

          <Modal
            show={showNoInput}
            onHide={handleCloseNoInput}
            backdrop="static"
            keyboard={false}
            // centered
          >
            <Modal.Header className="modalHeader" closeButton>
              <Modal.Title className="modalHeader">Fehler</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Es darf nicht leer sein. Bitte Fertigungsauftrag scannen.
            </Modal.Body>
            <Modal.Footer>
              <Button className="modalButton" onClick={handleCloseNoInput}>
                Schließen
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={show}
            // onHide={handleClose}
            backdrop="static"
            keyboard={false}
            // centered
          >
            <Modal.Header className="modalHeader" closeButton>
              <Modal.Title className="modalHeader">
                Aktuelle Buchung: 3001 - Wareneingang
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              In SAP wird es geprüft, ob die Fertigungsauftrag vorhanden ist...
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
          </Modal>

          <Modal
            show={showSAPchecked}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            // centered
          >
            <Modal.Header className="modalHeader" closeButton>
              <Modal.Title className="modalHeader">
                Aktuelle Buchung: 3001 - Wareneingang
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Fertigungsauftrag {fertigungsauftragDummy} wurde in GTMS angelegt.
              Lagerplatz wurde automatisch zugeordnet.
            </Modal.Body>
            <Modal.Footer>
              <Button className="modalButton" onClick={handleClose}>
                Quittieren
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={showNotFoundOrderMessage}
            onHide={handleCloseNotFoundOrderMessage}
            backdrop="static"
            keyboard={false}
            // centered
          >
            <Modal.Header className="modalHeader" closeButton>
              <Modal.Title className="modalHeader">
                Aktuelle Buchung: 3001 - Wareneingang
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Der Fertigungsauftrag {fertigungsauftragDummy} wurde nicht in SAP
              gefunden. Bitte scannen Sie eine richtige Auftragsnummer.
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="modalButton"
                onClick={handleCloseNotFoundOrderMessage}
              >
                Quittieren
              </Button>
            </Modal.Footer>
          </Modal>
        </form>
      </div>
      <div className="storage-bin">
        <p>
          <b>Freie Lagerplätze: {freeStorageBins}</b>
        </p>
        <p>
          <b>Belegte Lagerplätze: {occupiedStorageBins}</b>
        </p>
      </div>
    </div>
  );
}
