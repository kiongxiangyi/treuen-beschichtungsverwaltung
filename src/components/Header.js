import "../App.css";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate(); //hook for navigation

  const navigateToHome = () => {
    navigate("/");
  };
  return (
    <header className="header">
      <h1 className="site-title mt-2">Gühring Beschichtungsverwaltung</h1>
      <button className="homeButton" onClick={navigateToHome}>
        <img src="./pictures/home-btn.png" alt="home"></img>
      </button>
    </header>
  );
}
