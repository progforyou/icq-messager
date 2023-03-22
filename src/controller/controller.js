import {toast} from "react-toastify";
import {store} from "../store";
const axios = require('axios');


const instance = axios.create({
    baseURL: '/api/v1'
});


class controller {
    constructor() {
        if (controller._instance) {
            return controller._instance
        }
        controller._instance = this;
    }

    async signIn(data) {
        let r
        try{
            r = await instance.post("/user/auth/sign-in/", data)
        } catch (e) {
            toast.error(e.response.data.message)
        }
        return r
    }
    
    async reloadToken(){
        let r
        let u = store.get("user").user
        console.log(u)
        try{
            r = await instance.post("/user/token/refresh/", {
                refresh: u.refresh_token
            })
        } catch (e) {
            toast.error(e.response.data.message)
        }
        return r
    }

    async signOut(data) {
        let r
        try{
            r = await instance.post("/user/auth/sign-out/", data)
        } catch (e) {
            toast.error(e.response.data.message)
        }
        return r
    }
    
    async createChat(data){
        let r
        let u = store.get("user").user
        try{
            r = await instance.post("/chat", data, {
                headers: {
                    "Authorization": u.access_token
                }
            })
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
    return new controller();
}