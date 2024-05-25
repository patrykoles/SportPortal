import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { request, getAuthToken, setAuthToken } from "../axios-helper";
import classNames from "classnames";

export default function ChangeProfile() {
  let navigate = useNavigate();

  const { id } = useParams();

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const message = searchParams.get("message");

  useEffect(() => {
    request("GET", `/fulluserinfo/${id}`, {})
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

  useEffect(() => {
    if (data) {
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        birthday: data.birthday || "",
        description: data.description || "",
        login: data.login || "",
      });
    }
  }, [data]);

  const onChangeProfile = (e, firstName, lastName, birthday, description, login) => {
    request("PUT", `/changeprofile/${id}`, {
      firstName: firstName,
      lastName: lastName,
      birthday: birthday,
      description: description,
      login: login,
    })
      .then((response) => {
        navigate(`/profile/${id}`);
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

  const resetData = (e) => {
      setFormData(data);
  }

  const onSubmitChangeProfile = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.birthday || !formData.description || !formData.login) {
      resetData(e);
      let msg = "Wszystkie pola muszą być uzupełnione";
      navigate(`/changeprofileinfo/${id}?message=${encodeURIComponent(msg)}`);
      return;
    }
    if(formData.firstName.length > 30){
      resetData(e);
      let msg = "Maksymalna długość imienia to 30 znaków"
      navigate(`/changeprofileinfo/${id}?message=${encodeURIComponent(msg)}`);
      return;
    } else if(formData.lastName.length > 40){
      resetData(e);
      let msg = "Maksymalna długość nazwiska to 40 znaków"
      navigate(`/changeprofileinfo/${id}?message=${encodeURIComponent(msg)}`);
      return;
    } else if(formData.login.length > 30){
      resetData(e);
      let msg = "Maksymalna długość nazwy użytkownika to 30 znaków"
      navigate(`/changeprofileinfo/${id}?message=${encodeURIComponent(msg)}`);
      return;
    }else if(formData.description.length > 500){
      resetData(e);
      let msg = "Maksymalna długość opisu to 500 znaków"
      navigate(`/changeprofileinfo/${id}?message=${encodeURIComponent(msg)}`);
      return;
    }
    onChangeProfile(e, formData.firstName, formData.lastName, formData.birthday, formData.description, formData.login);
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const cancel = () => {
    navigate(`/profile/${id}`);
  };

  useEffect(() => {
    // Aktualizuj pola formularza przy zmianie stanu formData
    document.getElementById("firstName").value = formData.firstName;
    document.getElementById("lastName").value = formData.lastName;
    document.getElementById("login").value = formData.login;
    document.getElementById("birthday").value = formData.birthday;
    document.getElementById("description").value = formData.description;
  }, [formData]);

  return (
    <div className="container">
      <div>
        {message ? <div className="alert alert-info">{message}</div> : <p></p>}
      </div>
      <form
        onSubmit={onSubmitChangeProfile}
        style={{
          background: "#f2f2f2",
          padding: "20px",
          borderRadius: "5px",
        }}
      >
        <div className="form-group row" style={{ marginBottom: "20px" }}>
          <label
            htmlFor="firstName"
            className="col-sm-3 col-form-label text-left"
          >
            Imię
          </label>
          <div className="col-sm-9">
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="form-control"
              onChange={onChangeHandler}
              value={formData.firstName}
              style={{ width: "80%" }}
            />
          </div>
        </div>

        <div className="form-group row" style={{ marginBottom: "20px" }}>
          <label
            htmlFor="lastName"
            className="col-sm-3 col-form-label text-left"
          >
            Nazwisko
          </label>
          <div className="col-sm-9">
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="form-control"
              onChange={onChangeHandler}
              value={formData.lastName}
              style={{ width: "80%" }}
            />
          </div>
        </div>

        <div className="form-group row" style={{ marginBottom: "20px" }}>
          <label
            htmlFor="birthday"
            className="col-sm-3 col-form-label text-left"
          >
            Data urodzenia
          </label>
          <div className="col-sm-9">
            <input
              type="date"
              id="birthday"
              name="birthday"
              className="form-control"
              max={new Date().toISOString().split('T')[0]}
              onChange={onChangeHandler}
              value={formData.birthday}
              style={{ width: "80%" }}
            />
          </div>
        </div>

        <div className="form-group row" style={{ marginBottom: "20px" }}>
          <label
            htmlFor="description"
            className="col-sm-3 col-form-label text-left"
          >
            Opis
          </label>
          <div className="col-sm-9">
            <textarea
              id="description"
              name="description"
              className="form-control"
              onChange={onChangeHandler}
              value={formData.description}
              style={{ width: "80%", height: "100px", resize: "none" }}
            />
          </div>
        </div>

        <div className="form-group row" style={{ marginBottom: "20px" }}>
          <label htmlFor="login" className="col-sm-3 col-form-label text-left">
            Nazwa użytkownika
          </label>
          <div className="col-sm-9">
            <input
              type="text"
              id="login"
              name="login"
              className="form-control"
              onChange={onChangeHandler}
              value={formData.login}
              style={{ width: "80%" }}
            />
          </div>
        </div>

        <div className="form-group row">
          <div className="col-sm-12 text-center">
            <button
              type="submit"
              className="btn btn-dark btn-block"
              style={{
                backgroundColor: "#f2f2f2",
                color: "#000",
                borderRadius: "0",
                transition: "background-color 0.3s, color 0.3s",
                marginRight: "10px",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#000";
                e.target.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#f2f2f2";
                e.target.style.color = "#000";
              }}
            >
              Zapisz
            </button>
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={cancel}
              style={{
                borderRadius: "0",
                transition: "background-color 0.3s, color 0.3s",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#000";
                e.target.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "";
                e.target.style.color = "";
              }}
            >
              Anuluj
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
