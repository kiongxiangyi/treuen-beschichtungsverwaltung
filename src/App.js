import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Page1 from "./components/Page1";
import Page2 from "./components/Page2";
import { Route, Routes, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

function App() {
  const [fertigungsauftragDB, setFertigungsauftragDB] = useState([]);
  const [articleDB, setArticleDB] = useState([]);

  //get SAP data from SQL DB
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/AuftragArtikel`)
      .then((res) => res.json())
      .then((results) => setFertigungsauftragDB(results)) //fetch artikel from tblAuftragArtikel
      .catch((err) => {
        console.log(err);
        toast.error(
          "There is no connection to database. Please check the database server."
        );
      });
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
    <div>
      <Header />
      <div className="body">
        <Routes>
          <Route
            path="/"
            element={
              <Page1
                fertigungsauftragDB={fertigungsauftragDB}
                articleDB={articleDB}
              />
            }
          />
          <Route
            path="/page2"
            element={<Page2 fertigungsauftragDB={fertigungsauftragDB} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
