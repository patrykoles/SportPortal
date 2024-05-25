import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8080'
axios.defaults.headers.post["Content-Type"] = 'application/json'

export const getAuthToken = () => {
    return window.localStorage.getItem("auth_token");
};

export const setAuthToken = (token) => {
    if (token !== null) {
        window.localStorage.setItem("auth_token", token);
      } else {
        window.localStorage.removeItem("auth_token");
      }
};

export const isAuthorized = () => {
    let token = getAuthToken();
    return token !== null && token !== "null";
};

export const request = (method, url, data) => {
    let headers = {}
    if(getAuthToken()!==null && getAuthToken() !== "null"){
        headers = {"Authorization": `Bearer ${getAuthToken()}`};
    }
    return axios({
        method: method,
        headers: headers,
        url: url,
        data: data 
    });
};
