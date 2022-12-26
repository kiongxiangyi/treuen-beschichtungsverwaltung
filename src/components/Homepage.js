import "../App.css";
import { useNavigate } from "react-router-dom";

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
    <div className="homepage">
      <form onSubmit={handleSubmitWareneingang}>
        <button type="submit">Wareneingang</button>
      </form>
      <form onSubmit={handleSubmitEntnahme}>
        <button type="submit">Entnahme</button>
      </form>
    </div>
  );
}
