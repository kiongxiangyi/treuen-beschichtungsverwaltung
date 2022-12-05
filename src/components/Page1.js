import React, { useState, useEffect } from "react";
import "../App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function Page1({ fertigungsauftragDB }) {
  const [fertigungsauftrag, setFertigungsauftrag] = useState("");
  const [freeStorageBin, setFreeStorageBin] = useState("");
  const [occupiedStorageBin, setOccupiedStorageBin] = useState("");

  const navigate = useNavigate(); //hook for navigation

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!fertigungsauftrag)
      //if the scan filed is empty
      return toast.error("Bitte Fertigungsauftrag scannen!");

    //find auftragsnummer in DB
    const findAuftrag = fertigungsauftragDB.find(
      (tblAuftragArtikel) =>
        tblAuftragArtikel.Auftragsnummer === fertigungsauftrag
    );

    //if not found, error. If found, navigate to second page
    if (!findAuftrag) {
      return toast.error("Die Fertigungsauftragsnummer ist nicht vorhanden");
    } else {
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

      fetch(`${process.env.REACT_APP_API}/LagerPlatz/`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          Artikel: fertigungsauftrag,
        }),
      })
        .then((res) => res.json())
        .catch((err) => console.log(err));

      //navigate to second page and pass the data https://www.folkstalk.com/2022/09/can-i-pass-data-with-usenavigate-react-router-with-code-examples-2.html
      navigate("/page2", { state: { fertigungsauftrag: fertigungsauftrag } });
    }
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
        <p>Freie Lagerplätze:</p>
        <p>Belegte Lagerplätze:</p>
      </div>
    </div>
  );
}
