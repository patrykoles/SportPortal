import React, { useState, useEffect } from 'react';
import { request, setAuthToken, isAuthorized, getAuthToken } from '../axios-helper';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Buttons(props){
    const navigate = useNavigate();
    const [sub, setSub] = useState("");

    const login = () => {
        navigate('/login');
      };
  
      const logout = () => {
          setAuthToken(null);
          navigate('/');
      };

      const profile = () => {
        const authToken = getAuthToken();
        if (authToken && authToken !== "null") {
            const decoded = jwtDecode(authToken);
            if (decoded.hasOwnProperty("sub")) {
                setSub(decoded.sub);
                navigate(`/profile/${decoded.sub}`);
                
            }
        }else{
            navigate('/');
        }
    };

    const home = () => {
        const authToken = getAuthToken();
        if (authToken && authToken !== "null") {
            navigate(`/authhome`);
        }else{
            navigate('/');
        }
        
                
        };


        return (
            <div className='navbar navbar-dark bg-dark' style={{ boxShadow: "0px 0px 60px rgba(0, 0, 0, 0.3)", position: 'sticky', top: 0}}>
                <div className='container' >
                    <button className="btn btn-link navbar-brand" style={{ fontSize: "24px" }} onClick={home}>Sportify</button>
                    <div className='ml-auto'>
                        <button className="btn btn-outline-light mr-2" style={{ marginRight: "5px", border: "none" }} onClick={profile}>Strona profilowa</button>
                        <button className="btn btn-outline-light" style={{ marginRight: "5px", border: "none" }} onClick={isAuthorized() ? logout : login}>
                            {isAuthorized() ? "Wyloguj" : "Zaloguj"}
                        </button>
                    </div>
                </div>
            </div>
        );
};