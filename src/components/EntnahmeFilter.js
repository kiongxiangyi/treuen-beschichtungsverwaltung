import React, { useState } from "react";

export default function EntnahmeFilter({
  fertigungsauftragDB,
  setFilterDB,
  beschichtungsart,
  setBeschichtungsart,
  beschichtungsdicke,
  setBeschichtungsdicke,
}) {
  const [filter, setFilter] = useState(false);

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
    setFilter(true);
  };

  let lower = "";
  let upper = "";
  if (beschichtungsdicke === "<= 2") {
    lower = 0;
    upper = 3;
  } else if (beschichtungsdicke === "2 - 6") {
    lower = 1;
    upper = 7;
  } else if (beschichtungsdicke === "> 6") {
    lower = 6;
    upper = 100;
  }

  if (filter) {
    if (beschichtungsart === "") {
      setFilterDB(
        fertigungsauftragDB.filter(
          (element) =>
            //element.Auftragsnummer === location.state.fertigungsauftrag && element.Auslagerung === false
            element.BeschichtungsDicke > lower &&
            element.BeschichtungsDicke < upper &&
            element.Menge > 0
        )
      );
    } else if (beschichtungsdicke === "") {
      setFilterDB(
        fertigungsauftragDB.filter(
          (element) =>
            element.BeschichtungsArt === beschichtungsart && element.Menge > 0
        )
      );
    } else {
      setFilterDB(
        fertigungsauftragDB.filter(
          (element) =>
            element.BeschichtungsArt === beschichtungsart &&
            element.BeschichtungsDicke > lower &&
            element.BeschichtungsDicke < upper &&
            element.Menge > 0
        )
      );
    }
    setFilter(false);
  }

  return (
    <div>
      <div className="beschichtung">
        <label htmlFor="beschichtungsart-select">
          <b>Beschichtungsart</b>&ensp;&ensp;&ensp;&ensp;&ensp;
        </label>
        <div>
          <select
            className="beschichtung-select"
            name="beschichtungsart"
            id="beschichtungsart-select"
            value={beschichtungsart}
            onChange={handleChangeBeschichtungsart}
          >
            <option value="" disabled hidden>
              --Bitte eine Option auswählen--
            </option>
            <option value="Fire">Fire</option>
            <option value="Gold">Gold</option>
            <option value="Silber">Silber</option>
            <option value="TiN">TiN</option>
          </select>
        </div>
      </div>
      <div className="beschichtung">
        <label htmlFor="beschichtungsdicke-select">
          <b>Beschichtungsdicke</b>&ensp;&ensp;&nbsp;
        </label>
        <div>
          <select
            className="beschichtung-select2"
            name="beschichtungsdicke"
            id="beschichtungsdicke-select"
            value={beschichtungsdicke}
            onChange={handleChangeBeschichtungsdicke}
          >
            <option value="" disabled hidden>
              --Bitte eine Option auswählen--
            </option>
            <option>&lt;= 2</option>
            <option>2 - 6</option>
            <option>&gt; 6</option>
          </select>
        </div>
      </div>
      &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;
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
