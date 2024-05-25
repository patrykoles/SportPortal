import React, { useState } from "react";
import volleyImage from "../img/volleyball-solid.svg";
import basketballImage from "../img/basketball-solid.svg";
import footballImage from "../img/futbol-solid.svg";
import hockeyImage from "../img/hockey-stick-icon.svg";
import runningImage from "../img/person-running-solid.svg";
import tennisImage from "../img/tennis-racket-icon.svg";
import allImage from "../img/all.png";
import swimmingImage from "../img/swimming.svg";
import golfImage from "../img/golf.svg";
import bilardImage from "../img/bilard.svg";
import dartsImage from "../img/darts.svg";
import tabletennisImage from "../img/tabletennis.svg";
import danceImage from "../img/dance.svg";
import rugbyImage from "../img/rugby.svg";

export default function Filters({ onUpdateFilters }) {
  const [sport, setSport] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSportClick = (selectedSport) => {
    setSport(selectedSport);
    onUpdateFilters({
      sport: selectedSport,
      startDate,
      endDate,
      startTime,
      endTime,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateFilters({
      sport,
      startDate,
      endDate,
      startTime,
      endTime,
    });
  };

  const handleClearFilters = () => {
    setSport(""); // Resetowanie filtra sportu
    setStartDate(""); // Czyszczenie daty początkowej
    setEndDate(""); // Czyszczenie daty końcowej
    setStartTime(""); // Czyszczenie czasu początkowego
    setEndTime(""); // Czyszczenie czasu końcowego

    // Aktualizacja filtrów po wyczyszczeniu
    onUpdateFilters({
      sport: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 shadow">
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <div
            style={{
              padding: "5px 10px",
              margin: "5px",
              background: sport === "" ? "lightblue" : "transparent",
              cursor: "pointer",
            }}
            onClick={() => handleSportClick("")}
          >
            <img
              src={allImage}
              alt="Wszystkie"
              style={{ width: "60px", height: "60px" }}
            />
            <p>Wszystkie</p>
          </div>
          <div
            style={{
              padding: "5px 10px",
              margin: "5px",
              background: sport === "football" ? "lightblue" : "transparent",
              cursor: "pointer",
            }}
            onClick={() => handleSportClick("football")}
          >
            <img
              src={footballImage}
              alt="Piłka nożna"
              style={{ width: "60px", height: "60px" }}
            />
            <p>Piłka Nożna</p>
          </div>
          <div
            style={{
              padding: "5px 10px",
              margin: "5px",
              background: sport === "basketball" ? "lightblue" : "transparent",
              cursor: "pointer",
            }}
            onClick={() => handleSportClick("basketball")}
          >
            <img
              src={basketballImage}
              alt="Koszykówka"
              style={{ width: "60px", height: "60px" }}
            />
            <p>Koszykówka</p>
          </div>
          <div
            style={{
              padding: "5px 10px",
              margin: "5px",
              background: sport === "volleyball" ? "lightblue" : "transparent",
              cursor: "pointer",
            }}
            onClick={() => handleSportClick("volleyball")}
          >
            <img
              src={volleyImage}
              alt="Siatkówka"
              style={{ width: "60px", height: "60px" }}
            />
            <p>Siatkówka</p>
          </div>
          <div
            style={{
              padding: "5px 10px",
              margin: "5px",
              background: sport === "tennis" ? "lightblue" : "transparent",
              cursor: "pointer",
            }}
            onClick={() => handleSportClick("tennis")}
          >
            <img
              src={tennisImage}
              alt="Tenis"
              style={{ width: "60px", height: "60px" }}
            />
            <p>Tenis</p>
          </div>
          <div
            style={{
              padding: "5px 10px",
              margin: "5px",
              background: sport === "running" ? "lightblue" : "transparent",
              cursor: "pointer",
            }}
            onClick={() => handleSportClick("running")}
          >
            <img
              src={runningImage}
              alt="Bieganie"
              style={{ width: "60px", height: "60px" }}
            />
            <p>Bieganie</p>
          </div>
          <div
            style={{
              padding: "5px 10px",
              margin: "5px",
              background: sport === "hockey" ? "lightblue" : "transparent",
              cursor: "pointer",
            }}
            onClick={() => handleSportClick("hockey")}
          >
            <img
              src={hockeyImage}
              alt="Hokej"
              style={{ width: "60px", height: "60px" }}
            />
            <p>Hokej</p>
          </div>
          <div
            style={{
              padding: "5px 10px",
              margin: "5px",
              background: sport === "swimming" ? "lightblue" : "transparent",
              cursor: "pointer",
            }}
            onClick={() => handleSportClick("swimming")}
          >
            <img
              src={swimmingImage}
              alt="Pływanie"
              style={{ width: "60px", height: "60px" }}
            />
            <p>Pływanie</p>
          </div>
          <div
            style={{
              padding: "5px 10px",
              margin: "5px",
              background: sport === "golf" ? "lightblue" : "transparent",
              cursor: "pointer",
            }}
            onClick={() => handleSportClick("golf")}
          >
            <img
              src={golfImage}
              alt="Golf"
              style={{ width: "60px", height: "60px" }}
            />
            <p>Golf</p>
          </div>
          <div
            style={{
              padding: "5px 10px",
              margin: "5px",
              background: sport === "bilard" ? "lightblue" : "transparent",
              cursor: "pointer",
            }}
            onClick={() => handleSportClick("bilard")}
          >
            <img
              src={bilardImage}
              alt="Bilard"
              style={{ width: "60px", height: "60px" }}
            />
            <p>Bilard</p>
          </div>
          <div
            style={{
              padding: "5px 10px",
              margin: "5px",
              background: sport === "darts" ? "lightblue" : "transparent",
              cursor: "pointer",
            }}
            onClick={() => handleSportClick("darts")}
          >
            <img
              src={dartsImage}
              alt="Darty"
              style={{ width: "60px", height: "60px" }}
            />
            <p>Darty</p>
          </div>
          <div
            style={{
              padding: "5px 10px",
              margin: "5px",
              background: sport === "tabletennis" ? "lightblue" : "transparent",
              cursor: "pointer",
            }}
            onClick={() => handleSportClick("tabletennis")}
          >
            <img
              src={tabletennisImage}
              alt="Tenis stołowy"
              style={{ width: "60px", height: "60px" }}
            />
            <p>Tenis stołowy</p>
          </div>
          <div
            style={{
              padding: "5px 10px",
              margin: "5px",
              background: sport === "dance" ? "lightblue" : "transparent",
              cursor: "pointer",
            }}
            onClick={() => handleSportClick("dance")}
          >
            <img
              src={danceImage}
              alt="Taniec"
              style={{ width: "60px", height: "60px" }}
            />
            <p>Taniec</p>
          </div>
          <div
            style={{
              padding: "5px 10px",
              margin: "5px",
              background: sport === "rugby" ? "lightblue" : "transparent",
              cursor: "pointer",
            }}
            onClick={() => handleSportClick("rugby")}
          >
            <img
              src={rugbyImage}
              alt="Rugby"
              style={{ width: "60px", height: "60px" }}
            />
            <p>Rugby</p>
          </div>
        </div>
      </div>

      {/* Pokazywanie/ukrywanie filtrów daty i czasu */}
      <button
        type="button"
        onClick={() => setShowFilters(!showFilters)}
        style={{
          backgroundColor: showFilters ? "#000" : "#f2f2f2",
          color: showFilters ? "#fff" : "#000",
          cursor: "pointer",
          marginTop: "10px",
        }}
        onMouseEnter={(e) => {
          if (!showFilters) {
            e.target.style.backgroundColor = "#000";
            e.target.style.color = "#fff";
          } else {
            e.target.style.backgroundColor = "#f2f2f2";
            e.target.style.color = "#000";
          }
        }}
        onMouseLeave={(e) => {
          if (!showFilters) {
            e.target.style.backgroundColor = "#f2f2f2";
            e.target.style.color = "#000";
          } else {
            e.target.style.backgroundColor = "#000";
            e.target.style.color = "#fff";
          }
        }}
      >
        {showFilters ? "Ukryj filtry" : "Pokaż filtry"}
      </button>

      {/* Filtry daty i czasu */}
      {showFilters && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
          <div style={{ marginRight: "20px" }}>
            <label style={{ marginRight: "10px" }}>
              Data początkowa:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ marginLeft: "10px" }}
              />
            </label>
            <label>
              Data końcowa:
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ marginLeft: "10px"}}
              />
            </label>
          </div>

          <div style={{ marginRight: "20px" }}>
            <label style={{ marginRight: "10px" }}>
              Czas początkowy:
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={{ marginLeft: "10px" }}
              />
            </label>
            <label>
              Czas końcowy:
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={{ marginLeft: "10px" }}
              />
            </label>
          </div>

          <div>
            <button type="submit" style={{ marginRight: "10px" }}>
              Filtruj
            </button>
            <button type="button" onClick={handleClearFilters}>
              Wyczyść filtry
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
