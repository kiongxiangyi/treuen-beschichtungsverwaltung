import React, { useState, useEffect } from "react";
import "../App.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

export default function Wareneingang({ articleDB }) {
  const [fertigungsauftrag, setFertigungsauftrag] = useState("");
  const [freeStorageBins, setFreeStorageBins] = useState("");
  const [occupiedStorageBins, setOccupiedStorageBins] = useState("");
  const [fertigungsauftragDummy, setFertigungsauftragDummy] = useState("");
  const [fertigungsauftragDB, setFertigungsauftragDB] = useState([]);
  const [quantity, setQuantity] = useState(""); //quantity for display after booking
  const [storageBin, setStorageBin] = useState(""); //storage bin for display after booking
  const [beschichtungsArt, setBeschichtungsArt] = useState("");
  const [beschichtungsDicke, setBeschichtungsDicke] = useState("");
  const [beschichtungsartOptions, setBeschichtungsartOptions] = useState([]);
  const [beschichtungsdickeOptions, setBeschichtungsdickeOptions] = useState([]);
  const [beschichtungsText, setBeschichtungsText] = useState("");
  const [wareneingangBeschichtungsart, setWareneingangBeschichtungsart] =
    useState("");
  const [wareneingangBeschichtungsdicke, setWareneingangBeschichtungsdicke] =
    useState("");
  //bootstrap modal prompt message
  const [show, setShow] = useState(false);
  const [showSAPchecked, setShowSAPchecked] = useState(false);
  const [showNotFoundOrderMessage, setShowNotFoundOrderMessage] =
    useState(false);

  const handleChangeWareneingangBeschichtungsdicke = (event) => {
    setWareneingangBeschichtungsdicke(event.target.value);
  };

  const fetchFreeStorageBins = () => {
    fetch(`${process.env.REACT_APP_API}/LagerPlatz/freeStorageBins`)
      .then((res) => res.json())
      .then((data) => {
        setFreeStorageBins(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const fetchOccupiedStorageBins = () => {
    fetch(`${process.env.REACT_APP_API}/LagerPlatz/occupiedStorageBins`)
      .then((res) => res.json())
      .then((data) => {
        setOccupiedStorageBins(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const fetchBeschichtungKriterien = () => {
    fetch(`${process.env.REACT_APP_API}/BeschichtungKriterien`)
      .then((res) => res.json())
      .then((data) => {
        setBeschichtungsartOptions(
          //remove duplicate of data
          data.reduce(function (acc, curr) {
            if (!acc.includes(curr.Beschichtungsart))
              acc.push(curr.Beschichtungsart);
            return acc;
          }, [])
        );
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleClose = () => {
    setShowSAPchecked(false);
    setShow(false);
    fetchFreeStorageBins();
    fetchOccupiedStorageBins();
  };

  const handleCloseAndUpdateBeschichtung = () => {
    if (wareneingangBeschichtungsart && wareneingangBeschichtungsdicke) {
      setShowSAPchecked(false);
      setShow(false);
      fetchFreeStorageBins();
      fetchOccupiedStorageBins();
      //update beschictungsart and dicke to DB
      fetch(`${process.env.REACT_APP_API}/Auftragsnummer/BeschichtungsText`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          fertigungsauftragDummy,
          wareneingangBeschichtungsart,
          wareneingangBeschichtungsdicke,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          setWareneingangBeschichtungsart("");
          setWareneingangBeschichtungsdicke("");
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    fetchFreeStorageBins();
    fetchOccupiedStorageBins();
    fetchBeschichtungKriterien();
  }, []);

  const handleCloseNotFoundOrderMessage = () => {
    setShowNotFoundOrderMessage(false);
  };

  const [showNoInput, setShowNoInput] = useState(false);
  const handleCloseNoInput = () => setShowNoInput(false);

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
      }

      //if found in tblEShelfBeschichtung, update data
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
        //if not found in tblEShelfBeschichtung, create a new data
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
    const fetchWareneingangOrders = async () => {
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
            let oldQuantity = results[i].BestandAlt; //assign old quantity for Buchungsdaten
            let recordForOldQuantity = results[i].Menge; //assign the current quanity for BestandAlt in DB
            //reset tblEShelf
            fetch(
              `${process.env.REACT_APP_API}/Auftragsnummer/WarenEingangEinlagerungFalse`,
              {
                method: "PUT",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },

                body: JSON.stringify({
                  fertigungsauftrag,
                  recordForOldQuantity,
                }),
              }
            )
              .then((res) => res.json())
              .then((res) => {
                setBeschichtungsArt(results[i].BeschichtungsArt);
                setBeschichtungsDicke(results[i].BeschichtungsDicke);
                setBeschichtungsText(results[i].BeschichtungsText);
              })
              .catch((err) => console.log(err));

            //update qty from SAP when Erledigt is TRUE
            let newQuantity = results[i].Menge;
            let storagebin = results[i].Lagerplatz;

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
              .then((res) => {
                setQuantity(newQuantity);
                setStorageBin(results[i].Lagerplatz);
              })
              .catch((err) => console.log(err));

            fetch(`${process.env.REACT_APP_API}/Buchungsdaten/Wareneingang`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                fertigungsauftrag,
                storagebin,
                oldQuantity,
                newQuantity,
              }),
            })
              .then((res) => res.json())
              .catch((err) => console.log(err));

            setShow(false);
            setShowSAPchecked(true);
          } else if (results[i].Bemerkung === "kein FA vorhanden") {
            //reset tblEShelf
            fetch(
              `${process.env.REACT_APP_API}/Auftragsnummer/WarenEingangKeinFAVorhanden`,
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
    fetchWareneingangOrders();

    //fetch Artikel every X second
    interval = setInterval(() => {
      fetchWareneingangOrders();
    }, 1 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <div className="scan-field">
        <h1>
          <b>Fertigungsauftrag scannen:</b>
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            className="inputFertigungsauftrag"
            autoFocus
            type="number"
            id="fertigungsauftrag"
            name="fertigungsauftrag"
            size="35"
            pattern="[0-9]+"
            value={fertigungsauftrag}
            onChange={(e) => setFertigungsauftrag(e.target.value)}
          />

          <Modal
            show={showNoInput}
            onHide={handleCloseNoInput}
            backdrop="static"
            keyboard={false}
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
              In SAP wird es geprüft, ob die Fertigungsauftrag vorhanden ist.
              Klicken Sie die E-Label an, wenn sie blinkt.
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
          </Modal>

          <Modal
            show={showSAPchecked}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header className="modalHeader" closeButton>
              <Modal.Title className="modalHeader">
                Aktuelle Buchung: 3001 - Wareneingang
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <table className="table">
                <thead></thead>
                <tbody>
                  <tr>
                    <td className="tabledata">Fertigungsauftrag</td>
                    <th className="tabledata">{fertigungsauftragDummy}</th>
                  </tr>
                  <tr>
                    <td className="tabledata">Beschichtungstext</td>
                    <th className="tabledata">{beschichtungsText}</th>
                  </tr>
                  <tr>
                    <td className="tabledata">Beschichtungsart</td>
                    <th className="tabledata">
                      <div>
                        <select
                          className="wareneingang-beschichtung-select"
                          name="beschichtungsart"
                          id="beschichtungsart-select"
                          value={wareneingangBeschichtungsart}
                          onChange={(e) =>
                            setWareneingangBeschichtungsart(e.target.value)
                          }
                        >
                          {beschichtungsartOptions.map((option, i) => (
                            <option value={option} key={i}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </th>
                  </tr>
                  <tr>
                    <td className="tabledata">Beschichtungsdicke</td>
                    <th className="tabledata">
                      <div>
                        <select
                          className="wareneingang-beschichtung-select"
                          name="beschichtungsart"
                          id="beschichtungsart-select"
                          value={wareneingangBeschichtungsdicke}
                          onChange={handleChangeWareneingangBeschichtungsdicke}
                        >
                          {beschichtungsdickeOptions.map((option, i) => (
                            <option value={option} key={i}>
                              {option}
                            </option>
                          ))}
                          
                        </select>
                        {/*  <input
                          className="wareneingang-beschichtung-select"
                          type="text"
                          id="beschichtungsdicke-select"
                          name="beschichtungsdicke"
                          value={wareneingangBeschichtungsdicke}
                          onChange={handleChangeWareneingangBeschichtungsdicke}
                        ></input> */}
                      </div>
                    </th>
                  </tr>
                  <tr>
                    <td className="tabledata">Menge</td>
                    <th className="tabledata">{quantity}</th>
                  </tr>
                  <tr>
                    <td className="tabledata">Lagerplatz</td>
                    <th className="tabledata">{storageBin}</th>
                  </tr>
                </tbody>
              </table>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="modalButton"
                onClick={handleCloseAndUpdateBeschichtung}
              >
                Quittieren
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={showNotFoundOrderMessage}
            onHide={handleCloseNotFoundOrderMessage}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header className="modalHeader" closeButton>
              <Modal.Title className="modalHeader">
                Aktuelle Buchung: 3001 - Wareneingang
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Die Fertigungsauftragsnummer {fertigungsauftragDummy} wurde nicht
              in SAP gefunden. Bitte scannen Sie eine gültige Auftragsnummer.
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
