import React, { useState, useEffect } from "react";
import { request, getAuthToken, setAuthToken } from "../axios-helper";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
import ListPosts from "../posts/ListPosts";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [filters, setFilters] = useState({
    sport: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    specialFilter: "user",
  });
  const [isActiveBtn1, setIsActiveBtn1] = useState(true);
  const [isActiveBtn2, setIsActiveBtn2] = useState(false);

  const handleBtn1Click = () => {
    setIsActiveBtn1(true);
    setIsActiveBtn2(false);
    setFilters((prevFilters) => ({
      ...prevFilters,
      specialFilter: "user",
    }));
  };

  const handleBtn2Click = () => {
    setIsActiveBtn1(false);
    setIsActiveBtn2(true);
    setFilters((prevFilters) => ({
      ...prevFilters,
      specialFilter: "joined",
    }));
  };

  useEffect(() => {
    request("GET", `/userinfo/${id}`, {})
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

  const change = () => {
    navigate(`/changeprofileinfo/${id}`);
  };
  const home = () => {
    navigate(`/authhome`);
  };
  const passwd = () => {
    navigate(`/changepasswordpage/${id}`);
  };
  const deleteAc = () => {
    request("DELETE", `/deluser/${id}`, {})
      .then((response) => {
        setAuthToken(null);
        navigate("/");
      })
      .catch((error) => {
        if (error.response.status === 403) {
          console.error("Wystąpił błąd:", error);
          setError(error);
        } else if (error.response.status === 401) {
          setAuthToken(null);
          navigate(
            `/login?message=${encodeURIComponent(
              "Sesja wygasła. Zaloguj się ponownie."
            )}`
          );
        } else {
          setAuthToken(null);
          navigate("/");
        }
      });
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
        <div style={{padding: "5px", margin:"3px"}}>
          <h1 style={{ color: "#fff", margin: "0" }}>
            {data.firstName} {data.lastName}
          </h1>
          <p style={{ fontSize: "14px", color: "#fff", marginBottom: "5px" }}>
            {data.login}
          </p>
          <p style={{ color: "#fff" }}>{data.birthday}</p>
        </div>
        <div style={{padding: "20px", margin:"3px"}}>
          <p style={{ fontSize: "18px"}}>{data.description}</p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            padding: "5px", 
            margin:"3px"
          }}
        >
          <button
            className="btn btn-outline-dark"
            style={{ borderRadius: "0", padding: "20px", border: "3px solid black" }}
            onClick={home}
          >
            Strona Główna
          </button>
          <button
            className="btn btn-outline-dark"
            style={{ borderRadius: "0", padding: "20px", border: "3px solid black" }}
            onClick={change}
          >
            Zmień dane
          </button>
          <button
            className="btn btn-outline-dark"
            style={{ borderRadius: "0", padding: "20px", border: "3px solid black" }}
            onClick={passwd}
          >
            Zmień hasło
          </button>
          <button className="btn btn-outline-dark" style={{ borderRadius: "0", padding: "20px", border: "3px solid black" }} onClick={() => {
                    if (window.confirm("Czy na pewno chcesz usunąć swoje konto?")) {
                        deleteAc();
                    }
                }}>Usuń konto</button>
        </div>
      </div>

      <div>
        <button
          onClick={handleBtn1Click}
          className="btn"
          style={{
            backgroundColor: isActiveBtn1 ? "lightblue" : "white",
            borderRadius: "0",
            marginRight: "10px",
          }}
        >
          Zobacz swoje posty
        </button>
        <button
          onClick={handleBtn2Click}
          className="btn"
          style={{
            backgroundColor: isActiveBtn2 ? "lightblue" : "white",
            borderRadius: "0",
          }}
        >
          Zobacz posty w których bierzesz udział
        </button>
      </div>
      <ListPosts filters={filters} />
    </div>
  );
}
