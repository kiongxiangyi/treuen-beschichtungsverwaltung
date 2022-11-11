import React, { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

export default function Page1() {
  const [fertigungsauftrag, setFertigungsauftrag] = useState("");

  const navigate = useNavigate(); //hook for navigation

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/page2");
  };

  return (
    <div>
      <div className="scan-field">
        <p>Bitte Fertigungsauftrag scannen:</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="fertigungsauftrag"
            name="fertigungsauftrag"
            size="25"
            value={fertigungsauftrag}
            onChange={(e) => setFertigungsauftrag(e.target.value)}
          />
        </form>
      </div>
      <div className="storage-bin">
        <p>Freie Lagerplätze:</p>
        <p>Belegte Lagerplätze:</p>
      </div>
    </div>
  );
}
