import {store} from "../store";
import {toast} from "react-toastify";
const axios = require('axios');


const instance = axios.create({
    baseURL: '/api/admin',
    withCredentials: true
});


class adminController {
    constructor() {
        if (adminController._instance) {
            return adminController._instance
        }
        adminController._instance = this;
    }

    async reloadToken(){
        let r
        let u = store.get("user").user
        try{
            r = await axios.get("/api/auth/refresh/", {
                headers: {
                    "Authorization": `Bearer ${u.admin_access_token}`
                }
            })
        } catch (e) {
            if (e.response.status === 401){
                return "reload"
            } else {
                toast.error(e.response.data.Message)
            }
        }
        return r
    }

    async signIn(data) {
        let r
        try{
            r = await instance.post("/login/", data)
        } catch (e) {
            toast.error(e.response.data.Message)
        }
        return r
    }

    async createUser(data) {
        let r
        let u = store.get("user").user
        try{
            r = await instance.post("/users/", data,{
                headers: {
                    "Authorization": `Bearer ${u.admin_access_token}`
                }})
            toast.success("OK")
        } catch (e) {
            if (e.response?.status === 401){
                return "reload"
            } else {
                toast.error(e.response.data.Message)
            }
        }
        return r
    }

    async getUsers() {
        let r
        let u = store.get("user").user
        if (!u.admin_access_token) return
        try{
            r = await instance.get("/users/", {
                headers: {
                    "Authorization": `Bearer ${u.admin_access_token}`
                }})
            store.dispatch("admin/setUsers", r.data.Data ? r.data.Data : [])
        } catch (e) {
            if (e.response?.status === 401){
                return "reload"
            } else {
                toast.error(e.response.data.Message)
            }
        }
        
        return r
    }

    async getUser(id) {
        let r
        let u = store.get("user").user
        try{
            r = await instance.patch("/users/", {id : id},{
                headers: {
                    "Authorization": `Bearer ${u.admin_access_token}`
                }})
            return r.data
        } catch (e) {
            if (e.response?.status === 401){
                return "reload"
            } else {
                toast.error(e.response.data.Message)
            }
        }
    }

    async updateUser(data) {
        let r
        let u = store.get("user").user
        try{
            r = await instance.put(`/users/`, data, {
                headers: {
                    "Authorization": `Bearer ${u.admin_access_token}`
                }})
            toast.success(r.data.message)
        } catch (e) {
            if (e.response?.status === 401){
                return "reload"
            } else {
                toast.error(e.response.data.Message)
            }
        }
        return r
    }

    async updateAdmin(data) {
        let r
        let u = store.get("user").user
        try{
            r = await instance.put(`/password/`, data, {
                headers: {
                    "Authorization": `Bearer ${u.admin_access_token}`
                }})
            toast.success("Пароль сменен")
        } catch (e) {
            if (e.response?.status === 401){
                return "reload"
            } else {
                toast.error(e.response.data.Message)
            }
        }
        return r
    }

    async deleteUser(id) {
        let r
        let u = store.get("user").user
        try{
            r = await instance.delete(`/users/`, {
                headers: {
                    "Authorization": `Bearer ${u.admin_access_token}`
                },
                data: {
                    id: id
                }
            })
            toast.success("OK")
        } catch (e) {
            if (e.response?.status === 401){
                return "reload"
            } else {
                toast.error(e.response.data.Message)
            }
        }
        return r
    }
    

   

}

export default () => {
    return new adminController();
}