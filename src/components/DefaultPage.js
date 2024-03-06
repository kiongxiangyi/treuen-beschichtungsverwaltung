import "../App.css";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

export default function Defaultpage() {
  const navigate = useNavigate(); //hook for navigation

  const handleSubmitWareneingang = (e) => {
    e.preventDefault();
    navigate("/Wareneingang");
  };

  const handleSubmitEntnahme = (e) => {
    e.preventDefault();
    navigate("/Entnahme");
  };

  return (
    <div>
      <div className="homepage">
        <button className="bookingButton" onClick={handleSubmitWareneingang}>
          Wareneingangs seite
        </button>
      </div>

      <div className="homepage">
        <button className="bookingButton" onClick={handleSubmitEntnahme}>
          Entnahmeseite
        </button>
      </div>
    </div>
  );
}
