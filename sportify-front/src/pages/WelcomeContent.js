import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomeContent() {
  const navigate = useNavigate();

  const login = () => {
    navigate('/login');
  };
  return (
    <div className="row justify-content-md-center" style={{ 
      background: "linear-gradient(to bottom, #d2d2d2, #f2f2f2)",
  }}>
      <div className="jumbotron jumbotron-fluid text-center">
        <div className="container">
          <h1 className="display-4" style={{ fontFamily: "Lucida Handwriting", fontSize: "80px", marginTop: "180px" }}>Sportify</h1>
          <p className="lead">Znajdź partnerów do gry, dołącz do lokalnych meczów i rozwijaj swoje umiejętności sportowe z innymi entuzjastami.</p>
          <p>Zarejestruj się teraz, aby odkryć nowych przyjaciół i aktywnie spędzać czas!</p>
          <button className="btn btn-outline-dark btn-lg mt-4" onClick={login}>Rozpocznij</button>
        </div>
      </div>
    </div>
  );
}