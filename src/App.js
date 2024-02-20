import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/GoodsReceiptHeader";
import Wareneingang from "./components/Wareneingang";
import Rueckgabe from "./components/Rueckgabe";
import Entnahme from "./components/Entnahme";
import GoodsReceiptHomepage from "./components/GoodsReceiptHomepage";
import WithdrawalHomepage from "./components/WithdrawalHomepage";
import { Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

function App() {
  const [fertigungsauftragDB, setFertigungsauftragDB] = useState([]);
  const [articleDB, setArticleDB] = useState([]);

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
    }, 1 * 10000);

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
    }, 1 * 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/Wareneingangseite" element={<GoodsReceiptHomepage />} />
        <Route path="/Entnahmeseite" element={<WithdrawalHomepage />} />
        <Route
          path="/Wareneingang"
          element={
            <Wareneingang
              fertigungsauftragDB={fertigungsauftragDB}
              articleDB={articleDB}
            />
          }
        />
        <Route
          path="/Entnahme"
          element={<Entnahme fertigungsauftragDB={fertigungsauftragDB} />}
        />
        <Route
          path="/Rueckgabe"
          element={
            <Rueckgabe
              fertigungsauftragDB={fertigungsauftragDB}
              articleDB={articleDB}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
