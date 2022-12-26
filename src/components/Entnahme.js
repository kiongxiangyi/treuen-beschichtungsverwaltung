import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";

export default function Entnahme({ fertigungsauftragDB }) {
  const [beschichtungsart, setBeschichtungsart] = useState("");
  const [beschichtungsdicke, setBeschichtungsdicke] = useState("");
  const [filter, setFilter] = useState(false);
  const [filterDB, setFilterDB] = useState([]);
  const [checked, setChecked] = useState(false);
  const [checkboxdata, setCheckboxdata] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {
    if (selectAll) {
      console.log(selectAll);
    } else if (selectOrder) {
      console.log(selectOrder);

      fetch(`${process.env.REACT_APP_API}/Auftragsnummer/Entnahme`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          selectOrder,
        }),
      })
        .then((res) => res.json())
        .catch((err) => console.log(err));
    } else {
      // toast.error("Bitte wählen Sie mindestens einen Artikel");
    }
    //return selectAll ?  : console.log(selectAll);
    // return selectOrder ? console.log(selectOrder) : console.log(selectOrder);
  };
  const selectAll = watch("selectAll");
  // console.log("selectAll", selectAll);
  const selectOrder = watch("selectOrder");
  //console.log("selectOrder", selectOrder);

  const handleChangeCheckbox = () => {
    setChecked(!checked);
  };

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
    setFilterDB(
      fertigungsauftragDB
        .filter(
          (element) =>
            //element.Auftragsnummer === location.state.fertigungsauftrag &&
            element.BeschichtungsArt === beschichtungsart &&
            element.BeschichtungsDicke > lower &&
            element.BeschichtungsDicke < upper &&
            element.Menge > 0
        )
        .map((item) => {
          return (
            <tr key={item.ID}>
              <td className="checkbox">
                <input
                  type="checkbox"
                  value={item.Auftragsnummer}
                  {...register("selectOrder", { required: true })}
                ></input>
              </td>
              <td>{item.Auftragsnummer}</td>
              <td>{item.BeschichtungsArt}</td>
              <td>{item.BeschichtungsDicke}</td>
              <td>{item.Menge}</td>
            </tr>
          );
        })
    );
    setFilter(false);
  }
  //filter function
  /* const uniqueArrBeschichtungsart = [
    ...new Set(fertigungsauftragDB.map((data) => data.Zusatztext1)),
  ];
  console.log(uniqueArrBeschichtungsart); */

  return (
    <div>
      <form onSubmit={handleSubmitOrder}>
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
              onChange={handleChangeBeschichtungsart}
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
              onChange={handleChangeBeschichtungsdicke}
            >
              <option value="">--Bitte eine Option auswählen--</option>
              <option>&lt;= 2</option>
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
              <th className="checkbox">
                <input
                  type="checkbox"
                  value="all"
                  {...register("selectAll")}
                ></input>
              </th>
              <th>Fertigungsauftrag</th>
              <th>Beschichtungsart</th>
              <th>Beschichtungsdicke</th>
              <th>Menge</th>
            </tr>
          </thead>
          <tbody className="table-body">{filterDB}</tbody>
        </Table>
      </form>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* errors will return when field validation fails  */}
        {errors.selectOrder && (
          <p>Bitte wählen Sie mindestens einen Artikel!</p>
        )}
        <button className="page2-btn" type="submit">
          Weiter
        </button>
      </form>

      <ToastContainer />
    </div>
  );
}
