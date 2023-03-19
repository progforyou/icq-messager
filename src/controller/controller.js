import {store} from "../store";
const axios = require('axios');
axios.interceptors.response.use(response => {
    return response
}, reject => {
    console.log(reject);
    window.location = '/';
})

const instance = axios.create({
    headers:{
        post:{
            'Content-Type': 'application/json;charset=utf-8'
        }
    },
    baseURL: 'http://localhost:8080/api'
})

class controller {
    constructor() {
        if (controller._instance) {
            return controller._instance
        }
        controller._instance = this;
    }

    async getAllIdentities() {
        //instance
    }

   

}

export default () => {
    return new controller();
}