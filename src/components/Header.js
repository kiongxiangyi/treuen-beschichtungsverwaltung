import "../App.css";
import { Link } from "react-router-dom";


export default function Header() {
  return (
    <div className="header">
      <Link to="/" className="site-title">Gühring Beschichtungsverwaltung</Link>
    </div>
  );
}
