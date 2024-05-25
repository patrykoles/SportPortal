import React, { useState, useEffect } from "react";
import { request, getAuthToken, setAuthToken } from "../axios-helper";
import { useNavigate, useParams } from "react-router-dom";

export default function PublicProfilePage() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    request("GET", `/publicuserinfo/${id}`, {})
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          setAuthToken(null);
          navigate(
            `/login?message=${encodeURIComponent(
              "Sesja wygasła. Zaloguj się ponownie."
            )}`
          );
        } else {
          console.error("Wystąpił błąd:", error);
          setError(error);
        }
      });
  }, []);

  useEffect(() => {
    if (error) {
      console.error("Wystąpił błąd:", error);
    }
  }, [error]);
  const home = () => {
    navigate(`/authhome`);
  };

  return (
    <div>
      <div
        style={{
          background: "lightblue",
          padding: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div style={{ padding: "5px", margin: "3px" }}>
          <h1 style={{ color: "#fff", margin: "0" }}>
            {data.firstName} {data.lastName}
          </h1>
          <p style={{ fontSize: "14px", color: "#fff", marginBottom: "5px" }}>
            {data.login}
          </p>
          <p style={{ color: "#fff" }}>{data.birthday}</p>
        </div>
        <div style={{ padding: "5px", margin: "3px" }}>
          <p style={{ fontSize: "18px" }}>{data.description}</p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            padding: "5px",
            margin: "3px",
          }}
        >
          <button
            className="btn btn-outline-dark"
            style={{
              borderRadius: "0",
              padding: "20px",
              border: "3px solid black",
            }}
            onClick={home}
          >
            Strona Główna
          </button>
        </div>
      </div>
    </div>
  );
}
