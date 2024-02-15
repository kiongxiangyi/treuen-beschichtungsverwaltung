import React from "react";

export default function EntnahmeFilter({
  fertigungsauftragDB,
  setFilterDB,
  beschichtungsart,
  setBeschichtungsart,
  beschichtungsdicke,
  setBeschichtungsdicke,
  beschichtungsartOptions,
  beschichtungsdickeOptions,
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
          element.Menge > 0 &&
          element.Lagerplatz !== "0" &&
          element.BeschichtungsArt !== "" &&
          element.BeschichtungsDicke !== ""
      );
    } else if (beschichtungsdicke === "") {
      filteredValue = fertigungsauftragDB.filter(
        (element) =>
          element.Menge > 0 &&
          element.Lagerplatz !== "0" &&
          element.BeschichtungsArt !== "" &&
          element.BeschichtungsDicke !== ""
      );
    } else {
      filteredValue = fertigungsauftragDB.filter(
        (element) =>
          element.BeschichtungsArt === beschichtungsart &&
          element.BeschichtungsDicke === beschichtungsdicke &&
          element.Menge > 0 &&
          element.Lagerplatz !== "0"
      );
    }
    setFilterDB(filteredValue);
  };

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
            <option value="">Alle</option>
            {beschichtungsartOptions.map((option, i) => (
              <option value={option} key={i}>
                {option}
              </option>
            ))}
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
            {beschichtungsdickeOptions.map((option, i) => (
              <option value={option} key={i}>
                {option}
              </option>
            ))}
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
