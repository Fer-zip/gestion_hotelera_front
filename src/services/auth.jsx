import axios from "axios"
import API_URL from "./api";


const axiosBase = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    }
});

const loginAuth = async (credenciales) =>{
    try{
        const res = await axiosBase.post('/empleados/login', credenciales)
        return res.data;
    }catch (err){
        console.error("Hubo un error en login: " + err)
        throw err;
    }
}

export {loginAuth};