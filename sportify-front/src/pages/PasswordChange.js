import React,  { useState, useEffect } from 'react';
import classNames from 'classnames';
import { request, setAuthToken } from '../axios-helper';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

export default function Password(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const message = searchParams.get('message');
    const {id}=useParams();

    const [formData, setFormData] = useState({
        currentpassword: "",
        newpassword: "",
        repeatnewpassword:""
    });

    const onChangePassword = (e, currentpassword, newpassword) => {
        e.preventDefault();
        request("PUT",
        `/changepassword/${id}`,
        {
            currentPassword: currentpassword,
            newPassword: newpassword
        }
        ).then((response) => {
            navigate(`/profile/${id}`);
            
        }).catch((error) => {
            let errorMessage = "Wystąpił błąd"; // Domyślna wiadomość błędu, jeśli nie można odczytać szczegółów z błędu
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        }
        if(error.response.status === 401){
            setAuthToken(null);
            navigate(`/login?message=${encodeURIComponent("Sesja wygasła. Zaloguj się ponownie.")}`);
        }else{
            console.error(errorMessage);
            setFormData({
                currentpassword: "",
                newpassword: "",
                repeatnewpassword:""
            });
            navigate(`/changepasswordpage/${id}?message=${encodeURIComponent(errorMessage)}`);
        
            }
        });
    
          
      };

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const onSubmitChangePassword = (e) => {
        e.preventDefault();
        if(!(formData.repeatnewpassword === formData.newpassword)){
            setFormData({
                currentpassword: "",
                newpassword: "",
                repeatnewpassword:""
            });
            navigate(`/changepasswordpage/${id}?message=Has%C5%82a+nie+zgadzaj%C4%85+si%C4%99`);
        }else if(formData.newpassword.length > 64 || formData.newpassword.length < 8 || formData.currentpassword.length > 64 || formData.currentpassword.length < 8){
          setFormData({
            currentpassword: "",
            newpassword: "",
            repeatnewpassword:""
          });
          let msg = "Hasło powinno zawierać od 8 do 64 znaków"
          navigate(`/changepasswordpage/${id}?message=${encodeURIComponent(msg)}`);
        }else if(formData.currentpassword === formData.newpassword){
          setFormData({
            currentpassword: "",
            newpassword: "",
            repeatnewpassword:""
          });
          let msg = "Nowe hasło nie może być takie samo jak stare hasło"
          navigate(`/changepasswordpage/${id}?message=${encodeURIComponent(msg)}`);
        }else{
        onChangePassword(
            e,
            formData.currentpassword,
            formData.newpassword
        );
    }
    };

    useEffect(() => {
        // Aktualizuj pola formularza przy zmianie stanu formData
        document.getElementById("currentPassword").value = formData.currentpassword;
        document.getElementById("newPassword").value = formData.newpassword;
        document.getElementById("repeatNewPassword").value = formData.repeatnewpassword;
      }, [formData]);

      const cancel = () => {   
        navigate(`/profile/${id}`);          
      };
  
      return (
        <div className="d-flex justify-content-center align-items-center">
          
          <div className="container" style={{ maxWidth: '600px' }}>
          <div>
            {message ? (
              <div className="alert alert-info">{message}</div>
            ) : (
              <p></p>
            )}
          </div>
            <form
              onSubmit={onSubmitChangePassword}
              style={{
                background: "#f2f2f2",
                padding: "20px",
                borderRadius: "5px",
              }}
            >
              <div className="form-group row" style={{ marginBottom: "20px" }}>
                <label htmlFor="currentPassword" className="col-sm-4 col-form-label text-left">
                  Obecne Hasło
                </label>
                <div className="col-sm-8">
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentpassword"
                    className="form-control"
                    onChange={onChangeHandler}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
    
              <div className="form-group row" style={{ marginBottom: "20px" }}>
                <label htmlFor="newPassword" className="col-sm-4 col-form-label text-left">
                  Nowe hasło
                </label>
                <div className="col-sm-8">
                  <input
                    type="password"
                    id="newPassword"
                    name="newpassword"
                    className="form-control"
                    onChange={onChangeHandler}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
    
              <div className="form-group row" style={{ marginBottom: "20px" }}>
                <label htmlFor="repeatNewPassword" className="col-sm-4 col-form-label text-left">
                  Powtórz nowe hasło
                </label>
                <div className="col-sm-8">
                  <input
                    type="password"
                    id="repeatNewPassword"
                    name="repeatnewpassword"
                    className="form-control"
                    onChange={onChangeHandler}
                    style={{ width: "100%" }}
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
                    Zmień hasło
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
        </div>
      );
}