import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { request, setAuthToken } from "../axios-helper";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const message = searchParams.get("message");

  const onLogin = (e, username, password) => {
    e.preventDefault();
    request("POST", "/login", { login: username, password: password })
      .then((response) => {
        setAuthToken(response.data.token);
        navigate("/authhome");
      })
      .catch((error) => {
        setAuthToken(null);
        setFormData({
          firstName: "",
          lastName: "",
          birthday: "",
          description: "",
          login: "",
          password: "",
          repeatpassword: "",
        });
        navigate("/login?message=B%C5%82%C4%99dny+login+lub+has%C5%82o");
      });
  };

  const onRegister = (e, firstName, lastName, birthday, description, username, password) => {
    e.preventDefault();
    request("POST", "/register", {
      firstName: firstName,
      lastName: lastName,
      birthday: birthday,
      description: description,
      login: username,
      password: password,
    })
      .then((response) => {
        setAuthToken(response.data.token);
        navigate("/authhome");
      })
      .catch((error) => {
        let errorMessage = "Wystąpił błąd przy rejestracji"; // Domyślna wiadomość błędu, jeśli nie można odczytać szczegółów z błędu
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          errorMessage = error.response.data.message;
        }
        console.error(errorMessage); // Możesz wyświetlić błąd w konsoli lub przekazać go gdzie indziej w aplikacji
        setAuthToken(null);
        setFormData({
          firstName: "",
          lastName: "",
          birthday: "",
          description: "",
          login: "",
          password: "",
          repeatpassword: "",
        });
        navigate(`/login?message=${encodeURIComponent(errorMessage)}`);
      });
  };
  const [active, setActive] = useState("login");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    description: "",
    login: "",
    password: "",
    repeatpassword: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmitLogin = (e) => {
    e.preventDefault();
    if (!formData.login || !formData.password) {
      resetData(e);
      let msg = "Wszystkie pola muszą być uzupełnione";
      navigate(`/login?message=${encodeURIComponent(msg)}`);
      return;
    }
    if(formData.login.length > 30){
      resetData(e);
      let msg = "Maksymalna długość nazwy użytkownika to 30 znaków"
      navigate(`/login?message=${encodeURIComponent(msg)}`);
      return;
    }else if(formData.password.length > 64 || formData.password.length < 8){
      resetData(e);
      let msg = "Hasło powinno zawierać od 8 do 64 znaków"
      navigate(`/login?message=${encodeURIComponent(msg)}`);
      return;
    }
    onLogin(e, formData.login, formData.password);
  };

  const resetData = (e) => {
    setAuthToken(null);
      setFormData({
        firstName: "",
        lastName: "",
        birthday: "",
        description: "",
        login: "",
        password: "",
        repeatpassword: "",
      });
  }

  const onSubmitRegister = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.birthday || !formData.description || !formData.login || !formData.password || !formData.repeatpassword) {
      resetData(e);
      let msg = "Wszystkie pola muszą być uzupełnione";
      navigate(`/login?message=${encodeURIComponent(msg)}`);
      return;
    }
    if (!(formData.repeatpassword === formData.password)) {
      resetData(e);
      navigate("/login?message=Has%C5%82a+nie+zgadzaj%C4%85+si%C4%99");
      return;
    } else if(formData.firstName.length > 30){
      resetData(e);
      let msg = "Maksymalna długość imienia to 30 znaków"
      navigate(`/login?message=${encodeURIComponent(msg)}`);
      return;
    } else if(formData.lastName.length > 40){
      resetData(e);
      let msg = "Maksymalna długość nazwiska to 40 znaków"
      navigate(`/login?message=${encodeURIComponent(msg)}`);
      return;
    } else if(formData.login.length > 30){
      resetData(e);
      let msg = "Maksymalna długość nazwy użytkownika to 30 znaków"
      navigate(`/login?message=${encodeURIComponent(msg)}`);
      return;
    }else if(formData.password.length > 64 || formData.password.length < 8){
      resetData(e);
      let msg = "Hasło powinno zawierać od 8 do 64 znaków"
      navigate(`/login?message=${encodeURIComponent(msg)}`);
      return;
    }else if(formData.description.length > 500){
      resetData(e);
      let msg = "Maksymalna długość opisu to 500 znaków"
      navigate(`/login?message=${encodeURIComponent(msg)}`);
      return;
    }
    onRegister(
      e,
      formData.firstName,
      formData.lastName,
      formData.birthday,
      formData.description,
      formData.login,
      formData.password
    );
  };

  useEffect(() => {
    // Aktualizuj pola formularza przy zmianie stanu formData
    document.getElementById("firstName").value = formData.firstName;
    document.getElementById("lastName").value = formData.lastName;
    document.getElementById("loginName").value = formData.login;
    document.getElementById("loginPassword").value = formData.password;
    document.getElementById("login").value = formData.login;
    document.getElementById("registerPassword").value = formData.password;
    document.getElementById("repeatPassword").value = formData.repeatpassword;
    document.getElementById("birthday").value = formData.birthday;
    document.getElementById("description").value = formData.description;
  }, [formData]);

  return (
    <div className="row justify-content-center">
      <div>
        {message ? <div className="alert alert-info">{message}</div> : <p></p>}
      </div>
      <div className="col-6">
        <ul
          className="nav nav-pills nav-justified mb-3"
          id="ex1"
          role="tablist"
        >
          <li className="nav-item" role="presentation">
            <button
              className={classNames(
                "nav-link",
                active === "login" ? "active" : ""
              )}
              id="tab-login"
              onClick={() => setActive("login")}
              style={{
                backgroundColor: active === "login" ? "#343a40" : "#f2f2f2",
                color: active === "login" ? "#fff" : "#000",
                borderRadius: "0",
              }}
            >
              Logowanie
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={classNames(
                "nav-link",
                active === "register" ? "active" : ""
              )}
              id="tab-register"
              onClick={() => setActive("register")}
              style={{
                backgroundColor: active === "register" ? "#343a40" : "#f2f2f2",
                color: active === "register" ? "#fff" : "#000",
                borderRadius: "0",
              }}
            >
              Rejestracja
            </button>
          </li>
        </ul>

        <div className="tab-content">
          <div
            className={classNames(
              "tab-pane",
              "fade",
              active === "login" ? "show active" : ""
            )}
            id="pills-login"
          >
            <form
              onSubmit={onSubmitLogin}
              style={{
                background: "#f2f2f2",
                padding: "20px",
                borderRadius: "5px",
              }}
            >
              <div className="form-group row" style={{margin: '15px'}}>
                <label
                  htmlFor="loginName"
                  className="col-sm-3 col-form-label text-left"
                >
                  Nazwa użytkownika
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    id="loginName"
                    name="login"
                    className="form-control"
                    style={{ width: "80%" }}
                    onChange={onChangeHandler}
                  />
                </div>
              </div>

              <div className="form-group row" style={{margin: '15px'}}>
                <label
                  htmlFor="loginPassword"
                  className="col-sm-3 col-form-label text-left"
                >
                  Hasło
                </label>
                <div className="col-sm-9">
                  <input
                    type="password"
                    id="loginPassword"
                    name="password"
                    className="form-control"
                    style={{ width: "80%" }}
                    onChange={onChangeHandler}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-dark btn-block mt-3"
                style={{
                  backgroundColor: "#f2f2f2",
                  color: "#000",
                  borderRadius: "0",
                  transition: "background-color 0.3s, color 0.3s",
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
                Zaloguj się
              </button>
            </form>
          </div>
          <div
            className={classNames(
              "tab-pane",
              "fade",
              active === "register" ? "show active" : ""
            )}
            id="pills-register"
          >
            <form
              onSubmit={onSubmitRegister}
              style={{
                background: "#f2f2f2",
                padding: "20px",
                borderRadius: "5px",
              }}
            >
              <div className="form-group row" style={{margin: '15px'}}>
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
                    style={{ width: "80%" }}
                    onChange={onChangeHandler}
                  />
                </div>
              </div>

              <div className="form-group row" style={{margin: '15px'}}>
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
                    style={{ width: "80%" }}
                    onChange={onChangeHandler}
                  />
                </div>
              </div>

              <div className="form-group row" style={{margin: '15px'}}>
                <label
                  htmlFor="login"
                  className="col-sm-3 col-form-label text-left"
                >
                  Nazwa użytkownika
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    id="login"
                    name="login"
                    className="form-control"
                    style={{ width: "80%" }}
                    onChange={onChangeHandler}
                  />
                </div>
              </div>
              
              <div className="form-group row" style={{margin: '15px'}}>
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
                    style={{ width: "80%" }}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={onChangeHandler}
                  />
                </div>
              </div>

              <div className="form-group row" style={{margin: '15px'}}>
                <label
                  htmlFor="description"
                  className="col-sm-3 col-form-label text-left"
                >
                  Napisz coś o sobie
                </label>
                <div className="col-sm-9">
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    style={{ width: "80%", height: "100px", resize: "none" }}
                    onChange={onChangeHandler}
                  />
                </div>
              </div>

              <div className="form-group row" style={{margin: '15px'}}>
                <label
                  htmlFor="registerPassword"
                  className="col-sm-3 col-form-label text-left"
                >
                  Hasło
                </label>
                <div className="col-sm-9">
                  <input
                    type="password"
                    id="registerPassword"
                    name="password"
                    className="form-control"
                    style={{ width: "80%" }}
                    onChange={onChangeHandler}
                  />
                </div>
              </div>

              <div className="form-group row" style={{margin: '15px'}}>
                <label
                  htmlFor="repeatPassword"
                  className="col-sm-3 col-form-label text-left"
                >
                  Powtórz hasło
                </label>
                <div className="col-sm-9">
                  <input
                    type="password"
                    id="repeatPassword"
                    name="repeatpassword"
                    className="form-control"
                    style={{ width: "80%" }}
                    onChange={onChangeHandler}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-dark btn-block mt-3"
                style={{
                  backgroundColor: "#f2f2f2",
                  color: "#000",
                  borderRadius: "0",
                  transition: "background-color 0.3s, color 0.3s",
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
                Zarejestruj się
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
