import "../App.css";
import { useNavigate } from "react-router-dom";

export default function Header({ onHomeClick }) {
  const navigate = useNavigate(); //hook for navigation

  if (onHomeClick === "rueckgabe") {
    navigate("/Entnahmeseite");
  }

  return (
    <header className="header">
      <h1 className="site-title mt-2">Gühring Beschichtungsverwaltung</h1>
      <button className="homeButton" onClick={onHomeClick}>
        <img src="./pictures/home-btn.png" alt="home"></img>
      </button>

      {/*  {rueckgabe ? (
        <button className="homeButton" onClick={navigateToEntnahme}>
          <img src="./pictures/home-btn.png" alt="home"></img>
        </button>
      ) : (
        <button className="homeButton" onClick={navigateToWareneingang}>
          <img src="./pictures/home-btn.png" alt="home"></img>
        </button>
      )} */}
    </header>
  );
}
