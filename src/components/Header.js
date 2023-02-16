import "../App.css";
import Button from "react-bootstrap/Button";

import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate(); //hook for navigation

  const handleClick = () => {
    navigate("/");
  };
  return (
    <div className="header">
      <h1 className="site-title mt-2">Gühring Beschichtungsverwaltung</h1>

      <img src="./pictures/home-btn.png" alt="home" onClick={handleClick}></img>
    </div>
  );
}
