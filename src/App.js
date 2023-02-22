import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Wareneingang from "./components/Wareneingang";
import Entnahme from "./components/Entnahme";
import Homepage from "./components/Homepage";
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
          //Entnahme fertig
          if (
            results[i].Auslagerung === false &&
            results[i].Einlagerung === false &&
            results[i].Menge === 0
          ) {
            fetch(`${process.env.REACT_APP_API}/LagerPlatz/releaseStorageBin`, {
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
    fetchOrders();

    //fetch Artikel every X second
    interval = setInterval(() => {
      fetchOrders();
    }, 2 * 1000);

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
    }, 2 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="background">
      <Header />
      <div className="body">
        <Routes>
          <Route path="/" element={<Homepage />} />
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
        </Routes>
      </div>
    </div>
  );
}

export default App;
