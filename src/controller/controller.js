import {toast} from "react-toastify";
import {store} from "../store";
import {messages} from "../store/messages";
import {contacts} from "../store/contacts";
const axios = require('axios');


const instance = axios.create({
    baseURL: '/api',
    withCredentials: true
});


function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}


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
            r = await instance.post("/login/", data)
        } catch (e) {
            toast.error(e.response.data.Message)
        }
        return r
    }
    
    async reloadToken(){
        let r
        let u = store.get("user").user
        try{
            r = await instance.get("/auth/refresh/", {
                headers: {
                    "Authorization": `Bearer ${u.access_token}`
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

    async signOut(data) {
        let r
        let u = store.get("user").user
        try{
            r = await instance.post("/logout/", data, {
                headers: {
                    "Authorization": `Bearer ${u.access_token}`
                }
            })
            store.dispatch("contacts/clear", "all")
        } catch (e) {
            if (e.response?.status === 401){
                return "reload"
            } else {
                toast.error(e.response.data.Message)
            }
        }
        return r
    }
    
    async getChatMessages(){
        let r
        let u = store.get("user").user
        let page = store.get("messages").messages.page
        let messages = store.get("messages").messages.list
        let lastId = messages.length ? messages[messages.length - 1] : 0
        let chatId = store.get("contacts").contacts.active
        if (chatId === 0){
            return 
        }
        try{
            r = await instance.post(`/chats/messages/`,  {
                chat_id: chatId,
                before_id: lastId 
            },{
                headers: {
                    "Authorization": `Bearer ${u.access_token}`,
                    "Content-Type": "application/json"
                },
            })
            store.dispatch("messages/set", r.data.Data.messages)
            store.dispatch("messages/setTotal", r.data.Data.count)
        } catch (e) {
            if (e.response?.status === 401){
                return "reload"
            } else {
                console.log(e)
                toast.error(e.response?.data.Message)
            }
        }
        return r
    }
    
    async createChat(data){
        let r
        let u = store.get("user").user
        try{
            r = await instance.post("/chats/", data, {
                headers: {
                    "Authorization": `Bearer ${u.access_token}`
                }
            })
        } catch (e) {
            if (e.response?.status === 401){
                return "reload"
            } else {
                toast.error(e.response.data.Message)   
            }
        }
        return r
    }

    async getChats(){
        let r
        let u = store.get("user").user
        try{
            r = await instance.get(`/chats/`, {
                headers: {
                    "Authorization": `Bearer ${u.access_token}`
                }
            })
            store.dispatch("contacts/set", r.data.Data ? r.data.Data : [])
        } catch (e) {
            if (e.response?.status === 401){
                return "reload"
            } else {
                toast.error(e.response.data.Message)
            }
        }
        return r
    }

    async getUsers(){
        let r
        let u = store.get("user").user
        try{
            r = await instance.get(`/users/`, {
                headers: {
                    "Authorization": `Bearer ${u.access_token}`
                }
            })
            store.dispatch("contacts/setFindResult", r.data.Data ? r.data.Data : [])
            store.dispatch("contacts/setAllUsers", r.data.Data ? r.data.Data : [])
        } catch (e) {
            if (e.response?.status === 401){
                return "reload"
            } else {
                toast.error(e.response.data.Message)
            }
        }
        return r
    }

    async getAllUsers(){
        let r
        let u = store.get("user").user
        try{
            r = await instance.get(`/users/`, {
                headers: {
                    "Authorization": `Bearer ${u.access_token}`
                }
            })
            store.dispatch("contacts/setAllUsers", r.data.Data ? r.data.Data : [])
        } catch (e) {
            if (e.response?.status === 401){
                return "reload"
            } else {
                toast.error(e.response.data.Message)
            }
        }
        return r
    }

    async findObject(text){
        let r
        let u = store.get("user").user
        try{
            r = await instance.get(`/search?text=${text}`, {
                headers: {
                    "Authorization": `Bearer ${u.access_token}`
                }
            })
            store.dispatch("contacts/setFindResult", r.data.data)
        } catch (e) {
            if (e.response?.status === 401){
                return "reload"
            } else {
                toast.error(e.response.data.Message)
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
                    "Authorization": `Bearer ${u.access_token}`
                }
            })
            store.dispatch("contacts/setActiveChatMembers", r.data.data)
        } catch (e) {
            if (e.response?.status === 401){
                return "reload"
            } else {
                toast.error(e.response.data.Message)
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
                    "Authorization": `Bearer ${u.access_token}`
                }
            })
            await new controller().getChatMembers(id)
        } catch (e) {
            console.log(e)
            if (e.response?.status === 401){
                return "reload"
            } else {
                toast.error(e.response.data.Message)
            }
        }
        return r
    }

    async sendMedia(data){
        let r
        let u = store.get("user").user
        let formData = new FormData();
        formData.append("media", data);
        try{
            r = await instance.post(`/files/`, formData, {
                headers: {
                    "Authorization": `Bearer ${u.access_token}`,
                    "Content-Type": "multipart/form-data",
                }
            })
        } catch (e) {
            if (e.response?.status === 401){
                return "reload"
            } else {
                toast.error(e.response.data.Message)
            }
        }
        return r
    }

    async sendVoice(data){
        let r
        let u = store.get("user").user
        let formData = new FormData();
        formData.append("media", data, `voice_${makeid(4)}.mp3`);
        try{
            r = await instance.post(`/files/`, formData, {
                headers: {
                    "Authorization": `Bearer ${u.access_token}`,
                    "Content-Type": "multipart/form-data",
                }
            })
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

export default  () => {
    return new controller();
}