import {toast} from "react-toastify";
import {store} from "../store";
import {messages} from "../store/messages";
import {contacts} from "../store/contacts";
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
        try{
            r = await instance.post("/user/token/refresh/", {
                refresh: u.refresh_token
            })
        } catch (e) {
            if (e.response.status === 401){
                return "reload"
            } else {
                toast.error(e.response.data.message)
            }
        }
        return r
    }

    async signOut(data) {
        let r
        let u = store.get("user").user
        try{
            r = await instance.post("/user/auth/sign-out/", data, {
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
    
    async getChatMessages(){
        let r
        let u = store.get("user").user
        let page = store.get("messages").messages.page
        let chatId = store.get("contacts").contacts.active
        if (chatId === 0){
            return 
        }
        try{
            r = await instance.get(`/chat/${chatId}/messages/?page=${page}`, {
                headers: {
                    "Authorization": u.access_token
                }
            })
            store.dispatch("messages/set", r.data.data.messages)
            store.dispatch("messages/setTotal", r.data.data.total)
        } catch (e) {
            if (e.response.data.code === 401){
                return "reload"
            } else {
                toast.error(e.response.data.message)
            }
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

    async getChats(){
        let r
        let u = store.get("user").user
        try{
            r = await instance.get(`/chats`, {
                headers: {
                    "Authorization": u.access_token
                }
            })
            console.log(r.data.data.chats)
            store.dispatch("contacts/set", r.data.data.chats)
        } catch (e) {
            if (e.response.data.code === 401){
                return "reload"
            } else {
                toast.error(e.response.data.message)
            }
        }
        return r
    }

    async getChatMembers(id){
        let r
        if (id === 0){
            return 
        }
        let u = store.get("user").user
        try{
            r = await instance.get(`/chat/${id}/members`, {
                headers: {
                    "Authorization": u.access_token
                }
            })
            store.dispatch("contacts/setActiveChatMembers", r.data.data)
        } catch (e) {
            if (e.response.data.code === 401){
                return "reload"
            } else {
                toast.error(e.response.data.message)
            }
        }
        return r
    }
    
    async addChatMember(id, data){
        let r
        if (id === 0){
            return
        }
        let u = store.get("user").user
        try{
            r = await instance.post(`/chat/${id}/members`, [data],{
                headers: {
                    "Authorization": u.access_token
                }
            })
            await this.getChatMembers(id)
        } catch (e) {
            if (e.response.data.code === 401){
                return "reload"
            } else {
                toast.error(e.response.data.message)
            }
        }
        return r
    }

    async sendMedia(data){
        let r
        let u = store.get("user").user
        try{
            r = await instance.post(`/media`, {
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