import React, {useEffect, useState} from 'react'
import axios from 'axios';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { request, getAuthToken, setAuthToken } from "../axios-helper";
import classNames from 'classnames';

export default function AddPost() {

    let navigate=useNavigate();
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        location:"",
        sport:"football"
    });
    const {id}=useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const message = searchParams.get("message");

    useEffect(() => {
        if (error) {
            console.error("Wystąpił błąd:", error);
        }
    }, [error]);

    const onAddPost = (e, title, description, date, time, location, sport) => {

                request(
                    "POST",
                    `/sendpost`,
                    {
                        title: title,
                        description: description,
                        date: date,
                        time: time,
                        location: location,
                        sport: sport
                    }
                ).then((response) => {
                    navigate(`/authhome`)
                }).catch(error => {
                    if(error.response.status === 403){
                        console.error("Wystąpił błąd:", error);
                        setError(error);
                    }else if(error.response.status === 401){
                        setAuthToken(null);
                        navigate(`/login?message=${encodeURIComponent("Sesja wygasła. Zaloguj się ponownie.")}`);
                    }else{
                        console.error("Wystąpił błąd:", error);
                        setError(error);
                    }
                });       
      };

      const resetData = (e) => {
          setFormData({
            title: "",
            description: "",
            date: "",
            time: "",
            location: "",
            sport: "football",
          });
      }

    const onSubmitAddPost = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location || !formData.sport) {
          resetData(e);
          let msg = "Wszystkie pola muszą być uzupełnione";
          navigate(`/addpost?message=${encodeURIComponent(msg)}`);
          return;
        }
        if(formData.title.length > 50){
          resetData(e);
          let msg = "Maksymalna długość tytułu to 50 znaków";
          navigate(`/addpost?message=${encodeURIComponent(msg)}`);
          return;
        }
        if(formData.description.length > 500){
          resetData(e);
          let msg = "Maksymalna długość opisu to 500 znaków";
          navigate(`/addpost?message=${encodeURIComponent(msg)}`);
          return;
        }
        if(formData.location.length > 50){
          resetData(e);
          let msg = "Maksymalna długość lokalizacji to 50 znaków";
          navigate(`/addpost?message=${encodeURIComponent(msg)}`);
          return;
        }
        onAddPost(
            e,
            formData.title,
            formData.description,
            formData.date,
            formData.time,
            formData.location,
            formData.sport
        );
    };

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const cancel = () => {   
        navigate(`/authhome`);          
    };

    useEffect(() => {
      // Aktualizuj pola formularza przy zmianie stanu formData
      document.getElementById("title").value = formData.title;
      document.getElementById("description").value = formData.description;
      document.getElementById("date").value = formData.date;
      document.getElementById("time").value = formData.time;
      document.getElementById("location").value = formData.location;
      document.getElementById("sport").value = formData.sport;
    }, [formData]);

    

    return (
        <div className='container'>
          <div>
            {message ? <div className="alert alert-info">{message}</div> : <p></p>}
          </div>
          <form
            onSubmit={onSubmitAddPost}
            style={{
              background: "#f2f2f2",
              padding: "20px",
              borderRadius: "5px",
            }}
          >
            <div className="form-group row" style={{ marginBottom: "20px" }}>
              <label htmlFor="title" className="col-sm-3 col-form-label text-left">
                Tytuł:
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-control"
                  onChange={onChangeHandler}
                  style={{ width: "80%" }}
                />
              </div>
            </div>
    
            <div className="form-group row" style={{ marginBottom: "20px" }}>
              <label htmlFor="description" className="col-sm-3 col-form-label text-left">
                Opis:
              </label>
              <div className="col-sm-9">
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  onChange={onChangeHandler}
                  rows="4"
                  style={{ width: "80%", resize: "none" }}
                ></textarea>
              </div>
            </div>
    
            <div className="form-group row" style={{ marginBottom: "20px" }}>
              <label htmlFor="date" className="col-sm-3 col-form-label text-left">
                Data:
              </label>
              <div className="col-sm-9">
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-control"
                  min={new Date().toISOString().split('T')[0]}
                  onChange={onChangeHandler}
                  style={{ width: "80%" }}
                />
              </div>
            </div>
    
            <div className="form-group row" style={{ marginBottom: "20px" }}>
              <label htmlFor="time" className="col-sm-3 col-form-label text-left">
                Godzina:
              </label>
              <div className="col-sm-9">
                <input
                  type="time"
                  id="time"
                  name="time"
                  className="form-control"
                  onChange={onChangeHandler}
                  style={{ width: "80%" }}
                />
              </div>
            </div>
    
            <div className="form-group row" style={{ marginBottom: "20px" }}>
              <label htmlFor="location" className="col-sm-3 col-form-label text-left">
                Miejsce:
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="form-control"
                  onChange={onChangeHandler}
                  style={{ width: "80%" }}
                />
              </div>
            </div>
    
            <div className="form-group row" style={{ marginBottom: "20px" }}>
              <label htmlFor="sport" className="col-sm-3 col-form-label text-left">
                Sport:
              </label>
              <div className="col-sm-9">
                <select
                  id="sport"
                  name="sport"
                  className="form-control"
                  onChange={onChangeHandler}
                  style={{ width: "80%" }}
                >
                  <option value="football">Piłka nożna</option>
                  <option value="basketball">Koszykówka</option>
                  <option value="volleyball">Siatkówka</option>
                  <option value="tennis">Tenis</option>
                  <option value="running">Bieganie</option>
                  <option value="hockey">Hokej</option>
                  <option value="swimming">Pływanie</option>
                  <option value="golf">Golf</option>
                  <option value="bilard">Bilard</option>
                  <option value="darts">Darty</option>
                  <option value="tabletennis">Tenis stołowy</option>
                  <option value="dance">Taniec</option>
                  <option value="rugby">Rugby</option>
                </select>
              </div>
            </div>
    
            <div className="form-group row">
              <div className="col-sm-12 text-center">
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
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
                  Dodaj
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
