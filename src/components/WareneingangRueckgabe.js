import React, { useState, useEffect, useCallback } from "react";
import "../App.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import Header from "./Header";

export default function WareneingangRueckgabe({ articleDB, rueckgabe }) {
  const [fertigungsauftrag, setFertigungsauftrag] = useState("");
  const [freeStorageBins, setFreeStorageBins] = useState("");
  const [occupiedStorageBins, setOccupiedStorageBins] = useState("");
  const [fertigungsauftragDummy, setFertigungsauftragDummy] = useState("");
  const [fertigungsauftragDB, setFertigungsauftragDB] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(""); //quantity for display after booking
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

  // State variables to manage the number of items and their quantities
  const [anzahlSteckbretter, setAnzahlSteckbretter] = useState(1); // Number of items
  const [mengeSteckbretter, setMengeSteckbretter] = useState(() => {
    // Quantities of items
    // Initialize quantities based on the number of items
    if (anzahlSteckbretter === 1) {
      return [totalQuantity]; // Single item, set its quantity
    } else {
      const defaultValues = new Array(anzahlSteckbretter).fill(0); // Multiple items, initialize quantities with 0
      defaultValues[0] = totalQuantity; // Set the quantity for the first item
      return defaultValues;
    }
  });

  // Effect to handle changes in the number of items or their quantity
  useEffect(() => {
    // Update quantities based on the number of items and their quantity
    if (anzahlSteckbretter === 1) {
      setMengeSteckbretter([totalQuantity]); // Update quantity for a single item
    } else {
      const defaultValues = new Array(anzahlSteckbretter).fill(0); // Initialize quantities for multiple items
      defaultValues[0] = totalQuantity; // Set the quantity for the first item
      setMengeSteckbretter(defaultValues); // Update quantities for all items
    }
  }, [anzahlSteckbretter, totalQuantity]); // Dependencies for the effect

  // Function to handle change in quantity of an item
  const handleChangeMenge = (value, index) => {
    let newValue = parseInt(value) || 0; // Convert input value to integer or set it to 0 if not a valid number
    const currentTotalQuantity = mengeSteckbretter.reduce(
      (acc, curr) => acc + curr,
      0
    ); // Calculate current total quantity
    const remainingQuantity =
      totalQuantity -
      currentTotalQuantity +
      mengeSteckbretter[index] -
      newValue; // Calculate remaining quantity after change

    if (remainingQuantity >= 0) {
      // Check if remaining quantity is non-negative
      const newMengeSteckbretter = [...mengeSteckbretter]; // Copy current quantities
      newMengeSteckbretter[index] = newValue; // Update quantity for the specified item

      // Adjust the quantity of the first item if not the first item being modified
      if (index !== 0) {
        const diff = mengeSteckbretter[index] - newValue; // Calculate the difference in quantity
        newMengeSteckbretter[0] += diff; // Adjust the quantity of the first item
      }

      setMengeSteckbretter(newMengeSteckbretter); // Update quantities
    }
  };

  // Function to decrease the quantity of an item
  const decMengeSteckbretter = (index) => {
    const newMengeSteckbretter = [...mengeSteckbretter]; // Copy current quantities

    if (newMengeSteckbretter[index] > 0) {
      // Check if quantity is positive
      newMengeSteckbretter[index]--; // Decrease quantity of the specified item
      setMengeSteckbretter(newMengeSteckbretter); // Update quantities

      // Automatically adjust the quantity of the first item if not the first item being modified
      /* if (index !== 0) {
        newMengeSteckbretter[0]++; // Increase the quantity of the first item
        setMengeSteckbretter(newMengeSteckbretter); // Update quantities
      } */
    }
  };

  // Function to increase the quantity of an item
  const incMengeSteckbretter = (index) => {
    const newMengeSteckbretter = [...mengeSteckbretter]; // Copy current quantities
    const currentQuantity = mengeSteckbretter.reduce(
      (acc, curr) => acc + curr,
      0
    ); // Calculate total current quantity
    const remainingQuantity = totalQuantity - currentQuantity; // Calculate remaining quantity available for increase

    // Check if there is enough remaining quantity to increase the current item's quantity
    if (remainingQuantity > 0 || newMengeSteckbretter[index] < totalQuantity) {
      newMengeSteckbretter[index]++; // Increase quantity of the specified item
      setMengeSteckbretter(newMengeSteckbretter); // Update quantities

      // Automatically adjust the quantity of the first item if not the first item being modified
      if (index !== 0) {
        if (currentQuantity === totalQuantity) {
          //make sure the total quantity always be considered
          newMengeSteckbretter[0]--; // Decrease the quantity of the first item if total quantity is already at maximum
          setMengeSteckbretter(newMengeSteckbretter); // Update quantities
        }
      }

      // Automatically adjust the next item's quantity if the current item reaches its maximum
      for (let i = newMengeSteckbretter.length - 1; i > index; i--) {
        if (newMengeSteckbretter[i] > 0 && currentQuantity === totalQuantity) {
          //make sure the total quantity always be considered
          newMengeSteckbretter[i]--; // Decrease quantity of the previous item
          setMengeSteckbretter(newMengeSteckbretter); // Update quantities
          break;
        }
      }
    }
  };

  // Function to render inputs for managing item quantities
  const renderMengeSteckbretterInputs = () => {
    const newMengeSteckbretter = [...mengeSteckbretter]; // Copy current quantities
    const remainingQuantity =
      totalQuantity - mengeSteckbretter.reduce((acc, curr) => acc + curr, 0); // Calculate remaining quantity

    const inputs = [];
    for (let i = 0; i < anzahlSteckbretter; i++) {
      // Loop through each item
      inputs.push(
        <tr key={`steckbretter-${i}`}>
          <td className="tabledata">{`Menge Steckbrett ${i + 1}`}</td>
          <th className="tabledata">
            <button
              className="button-anzahl-steckbretter"
              type="button"
              onClick={() => decMengeSteckbretter(i)} // Decrease quantity button
            >
              -
            </button>
            <input
              className="text-anzahl-steckbretter"
              type="tel" //number for IOS
              //pattern="[0-9]*"
              inputmode="numeric" //hidden calculation symbol
              value={mengeSteckbretter[i]} // Display current quantity
              min={0}
              max={totalQuantity} // Maximum allowed quantity
              onChange={(e) => handleChangeMenge(e.target.value, i)} // Handle quantity change
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  // Handle Enter key press here
                  e.preventDefault(); // Prevent form submission
                  e.target.blur(); // Remove focus from the input field
                }
              }}
            />
            <button
              className="button-anzahl-steckbretter"
              type="button"
              onClick={() => incMengeSteckbretter(i)} // Increase quantity button
            >
              +
            </button>
          </th>
        </tr>
      );
    }
    return inputs; // Return the array of input elements
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
        setFertigungsauftrag("");
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
    setFertigungsauftrag("");
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
              rueckgabe,
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
                setTotalQuantity(results[i].Menge); //get quantity from table and show it later in next message box
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
              rueckgabe,
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
                  (results[j].Bemerkung ===
                    "E-Label wurde angeklickt - Wareneingang fertig" ||
                    results[j].Bemerkung ===
                      "E-Label wurde angeklickt - Rückgabe fertig") &&
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
                        rueckgabe,
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

  // useEffect hook to perform side effects
  useEffect(() => {
    // Check if showCheckingSAP is true
    if (showCheckingSAP) {
      // If true, make a fetch request to execute the SAP script
      fetch(`${process.env.REACT_APP_API}/exeFileRunner/runSAPScript`, {
        method: "POST", // HTTP POST request
        headers: {
          "Content-Type": "application/json", // Set request header
        },
      })
        // Process the response from the server
        .then((response) => {
          // Check if the response is okay (HTTP status code 200-299)
          if (response.ok) {
            console.log("SAP Script executed successfully"); // Log success message
          } else {
            console.error("Failed to execute SAP script"); // Log failure message
          }
        })
        // Handle any errors that occur during the fetch request
        .catch((error) => {
          console.error("Error occurred:", error); // Log the error message
        });
    }
  }, [showCheckingSAP]); // Dependency array, useEffect will re-run whenever showCheckingSAP changes

  return (
    <>
      <Header rueckgabe={rueckgabe} />
      <div className="body">
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
                  Aktuelle Buchung:{" "}
                  {rueckgabe ? "2001 - Rückgabe" : "3001 - Wareneingang"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Die Fertigungsauftrag wird in SAP geprüft.
              </Modal.Body>
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
                  Aktuelle Buchung:{" "}
                  {rueckgabe ? "2001 - Rückgabe" : "3001 - Wareneingang"}
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
                      <td className="tabledata">Gesamtmenge</td>
                      <th className="tabledata">{totalQuantity}</th>
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
                          onChange={(e) =>
                            setAnzahlSteckbretter(e.target.value)
                          }
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
                    {anzahlSteckbretter > 0 && renderMengeSteckbretterInputs()}
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
                  Aktuelle Buchung:{" "}
                  {rueckgabe ? "2001 - Rückgabe" : "3001 - Wareneingang"}
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
                  Aktuelle Buchung:{" "}
                  {rueckgabe ? "2001 - Rückgabe" : "3001 - Wareneingang"}
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
                  Aktuelle Buchung:{" "}
                  {rueckgabe ? "2001 - Rückgabe" : "3001 - Wareneingang"}
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
        <div className="bookinglabel">
          <h2>
            Aktuelle Buchung:{" "}
            {rueckgabe ? "2001 - Rückgabe" : "3001 - Wareneingang"}
          </h2>
        </div>
      </div>
    </>
  );
}
