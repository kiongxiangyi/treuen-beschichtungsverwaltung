import "../App.css";
import { useNavigate } from "react-router-dom";
//import Button from "react-bootstrap/Button";

export default function Homepage() {
  const navigate = useNavigate(); //hook for navigation

  const handleSubmitWareneingang = (e) => {
    e.preventDefault();
    navigate("/Wareneingang");
  };

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
      <div className="homepage">
        <button className="bookingButton" onClick={handleSubmitWareneingang}>
          Wareneingang
        </button>
      </div>
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
