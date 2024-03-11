import "../App.css";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

export default function WithdrawalHomepage() {
  const navigate = useNavigate(); //hook for navigation

  const handleSubmitEntnahme = (e) => {
    e.preventDefault();
    navigate("/Entnahme");
  };

  const handleSubmitRückgabe = (e) => {
    e.preventDefault();
    navigate("/Rueckgabe");
  };

  return (
    <div>
      <Header onHomeClick={() => navigate("/Entnahmeseite")} />

      <div className="homepage">
        <button className="bookingButton" onClick={handleSubmitEntnahme}>
          Entnahme
        </button>
      </div>

      <div className="homepage">
        <button className="bookingButton" onClick={handleSubmitRückgabe}>
          Rückgabe
        </button>
      </div>
    </div>
  );
}
