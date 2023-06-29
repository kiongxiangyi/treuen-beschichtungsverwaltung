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
  );
}
