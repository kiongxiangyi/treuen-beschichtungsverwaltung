import React, { useState, useEffect } from "react";
import EntnahmeFilter from "./EntnahmeFilter";
import EntnahmeTable from "./EntnahmeTable";
import EntnahmeButton from "./EntnahmeButton";
import EntnahmeModal from "./EntnahmeModal";

export default function Entnahme({ fertigungsauftragDB }) {
  const [beschichtungsart, setBeschichtungsart] = useState("");
  const [beschichtungsdicke, setBeschichtungsdicke] = useState("");
  const [filterDB, setFilterDB] = useState([]);
  const [submittedOrders, setSubmittedOrders] = useState([]);
  const [withdrawnOrders, setWithdrawnOrders] = useState([]);
  const [show, setShow] = useState(false); //bootstrap modal prompt message
  const [beschichtungsartOptions, setBeschichtungsartOptions] = useState([]);
  const [beschichtungsdickeOptions, setBeschichtungsdickeOptions] = useState(
    []
  );
  const [arrCurrentQuantity, setArrCurrentQuantity] = useState([]);

  const fetchBeschichtungKriterienFromTblEShelfBeschichtung = () => {
    fetch(`${process.env.REACT_APP_API}/Auftragsnummer`)
      .then((res) => res.json())
      .then((data) => {
        setBeschichtungsartOptions(
          //remove duplicate of data
          data.reduce(function (acc, curr) {
            if (!acc.includes(curr.BeschichtungsArt))
              acc.push(curr.BeschichtungsArt);
            return acc;
          }, [])
        );

        setArrCurrentQuantity(fertigungsauftragDB); //save the currentQuantity to used for the calculation of current qty minus withdrawal shown in frontend in EntnhameModal.js
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchBeschichtungKriterienFromTblEShelfBeschichtung();
    if (beschichtungsart) {
      fetch(
        `${process.env.REACT_APP_API}/BeschichtungKriterien/Beschichtungsdicke?Beschichtungsart=${beschichtungsart}`
      )
        .then((res) => res.json())
        .then((data) => {
          setBeschichtungsdickeOptions(
            //remove duplicate of data
            data.reduce(function (acc, curr) {
              if (!acc.includes(curr.Beschichtungsdicke))
                acc.push(curr.Beschichtungsdicke);
              return acc;
            }, [])
          );
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [beschichtungsart]);

  //state for a copy of filtered orders to save the temporary maximum Quantity
  const [maximumValueDB, setMaximumValueDB] = useState([]);

  return (
    <div>
      <EntnahmeFilter
        fertigungsauftragDB={fertigungsauftragDB}
        setFilterDB={setFilterDB}
        beschichtungsart={beschichtungsart}
        beschichtungsdicke={beschichtungsdicke}
        setBeschichtungsart={setBeschichtungsart}
        setBeschichtungsdicke={setBeschichtungsdicke}
        beschichtungsartOptions={beschichtungsartOptions}
        beschichtungsdickeOptions={beschichtungsdickeOptions}
        setMaximumValueDB={setMaximumValueDB}
      />
      <EntnahmeTable
        filterDB={filterDB}
        setFilterDB={setFilterDB}
        setSubmittedOrders={setSubmittedOrders}
        maximumValueDB={maximumValueDB}
      />

      <EntnahmeButton
        fertigungsauftragDB={fertigungsauftragDB}
        submittedOrders={submittedOrders}
        filterDB={filterDB}
        setWithdrawnOrders={setWithdrawnOrders}
        setShow={setShow}
        arrCurrentQuantity={arrCurrentQuantity}
      />

      <EntnahmeModal
        setBeschichtungsart={setBeschichtungsart}
        setBeschichtungsdicke={setBeschichtungsdicke}
        setFilterDB={setFilterDB}
        setSubmittedOrders={setSubmittedOrders}
        setShow={setShow}
        show={show}
        withdrawnOrders={withdrawnOrders}
        setWithdrawnOrders={setWithdrawnOrders}
      />
    </div>
  );
}
