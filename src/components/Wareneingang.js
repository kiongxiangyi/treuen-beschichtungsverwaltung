import React, { useState, useEffect } from "react";
import "../App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function Wareninggang({ fertigungsauftragDB, articleDB }) {
  const [fertigungsauftrag, setFertigungsauftrag] = useState("");
  const [freeStorageBins, setFreeStorageBins] = useState("");
  const [occupiedStorageBins, setOccupiedStorageBins] = useState("");

  const navigate = useNavigate(); //hook for navigation

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

    if (!fertigungsauftrag)
      //if the scan filed is empty
      return toast.error("Bitte Fertigungsauftrag scannen!");

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
        .catch((err) => console.log(err));
    }

    return toast.info(
      `Fertigungsauftrag ${fertigungsauftrag} wurde in GTMS angelegt.`
    );
  };

  return (
    <div>
      <div className="scan-field">
        <p>Bitte Fertigungsauftrag scannen:</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="fertigungsauftrag"
            name="fertigungsauftrag"
            size="35"
            value={fertigungsauftrag}
            onChange={(e) => setFertigungsauftrag(e.target.value)}
          />
        </form>
        <ToastContainer />
      </div>
      <div className="storage-bin">
        <p>Freie Lagerplätze: {freeStorageBins}</p>
        <p>Belegte Lagerplätze: {occupiedStorageBins}</p>
      </div>
    </div>
  );
}
