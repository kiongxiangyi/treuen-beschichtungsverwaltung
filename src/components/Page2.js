import React from "react";
import Table from "react-bootstrap/Table";

export default function Page2() {
  return (
    <div>
      <div className="beschichtung">
        <label htmlFor="beschichtungsart-select">
          Beschichtungsart wählen:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </label>
        <div>
          <select
            className="beschichtung-select"
            name="beschichtungsart"
            id="beschichtungsart-select"
          >
            <option value="">--Bitte eine Option auswählen--</option>
            <option value="fire">fire</option>
            <option value="gold">gold</option>
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
          >
            <option value="">--Bitte eine Option auswählen--</option>
            <option> weniger als 2</option>
            <option>2 - 6</option>
          </select>
        </div>
      </div>
      &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;&nbsp;
      <button className="page2-btn" type="button">
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
          <tr>
            <td>1</td>
            <td>fire</td>
            <td>2 - 6</td>
            <td>1</td>
          </tr>
          <tr>
            <td>2</td>
            <td>fire</td>
            <td>2 - 6</td>
            <td>1</td>
          </tr>
          <tr>
            <td>3</td>
            <td>fire</td>
            <td>2 - 6</td>
            <td>1</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
