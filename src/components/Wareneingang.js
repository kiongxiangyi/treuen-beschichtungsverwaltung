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
  const [numberOfStorageBins, setNumberOfStorageBins] = useState([]);
  const [wareneingangOrders, setWareneingangOrders] = useState([]);
  let quittiertWareneingangOrders = [];

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

  const handleBestätigenWareneingangOrders = async () => {
    try {
      if (
        wareneingangBeschichtungsart &&
        wareneingangBeschichtungsdicke &&
        anzahlSteckbretter !== ""
      ) {
        setShowSAPchecked(false);

        await fetch(
          `${process.env.REACT_APP_API}/LagerPlatz/assignStorageBin`,
          {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              fertigungsauftrag,
              quantity,
              anzahlSteckbretter,
            }),
          }
        )
          .then((res) => res.json())
          .catch((err) => console.log(err));

        fetch(
          `${process.env.REACT_APP_API}/Auftragsnummer/AddMoreStorageBins`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              fertigungsauftrag,
              wareneingangBeschichtungsart,
              wareneingangBeschichtungsdicke,
              beschichtungsText,
              quantity,
              anzahlSteckbretter,
            }),
          }
        )
          .then((res) => res.json())
          .then((data) => {
            setWareneingangOrders(data);
          })
          .catch((err) => console.log(err));
      }

      setAnzahlSteckbretter(1);
      setWareneingangBeschichtungsart("");
      setWareneingangBeschichtungsdicke("");

      setShowWareneingangOrders(true);
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
            results[i].Erledigt === true &&
            results[i].Lagerplatz === 0
          ) {
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
                }),
              }
            )
              .then((res) => res.json())
              .then((res) => {
                setFertigungsauftrag(results[i].Auftragsnummer);
                setBeschichtungsText(results[i].BeschichtungsText);
                setQuantity(results[i].Menge);
                setShow(false);
                setShowSAPchecked(true);
              })
              .catch((err) => console.log(err));
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

  //get tblEShelfBeschichtung
  useEffect(() => {
    let interval;
    if (showWareneingangOrders) {
      const fetchWareneingangOrders = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API}/Auftragsnummer`
          );
          const results = await response.json();

          if (wareneingangOrders.length > 0) {
            for (let i = 0; i < wareneingangOrders.length; i++) {
              for (let j = 0; j < results.length; j++) {
                if (
                  wareneingangOrders[i].Auftragsnummer ===
                    results[j].Auftragsnummer &&
                  results[j].Bemerkung ===
                    "E-Label wurde angeklickt - Wareneingang" &&
                  wareneingangOrders[i].Lagerplatz === results[j].Lagerplatz
                ) {
                  let fertigungsauftrag = wareneingangOrders[i].Auftragsnummer;
                  let storageBin = wareneingangOrders[i].Lagerplatz;
                  quittiertWareneingangOrders.push(wareneingangOrders[i]);
                  wareneingangOrders.splice(i, 1);
                  fetch(
                    `${process.env.REACT_APP_API}/Auftragsnummer/WareneingangPending`,
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
                if (wareneingangOrders.length === 0) {
                  handleQuittieren();
                }
              }
            }
          }

          const timer = setTimeout(() => {
            setButtonDisabled(false);
          }, 10000);
          return () => {
            clearTimeout(timer);
            setButtonDisabled(false);
          };
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
    }
  }, [showWareneingangOrders, wareneingangOrders]);

  const handleQuittieren = async () => {
    if (wareneingangOrders.length > 0) {
      for (let i = 0; i < wareneingangOrders.length; i++) {
        let fertigungsauftrag = wareneingangOrders[i].Auftragsnummer;
        let storageBin = wareneingangOrders[i].Lagerplatz;

        await fetch(
          `${process.env.REACT_APP_API}/Auftragsnummer/WareneingangPending`,
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
    }

    setButtonDisabled(true); //reset button to disabled
    setShowWareneingangOrders(false); //close message box
    setWareneingangOrders([]); //reset previous withdrawals record
  };

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
                onClick={handleBestätigenWareneingangOrders}
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
                      <td>{item.BeschichtungsArt}</td>
                      <td>{item.BeschichtungsDicke}</td>
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
