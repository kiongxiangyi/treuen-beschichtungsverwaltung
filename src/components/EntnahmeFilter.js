import React, { useState } from "react";

export default function EntnahmeFilter({
  fertigungsauftragDB,
  setFilterDB,
  beschichtungsart,
  setBeschichtungsart,
  beschichtungsdicke,
  setBeschichtungsdicke,
}) {
  //tutorial: https://www.simplilearn.com/tutorials/reactjs-tutorial/how-to-create-functional-react-dropdown-menu
  //select beschichtungsart
  const handleChangeBeschichtungsart = (event) => {
    setBeschichtungsart(event.target.value);
  };

  //select beschichtungsdicke
  const handleChangeBeschichtungsdicke = (event) => {
    setBeschichtungsdicke(event.target.value);
  };

  //Aufträge anzeigen button submit
  const handleSubmitOrder = (event) => {
    event.preventDefault();

    let filteredValue = [];
    if (beschichtungsart === "") {
      filteredValue = fertigungsauftragDB.filter(
        (element) =>
          //element.Auftragsnummer === location.state.fertigungsauftrag && element.Auslagerung === false
          /* element.BeschichtungsDicke > lower &&
          element.BeschichtungsDicke < upper && */
          element.Menge > 0
      );
    } else if (beschichtungsdicke === "") {
      filteredValue = fertigungsauftragDB.filter(
        (element) =>
          // element.BeschichtungsArt === beschichtungsart && element.Menge > 0
          element.Menge > 0
      );
    } else {
      filteredValue = fertigungsauftragDB.filter(
        (element) =>
          element.BeschichtungsArt === beschichtungsart &&
          element.BeschichtungsDicke > lower &&
          element.BeschichtungsDicke < upper &&
          element.Menge > 0
          
      );
    }
    setFilterDB(filteredValue);
  };

  let lower = "";
  let upper = "";
  if (beschichtungsdicke === "<= 2,0") {
    lower = 0;
    upper = 3;
  } else if (beschichtungsdicke === "2,0 - 6") {
    lower = 1;
    upper = 7;
  } else if (beschichtungsdicke === "> 6") {
    lower = 6;
    upper = 100;
  }

  return (
    <div>
      <div className="beschichtung">
        <label htmlFor="beschichtungsart-select">
          <b>Beschichtungsart</b>
        </label>
        <div>
          <select
            className="beschichtung-select"
            name="beschichtungsart"
            id="beschichtungsart-select"
            value={beschichtungsart}
            onChange={handleChangeBeschichtungsart}
          >
            <option value="">
              {" "}
              {/* disable hidden */}
              Alle
            </option>
            <option value="Tin">Tin</option>
            <option value="A-TiAlN">A-TiAlN</option>
            <option value="Super A">Super A</option>
            <option value="Fire">Fire</option>
            <option value="nano Fire">nano Fire</option>
            <option value="nano A">nano A</option>
            <option value="Signum">Signum</option>
            <option value="Zenit">Zenit</option>
            <option value="Raptor">Raptor</option>
            <option value="Sirius">Sirius</option>
            <option value="Congressor">Congressor</option>
            <option value="Endurum ">Endurum </option>
            <option value="Ferrox ">Ferrox </option>
            <option value="Perrox ">Perrox </option>
            <option value="Perrox ">Perrox </option>
          </select>
        </div>
      </div>
      <div className="beschichtung">
        <label htmlFor="beschichtungsdicke-select">
          <b>Beschichtungsdicke</b>
        </label>
        <div>
          <select
            className="beschichtung-select2"
            name="beschichtungsdicke"
            id="beschichtungsdicke-select"
            value={beschichtungsdicke}
            onChange={handleChangeBeschichtungsdicke}
          >
            <option value="">Alle</option>
            <option value="<= 2,0">&lt;= 2,0</option>
            <option value="2,0 - 6">2,0 - 6</option>
            <option value="> 6">&gt; 6</option>
          </select>
        </div>
      </div>
      <button
        variant="outline-secondary"
        className="pushable"
        onClick={handleSubmitOrder}
      >
        <span className="front">Aufträge anzeigen</span>
      </button>
    </div>
  );
}
