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

  return (
    <div>
      <div className="homepage">
        <form onSubmit={handleSubmitWareneingang}>
          <button className="bookingButton">Wareneingang</button>
        </form>
      </div>
      <div className="homepage">
        <form onSubmit={handleSubmitEntnahme}>
          <button className="bookingButton">Entnahme</button>
        </form>
      </div>
    </div>
  );
}
