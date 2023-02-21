import React, { useState } from "react";
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

  return (
    <div>
      <EntnahmeFilter
        fertigungsauftragDB={fertigungsauftragDB}
        setFilterDB={setFilterDB}
        beschichtungsart={beschichtungsart}
        beschichtungsdicke={beschichtungsdicke}
        setBeschichtungsart={setBeschichtungsart}
        setBeschichtungsdicke={setBeschichtungsdicke}
      />
      <EntnahmeTable
        filterDB={filterDB}
        setFilterDB={setFilterDB}
        setSubmittedOrders={setSubmittedOrders}
      />

      <EntnahmeButton
        fertigungsauftragDB={fertigungsauftragDB}
        submittedOrders={submittedOrders}
        filterDB={filterDB}
        setWithdrawnOrders={setWithdrawnOrders}
        setShow={setShow}
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
