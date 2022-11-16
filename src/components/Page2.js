import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { ToastContainer, toast } from "react-toastify";
import { useLocation } from "react-router-dom";

export default function Page2({ fertigungsauftragDB }) {
  const [beschichtungsart, setBeschichtungsart] = useState("");
  const [beschichtungsdicke, setBeschichtungsdicke] = useState("");
  const location = useLocation();
  //console.log(fertigungsauftrag);

  //tutorial: https://www.simplilearn.com/tutorials/reactjs-tutorial/how-to-create-functional-react-dropdown-menu
  //select beschichtungsart
  const handleChange = (event) => {
    setBeschichtungsart(event.target.value);
  };

  //select beschichtungsdicke
  const handleChange2 = (event) => {
    setBeschichtungsdicke(event.target.value);
  };

  //Aufträge anzeigen button submit
  const handleSubmit = (event) => {
    event.preventDefault();
    
  };

  //filter function
  /* const uniqueArrBeschichtungsart = [
    ...new Set(fertigungsauftragDB.map((data) => data.Zusatztext1)),
  ];
  console.log(uniqueArrBeschichtungsart); */

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="beschichtung">
          <label htmlFor="beschichtungsart-select">
            Beschichtungsart wählen:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </label>
          <div>
            <select
              className="beschichtung-select"
              name="beschichtungsart"
              id="beschichtungsart-select"
              value={beschichtungsart}
              onChange={handleChange}
            >
              <option value="">--Bitte eine Option auswählen--</option>
              <option value="Fire">Fire</option>
              <option value="Gold">Gold</option>
              <option value="Silber">Silber</option>
              <option value="TiN">TiN</option>
            </select>
          </div>
        </div>
        <div className="beschichtung">
          <label htmlFor="beschichtungsdicke-select">
            Beschichtungsdicke wählen:&nbsp;
          </label>
          <div>
            <select
              className="beschichtung-select"
              name="beschichtungsdicke"
              id="beschichtungsdicke-select"
              value={beschichtungsdicke}
              onChange={handleChange2}
            >
              <option value="">--Bitte eine Option auswählen--</option>
              <option>&lt; 2</option>
              <option>2 - 6</option>
              <option>&gt; 6</option>
            </select>
          </div>
        </div>
        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;&nbsp;
        <button className="page2-btn" type="submit">
          Aufträge anzeigen
        </button>
        <p>Warenkorb:</p>
        <Table bordered hover>
          <thead>
            <tr className="table-header">
              <th>Fertigungsauftrag</th>
              <th>Beschichtungsart</th>
              <th>Beschichtungsdicke</th>
              <th>Menge</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {fertigungsauftragDB
              .filter(
                (element) =>
                  element.Auftragsnummer === location.state.fertigungsauftrag &&
                  element.Zusatztext1 === beschichtungsart
              )
              .map((item) => {
                return (
                  <tr key={item.ID}>
                    <td>{item.Auftragsnummer}</td>
                    <td>{item.Zusatztext1}</td>
                    <td>{item.Zusatztext2}</td>
                    <td>{item.Menge}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </form>
      <ToastContainer />
    </div>
  );
}
