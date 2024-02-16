import React, { useState, useEffect, useCallback } from "react";
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
  const [showNoInput, setShowNoInput] = useState(false);
  const [showCheckingSAP, setShowCheckingSAP] = useState(false);
  const [showSAPchecked, setShowSAPchecked] = useState(false);
  const [showNotFoundOrderMessage, setShowNotFoundOrderMessage] =
    useState(false);
  const [showWareneingangOrders, setShowWareneingangOrders] = useState(false);

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const fullscreen = true;
  const [wareneingangOrders, setWareneingangOrders] = useState([]);
  // let quittiertWareneingangOrders = [];
  const [showNoStorageBins, setShowNoStorageBins] = useState(false);

  //get storage bins data
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

  //fetch data from tblEShelfBeschichtungKriterien
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

  //run one time in page to get actual status in tblLagerplatz and tblBeschichtungKriterien
  useEffect(() => {
    fetchFreeStorageBins();
    fetchOccupiedStorageBins();
    fetchBeschichtungKriterien();
  }, []);

  const [anzahlSteckbretter, setAnzahlSteckbretter] = useState(1);

  const [mengeSteckbretter, setMengeSteckbretter] = useState(() => {
    return Array.from({ length: anzahlSteckbretter }, () => 0);
  });

  useEffect(() => {
    //if anzahlSteckbretter change back to 1, need to setMengeSteckbretter again
    if (anzahlSteckbretter === 1) {
      setMengeSteckbretter([quantity]);
    } else {
      // Update `mengeSteckbretter` whenever `anzahlSteckbretter` changes
      setMengeSteckbretter(Array.from({ length: anzahlSteckbretter }, () => 0));
    }
  }, [anzahlSteckbretter]);

  // Function to handle change in quantity of a specific Steckbretter
  const handleChangeMenge = (value, index) => {
    const newMengeSteckbretter = [...mengeSteckbretter];
    newMengeSteckbretter[index] = parseInt(value) || 0;
    setMengeSteckbretter(newMengeSteckbretter);
  };

  // Function to decrease the quantity of a specific Steckbretter
  const decMengeSteckbretter = (index) => {
    const newMengeSteckbretter = [...mengeSteckbretter];
    if (newMengeSteckbretter[index] > 0) {
      newMengeSteckbretter[index]--;
      setMengeSteckbretter(newMengeSteckbretter);
    }
  };

  // Function to increase the quantity of a specific Steckbretter
  const incMengeSteckbretter = (index) => {
    const newMengeSteckbretter = [...mengeSteckbretter];
    newMengeSteckbretter[index]++;
    setMengeSteckbretter(newMengeSteckbretter);
  };

  // JSX to render the input fields for Menge Steckbretter
  const renderMengeSteckbretterInputs = () => {
    const inputs = [];
    for (let i = 0; i < anzahlSteckbretter; i++) {
      inputs.push(
        <tr key={`steckbretter-${i}`}>
          <td className="tabledata">{`Menge Steckbretter ${i + 1}`}</td>
          <th className="tabledata">
            <button
              className="button-anzahl-steckbretter"
              type="button"
              onClick={() => decMengeSteckbretter(i)}
            >
              -
            </button>
            <input
              className="text-anzahl-steckbretter"
              type="text"
              value={mengeSteckbretter[i]}
              onChange={(e) => handleChangeMenge(e.target.value, i)}
            />
            <button
              className="button-anzahl-steckbretter"
              type="button"
              onClick={() => incMengeSteckbretter(i)}
            >
              +
            </button>
          </th>
        </tr>
      );
    }
    return inputs;
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

  //close all message box and get get/update storage bins data
  const handleClose = () => {
    setButtonDisabled(true); //reset Button after timeout

    setShowNoStorageBins(false);
    fetchFreeStorageBins();
    fetchOccupiedStorageBins();
    setFertigungsauftrag("");
    setAnzahlSteckbretter(1); //reset
    const resetArray = Array(mengeSteckbretter.length).fill(0);
    setMengeSteckbretter(resetArray);
  };

  const handleCloseWithoutBookingInDB = () => {
    fetch(`${process.env.REACT_APP_API}/Auftragsnummer/withoutBooking`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => {
        setShowCheckingSAP(false);
        setShowSAPchecked(false);
      })
      .catch((err) => console.log(err));
  };

  const handleCloseNoInput = () => setShowNoInput(false);

  //show booking failed in Bemerkung when click X to close
  const handleCloseWithoutBooking = () => {
    for (let i = 0; i < wareneingangOrders.length; i++) {
      let storageBin = wareneingangOrders[i].Lagerplatz;
      fetch(
        `${process.env.REACT_APP_API}/Auftragsnummer/WarenEingangEinlagerungFailed`,
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
        .then((res) => {
          setShowWareneingangOrders(false);
          setFertigungsauftrag("");
        })
        .catch((err) => console.log(err));
    }
  };

  const handleCloseNotFoundOrderMessage = () => {
    setShowNotFoundOrderMessage(false);
  };

  //function for successful Wareneingang or manuell Quittieren
  const handleQuittieren = useCallback(async () => {
    //update storage bins data
    fetchFreeStorageBins();
    fetchOccupiedStorageBins();
    //if E-Label not being clicked, wareneingangOrders are not empty
    if (wareneingangOrders.length > 0) {
      for (let i = 0; i < wareneingangOrders.length; i++) {
        let fertigungsauftrag = wareneingangOrders[i].Auftragsnummer;
        let storageBin = wareneingangOrders[i].Lagerplatz;

        await fetch(
          `${process.env.REACT_APP_API}/Auftragsnummer/WareneingangSuccess`,
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
          .then((res) => {
            setFertigungsauftrag("");
          })
          .catch((err) => console.log(err));
      }
    }

    setButtonDisabled(true); //reset button to disabled
    setShowWareneingangOrders(false); //close message box
    setWareneingangOrders([]); //reset previous withdrawals record
  }, [wareneingangOrders]);

  //Step 1: Scan Order
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!fertigungsauftrag) {
      //error message when empty field
      setShowNoInput(true);
    } else {
      setFertigungsauftragDummy(fertigungsauftrag); //get the order number

      //find the order in DB tblEShelfBeschichtung
      const findAuftrag = fertigungsauftragDB.find(
        (tblEShelfBeschichtung) =>
          tblEShelfBeschichtung.Auftragsnummer === fertigungsauftrag
      );

      //find the order in DB tblArtikel
      const findArticle = articleDB.find(
        (tblArtikel) => tblArtikel.Artikel === fertigungsauftrag
      );

      //if no article exists, create article, article supplier and storage location
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
      }

      //if found in tblEShelfBeschichtung, update data for SAP interface to be activated
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

      setShowCheckingSAP(true); //show message "in checking process with SAP"
    }
  };

  //Step 2: Every second check tblEShelfBeschichtung if Erledigt is TRUE (feedback from SAP interface)
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
            //if in SAP exists (Erledigt TRUE)
            results[i].Einlagerung === true &&
            results[i].Erledigt === true &&
            results[i].Lagerplatz === "0"
          ) {
            //update Eingelung false and Bemerkung "SAP checked"
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
                setFertigungsauftrag(results[i].Auftragsnummer); //get order number from table and show it later in next message box
                setBeschichtungsText(results[i].BeschichtungsText); //get Beschichtungstext from table and show it later in next message box
                setQuantity(results[i].Menge); //get quantity from table and show it later in next message box
                setShowCheckingSAP(false); //close current message box
                setShowSAPchecked(true); // open next message box
                if (anzahlSteckbretter === 1) {
                  //when initial anzahlSteckbretter not changed -> set the quantity in the DB table
                  setMengeSteckbretter([results[i].Menge]);
                }
              })
              .catch((err) => console.log(err));
          }
          // if in SAP not exists
          else if (results[i].Bemerkung === "kein FA vorhanden") {
            //update Bemerkung: "kein FA vorhanden - es wird gelöscht"
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

            setShowCheckingSAP(false); //close current message box
            setShowNotFoundOrderMessage(true); // open next message box
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

    //fetch Artikel every one second
    interval = setInterval(() => {
      fetchWareneingangOrders();
    }, 1 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  //Step 3: After select the number of Steckbretter, show order
  const handleBestätigenWareneingangOrders = async () => {
    try {
      //if no more storage bins available
      if (freeStorageBins < anzahlSteckbretter) {
        setShowNoStorageBins(true); //show message no more storage bins
        setShowSAPchecked(false); //close current message box
      } else if (
        //make sure all the 3 infos are selected
        wareneingangBeschichtungsart &&
        wareneingangBeschichtungsdicke &&
        anzahlSteckbretter !== ""
      ) {
        //assign storage bins
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
              //quantity,
              anzahlSteckbretter,
              mengeSteckbretter,
            }),
          }
        )
          .then((res) => res.json())
          .catch((err) => console.log(err));

        //Add more data in tblEShelfBeschichtung and write in DB Bemerkung: "E-Label leuchtet"
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
              //quantity,
              anzahlSteckbretter,
              mengeSteckbretter,
            }),
          }
        )
          .then((res) => res.json())
          .then((data) => {
            setWareneingangOrders(data); //get the results from backend of all the data of the order
          })
          .catch((err) => console.log(err));

        setShowSAPchecked(false); //close current message box
        setShowWareneingangOrders(true); //show next message box
      } else {
        toast.error("Bitte alle Felder ausfüllen!");
      }

      setAnzahlSteckbretter(1); //reset
      setWareneingangBeschichtungsart(""); //reset
      setWareneingangBeschichtungsdicke(""); //reset
    } catch (err) {
      console.log(err);
      toast.error(
        "There is no connection to database. Please check the database server."
      );
    }
  };

  //Step 4: Every second check if E-Label is clicked
  useEffect(() => {
    let interval;
    if (showWareneingangOrders) {
      const waitForELabel = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API}/Auftragsnummer`
          );
          const results = await response.json();

          if (wareneingangOrders.length > 0) {
            for (let i = 0; i < wareneingangOrders.length; i++) {
              for (let j = 0; j < results.length; j++) {
                //check if E-Label of the order with storage bins being clicked and make it disapper line by line in frontend
                if (
                  wareneingangOrders[i].Auftragsnummer ===
                    results[j].Auftragsnummer &&
                  results[j].Bemerkung === "E-Label wurde angeklickt" &&
                  wareneingangOrders[i].Lagerplatz === results[j].Lagerplatz
                ) {
                  let fertigungsauftrag = wareneingangOrders[i].Auftragsnummer;
                  let storageBin = wareneingangOrders[i].Lagerplatz;
                  //quittiertWareneingangOrders.push(wareneingangOrders[i]); //array for manual booking if E-Label lost connection
                  wareneingangOrders.splice(i, 1); //delete the array where E-Label being clicked
                  //write Bemerkung: "E-Label wurde angeklickt - Wareneingang -> success"
                  await fetch(
                    `${process.env.REACT_APP_API}/Auftragsnummer/WareneingangSuccess`,
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
                //after all the E-Labels of storage bins of the orders being clicked
                if (wareneingangOrders.length === 0) {
                  handleQuittieren();
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
      waitForELabel();

      //fetch Artikel every X second
      interval = setInterval(() => {
        waitForELabel();
      }, 1 * 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [wareneingangOrders, showWareneingangOrders, handleQuittieren]);

  const [time, setTime] = useState(10000);
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

    if (showWareneingangOrders) {
      timer = setTimeout(() => {
        setButtonDisabled(false);
      }, time);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [showWareneingangOrders]);

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
              Feld darf nicht leer sein! Bitte scannen Sie einen gültigen
              Fertigungsauftrag.
            </Modal.Body>
            <Modal.Footer>
              <Button className="modalButton" onClick={handleCloseNoInput}>
                Schließen
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={showCheckingSAP}
            onHide={handleCloseWithoutBookingInDB}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header className="modalHeader" closeButton>
              <Modal.Title className="modalHeader">
                Aktuelle Buchung: 3001 - Wareneingang
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>Die Fertigungsauftrag wird in SAP geprüft.</Modal.Body>
            <Modal.Footer></Modal.Footer>
          </Modal>

          <Modal
            show={showSAPchecked}
            onHide={handleCloseWithoutBookingInDB}
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
                          onChange={(e) =>
                            setWareneingangBeschichtungsdicke(e.target.value)
                          }
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
                      <button
                        className="button-anzahl-steckbretter"
                        type="button"
                        onClick={() =>
                          setAnzahlSteckbretter(
                            Math.max(1, anzahlSteckbretter - 1)
                          )
                        }
                      >
                        -
                      </button>
                      <input
                        className="text-anzahl-steckbretter"
                        type="text"
                        value={anzahlSteckbretter}
                        onChange={(e) => setAnzahlSteckbretter(e.target.value)}
                      ></input>
                      <button
                        className="button-anzahl-steckbretter"
                        type="button"
                        onClick={() =>
                          setAnzahlSteckbretter(anzahlSteckbretter + 1)
                        }
                      >
                        +
                      </button>
                    </th>
                  </tr>
                  {anzahlSteckbretter > 1 &&
                    renderMengeSteckbretterInputs(anzahlSteckbretter)}
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
            onHide={handleCloseWithoutBooking}
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
                    <td>Menge</td>
                  </tr>
                </thead>
                <tbody>
                  {wareneingangOrders.map((item, i) => (
                    <tr key={i}>
                      <td>{item.Auftragsnummer}</td>
                      <td>{item.BeschichtungsArt}</td>
                      <td>{item.BeschichtungsDicke}</td>
                      <td>{item.Lagerplatz}</td>
                      <td>{item.Menge}</td>
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
              Der Fertigungsauftrag {fertigungsauftragDummy} existiert nicht.
              Bitte scannen Sie einen gültigen Fertigungsauftrag.
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

          <Modal
            show={showNoStorageBins}
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
              Es sind nicht genügend Lagerplätze vorhanden. Die Buchung kann
              nicht durchgeführt werden.
            </Modal.Body>
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
