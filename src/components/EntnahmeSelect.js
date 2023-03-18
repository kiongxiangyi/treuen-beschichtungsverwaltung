import React, { useState } from "react";

export default function EntnahmeSelect({
  beschichtungsart,
  handleChangeBeschichtungsart,
}) {
  return (
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
  );
}
