import {store} from "../store";
import {toast} from "react-toastify";
const axios = require('axios');


const instance = axios.create({
    baseURL: '/api/v1'
});


class adminController {
    constructor() {
        if (adminController._instance) {
            return adminController._instance
        }
        adminController._instance = this;
    }

    async createUser(data) {
        let r
        try{
            r = await instance.post("/user/auth/sign-up/", data)
            toast.success(r.data.message)
        } catch (e) {
            toast.error(e.response.data.message)
        }
        return r
    }

    async updateUser(id, data) {
        let r
        try{
            r = await instance.put(`/user/${id}/`, data)
            toast.success(r.data.message)
        } catch (e) {
            toast.error(e.response.data.message)
        }
        return r
    }

    async deleteUser(id) {
        let r
        try{
            r = await instance.delete(`/user/${id}/`)
            toast.success(r.data.message)
        } catch (e) {
            toast.error(e.response.data.message)
        }
        return r
    }
    

   

}

export default () => {
    return new adminController();
}