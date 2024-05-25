import React, { useState, useEffect } from 'react';
import { request, getAuthToken, setAuthToken } from "../axios-helper";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import ListPosts from '../posts/ListPosts';
import Filters from '../posts/Filters';
import plusImage from '../img/plus.png';

export default function AuthHomePage() {
    const navigate = useNavigate();
    const [sub, setSub] = useState("");

    const [filters, setFilters] = useState({
        sport: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        specialFilter: ""
    });

    const handleUpdateFilters = (newFilters) => {
        setFilters(newFilters);
    };


    
    const addPost = () =>{
        navigate('/addpost')
    }


    return (
        <div>
            <Filters onUpdateFilters={handleUpdateFilters} />
            <button className="btn btn-outline-dark" style={{ marginTop: "40px" }} onClick={addPost}>
                <img src={plusImage} alt="Dodaj post" style={{ width: "40px", height: "40px" }}/>
            </button>
            <ListPosts filters={filters} />
        </div>
    );
}