import "../App.css";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

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
        <Button className="btn btn-primary-outline" size="lg" type="submit">
          Wareneingang
        </Button>
      </form>
      <form onSubmit={handleSubmitEntnahme}>
        <Button
          className="btn btn-primary-outline mt-1"
          size="lg"
          type="submit"
        >
          Entnahme
        </Button>
      </form>
    </div>
  );
}
