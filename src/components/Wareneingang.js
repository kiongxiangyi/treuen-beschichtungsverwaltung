import React, { useState, useEffect, useRef } from "react";
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
  const [lagerPlatzDB, setLagerPlatzDB] = useState([]);
  const [quantity, setQuantity] = useState(""); //quantity for display after booking
  const [storageBin, setStorageBin] = useState(""); //storage bin for display after booking
  const [beschichtungsArt, setBeschichtungsArt] = useState("");
  const [beschichtungsDicke, setBeschichtungsDicke] = useState("");
  const [beschichtungsartOptions, setBeschichtungsartOptions] = useState([]);
  const [beschichtungsdickeOptions, setBeschichtungsdickeOptions] = useState(
    []
  );
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
  const [showAbfrageSteckbretter, setShowAbfrageSteckbretter] = useState(false);
  const [showWareneingangOrders, setShowWareneingangOrders] = useState(false);
  const [anzahlSteckbretter, setAnzahlSteckbretter] = useState(1);
  const innerRef = useRef();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const fullscreen = true;

  let wareneingangOrders = [];
  wareneingangOrders.push({
    Auftragsnummer: "1",
    Beschichtungsart: "test",
    Beschichtungsdicke: "test",
    Lagerplatz: "1",
  });

  const handleWareneingangOrders = () => {
    fetchFreeStorageBins();
    fetchOccupiedStorageBins();
  };

  const handleChangeWareneingangBeschichtungsart = (event) => {
    setWareneingangBeschichtungsart(event.target.value);
  };

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

  //get beschichtungsdicke option from backend when beschichtungsart in frontend being selected
  useEffect(() => {
    if (wareneingangBeschichtungsart) {
      fetch(
        `${process.env.REACT_APP_API}/BeschichtungKriterien/Beschichtungsdicke?Beschichtungsart=${wareneingangBeschichtungsart}`
      )
        .then((res) => res.json())
        .then((data) => {
          setBeschichtungsdickeOptions(
            //remove duplicate of data
            data.reduce(function (acc, curr) {
              if (!acc.includes(curr.Beschichtungsdicke))
                acc.push(curr.Beschichtungsdicke);
              return acc;
            }, [])
          );
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [wareneingangBeschichtungsart]);

  const handleClose = () => {
    setShowSAPchecked(false);
    setShow(false);
    //setShowAbfrageSteckbretter(false);
    setShowWareneingangOrders(false);
    fetchFreeStorageBins();
    fetchOccupiedStorageBins();
  };

  /* const handleCloseAndUpdateBeschichtung = () => {
    if (wareneingangBeschichtungsart && wareneingangBeschichtungsdicke) {
      setShowSAPchecked(false);
      setShowWareneingangOrders(true);
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
  }; */

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
        /* fetch(`${process.env.REACT_APP_API}/LagerPlatz/assignStorageBin`, {
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
          .catch((err) => console.log(err)); */

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

  const handleBestätigenAnzahlSteckbretter = async () => {
    try {
      if (
        wareneingangBeschichtungsart &&
        wareneingangBeschichtungsdicke &&
        anzahlSteckbretter !== ""
      ) {
        setShowSAPchecked(false);
        setShowWareneingangOrders(true);

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
    } catch (err) {
      console.log(err);
      toast.error(
        "There is no connection to database. Please check the database server."
      );
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
            /*
            const response = await fetch(
        `${process.env.REACT_APP_API}/Auftragsnummer`
      );
      const results = await response.json();
      setFertigungsauftragDB(results);

      let tempLagerPlatz;

      if (anzahlSteckbretter > 1) {
        for (let i = 0; i < anzahlSteckbretter; i++) {
          fetch(`${process.env.REACT_APP_API}/LagerPlatz/assignStorageBin`, {
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

        fetch(`${process.env.REACT_APP_API}/LagerPlatz`)
          .then((res) => res.json())
          .catch((err) => console.log(err));
      } else if (anzahlSteckbretter === "1") {
        fetch(`${process.env.REACT_APP_API}/LagerPlatz/assignStorageBin`, {
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

        setShowAbfrageSteckbretter(false);
        setShowSAPchecked(true);
      } else {
        console.log("empty or negative value not allowed");
      }
      // let oldQuantity = results[i].BestandAlt; //assign old quantity for Buchungsdaten
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
            */
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

          {/* <Modal
            show={showAbfrageSteckbretter}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header className="modalHeader" closeButton>
              <Modal.Title className="modalHeader">
                Anzahl Steckbretter
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                className=""
                autoFocus
                type="number"
                id="anzahlSteckbretter"
                name="anzahlSteckbretter"
                pattern="[0-9]+"
                placeholder="1"
                value={anzahlSteckbretter}
                onChange={(e) => setAnzahlSteckbretter(e.target.value)}
              ></input>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="modalButton"
                onClick={handleBestätigenAnzahlSteckbretter}
              >
                Bestätigen
              </Button>
            </Modal.Footer>
          </Modal> */}

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
                          onChange={handleChangeWareneingangBeschichtungsart}
                        >
                          <option value=""></option>
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
                          <option value=""></option>
                          {beschichtungsdickeOptions.map((option, i) => (
                            <option value={option} key={i}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </th>
                  </tr>
                  <tr>
                    <td className="tabledata">Menge</td>
                    <th className="tabledata">{quantity}</th>
                  </tr>
                  <tr>
                    <td className="tabledata">Anzahl Steckbretter</td>
                    <th className="tabledata">
                      <input
                        className=""
                        autoFocus
                        type="number"
                        id="anzahlSteckbretter"
                        name="anzahlSteckbretter"
                        pattern="[0-9]+"
                        placeholder="1"
                        value={anzahlSteckbretter}
                        onChange={(e) => setAnzahlSteckbretter(e.target.value)}
                      ></input>
                    </th>
                  </tr>
                </tbody>
              </table>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="modalButton"
                onClick={handleBestätigenAnzahlSteckbretter}
              >
                Bestätigen
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            fullscreen={fullscreen}
            show={showWareneingangOrders}
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
                <thead>
                  <tr>
                    <td>Fertigungsauftrag</td>
                    <td>Beschichtungsart</td>
                    <td>Beschichtungsdicke</td>
                    <td>Lagerplatz</td>
                  </tr>
                </thead>
                <tbody>
                  {wareneingangOrders.map((item, i) => (
                    <tr key={i}>
                      <td>{item.Auftragsnummer}</td>
                      <td>{item.Beschichtungsart}</td>
                      <td>{item.Beschichtungsdicke}</td>
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
                onClick={handleWareneingangOrders}
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
