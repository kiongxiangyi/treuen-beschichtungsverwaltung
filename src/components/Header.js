import "../App.css";
import { useNavigate } from "react-router-dom";

export default function Header({ rueckgabe }) {
  const navigate = useNavigate(); //hook for navigation

  const navigateToEntnahme = () => {
    navigate("/Entnahmeseite");
  };

  const navigateToWareneingang = () => {
    navigate("/Wareneingangsseite");
  };

  return (
    <header className="header">
      <h1 className="site-title mt-2">Gühring Beschichtungsverwaltung</h1>
      {rueckgabe ? (
        <button className="homeButton" onClick={navigateToEntnahme}>
          <img src="./pictures/home-btn.png" alt="home"></img>
        </button>
      ) : (
        <button className="homeButton" onClick={navigateToWareneingang}>
          <img src="./pictures/home-btn.png" alt="home"></img>
        </button>
      )}
    </header>
  );
}
