import React, { useState, useEffect } from "react";
import "../App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function Page1() {
  const [fertigungsauftrag, setFertigungsauftrag] = useState("");
  const [fertigungsauftragDB, setFertigungsauftragDB] = useState("");

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
      navigate("/page2");
    }
  };

  //get data from DB
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/AuftragArtikel`)
      .then((res) => res.json())
      .then((results) => setFertigungsauftragDB(results)) //fetch artikel from tblAuftragArtikel
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <div className="scan-field">
        <p>Bitte Fertigungsauftrag scannen:</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="fertigungsauftrag"
            name="fertigungsauftrag"
            size="25"
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
