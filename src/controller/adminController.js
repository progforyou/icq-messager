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
        let u = store.get("user").user
        try{
            r = await instance.post("/user/auth/sign-up/", data, {
                headers: {
                    "Authorization": u.access_token
                }})
            toast.success(r.data.message)
            await this.getUsers()
        } catch (e) {
            toast.error(e.response.data.message)
        }
        return r
    }

    async getUsers() {
        let r
        let u = store.get("user").user
        try{
            r = await instance.get("/users/", {
                headers: {
                    "Authorization": u.access_token
                }})
            store.dispatch("admin/setUsers", r.data.data.users)
        } catch (e) {
            if (e.response.data.code === 401){
                return "reload"
            } else {
                toast.error(e.response.data.message)
            }
        }
        return r
    }

    async updateUser(id, data) {
        let r
        let u = store.get("user").user
        try{
            r = await instance.put(`/user/${id}`, data, {
                headers: {
                    "Authorization": u.access_token
                }})
            toast.success(r.data.message)
        } catch (e) {
            if (e.response.data.code === 401){
                return "reload"
            } else {
                toast.error(e.response.data.message)
            }
        }
        return r
    }

    async updateAdmin(data) {
        let r
        let u = store.get("user").user
        try{
            r = await instance.put(`/user/`, data, {
                headers: {
                    "Authorization": u.access_token
                }})
            toast.success(r.data.message)
        } catch (e) {
            if (e.response.data.code === 401){
                return "reload"
            } else {
                toast.error(e.response.data.message)
            }
        }
        return r
    }

    async deleteUser(id) {
        let r
        let u = store.get("user").user
        try{
            r = await instance.delete(`/user/${id}`, {
                headers: {
                    "Authorization": u.access_token
                }})
            toast.success(r.data.message)
            await this.getUsers()
        } catch (e) {
            if (e.response.data.code === 401){
                return "reload"
            } else {
                toast.error(e.response.data.message)
            }
        }
        return r
    }
    

   

}

export default () => {
    return new adminController();
}