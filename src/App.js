import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Page1 from "./components/Page1";
import Page2 from "./components/Page2";
import { Route, Routes, Navigate } from "react-router-dom";

function App() {
  return (
    <div>
      <Header />
      <div className="body">
        <Routes>
          <Route path="/" element={<Page1 />} />
          <Route path="/page2" element={<Page2 />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
