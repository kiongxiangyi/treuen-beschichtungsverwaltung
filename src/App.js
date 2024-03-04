import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import WareneingangRueckgabe from "./components/WareneingangRueckgabe";
import Entnahme from "./components/Entnahme";
import Homepage from "./components/Homepage";
import { Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

function App() {
  const [fertigungsauftragDB, setFertigungsauftragDB] = useState([]);
  const [articleDB, setArticleDB] = useState([]);
 //const [arrCurrentQuantity, setArrCurrentQuantity] = useState([]);

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
        //setArrCurrentQuantity(results); //save the currentQuantity to used for the calculation of current qty minus withdrawal shown in frontend in EntnhameModal.js

        for (let i = 0; i < results.length; i++) {
          let fertigungsauftrag = results[i].Auftragsnummer;
          let storageBin = results[i].Lagerplatz;
          //Entnahme fertig oder keine FA vorhanden
          if (
            (results[i].Auslagerung === false &&
              results[i].Einlagerung === false &&
              //results[i].Menge === 0 &&
              results[i].Bemerkung === "löschen") ||
            results[i].Bemerkung === "kein FA vorhanden - es wird gelöscht" ||
            results[i].Bemerkung === "Wareneingang wurde nicht durchgeführt"
          ) {
            fetch(`${process.env.REACT_APP_API}/LagerPlatz/releaseStorageBin`, {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                fertigungsauftrag,
                storageBin,
              }),
            })
              .then((res) => res.json())
              .catch((err) => console.log(err));

            fetch(`${process.env.REACT_APP_API}/Artikel`, {
              method: "DELETE",
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
              method: "DELETE",
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
              method: "DELETE",
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

            //reset tblEShelf
            fetch(`${process.env.REACT_APP_API}/Auftragsnummer`, {
              method: "DELETE",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                fertigungsauftrag,
                storageBin,
              }),
            })
              .then((res) => res.json())
              .catch((err) => console.log(err));
          }
        }
      } catch (err) {
        console.log(err);
        toast.error(
          "There is no connection to database. Please check the database server."
        );
      }
    };
    //fetchOrders();

    //fetch Artikel every X second
    interval = setInterval(() => {
      fetchOrders();
    }, 1 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  //get Artikel data from DB
  useEffect(() => {
    let interval; // interval tutorial - https://www.codingdeft.com/posts/react-useeffect-hook/
    const fetchArtikel = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API}/Artikel`);
        const results = await response.json();
        setArticleDB(results); //fetch artikel from tblArtikel
      } catch (err) {
        console.log(err);
        toast.error(
          "There is no connection to database. Please check the database server."
        );
      }
    };
    fetchArtikel();

    //fetch Artikel every X second
    interval = setInterval(() => {
      fetchArtikel();
    }, 1 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <Routes>
        <Route
          path="/Wareneingangsseite"
          element={<Homepage rueckgabe={false} />}
        />
        <Route path="/Entnahmeseite" element={<Homepage rueckgabe={true} />} />
        <Route
          path="/Wareneingang"
          element={
            <WareneingangRueckgabe articleDB={articleDB} rueckgabe={false} />
          }
        />
        <Route
          path="/Entnahme"
          element={
            <Entnahme
              fertigungsauftragDB={fertigungsauftragDB}
              //arrCurrentQuantity={arrCurrentQuantity}
            />
          }
        />
        <Route
          path="/Rueckgabe"
          element={
            <WareneingangRueckgabe articleDB={articleDB} rueckgabe={true} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
