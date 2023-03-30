import React from "react";

// components

import {ChatInput} from "../components/Chat/ChatInput";
import {ChatBody} from "../components/Chat/ChatBody";
import {useStoreon} from "storeon/react";
import useWebSocket from "react-use-websocket";
import Controller from "../controller/controller";
import {useCookies} from "react-cookie";
import {reloadTokenController} from "../tools/reloadToken";
import AdminController from "../controller/adminController";
import {store} from "../store";
//http://213.189.201.22/
const WS_URL = 'ws://127.0.0.1:8000/chat';
//const WS_URL = 'ws://213.189.201.22:8000/chat';
function _Chat(props) {
    const { dispatch, contacts, customize } = useStoreon('contacts', 'customize')
    const [state, setState] = React.useState({message: "", files: [], prevMessage: "", prevFiles: []})
    const [isEdit, setIsEdit] = React.useState(false)
    const [cookies, setCookie] = useCookies(['access_token', 'refresh_token', 'login']);
    const { lastJsonMessage, sendJsonMessage } = useWebSocket(`${WS_URL}/${contacts.active}/?access_token=${cookies.access_token}`, {
        retryOnError: false,
        onClose: () => {
            
        },
        onMessage: (e) => {
            let d = JSON.parse(e.data)
            if (d.data?.message){
                if (d.data?.message.is_deleted){
                    dispatch("messages/delete", d.data.message)
                    return
                }
                if (d.data?.message.updated_at){
                    dispatch("messages/edit", d.data.message)
                    return
                }
                dispatch("messages/add", d.data.message)
            }
        }
    });
    const handleFiles = (files) => {
        setState({...state, files: [...state.files, ...files]})
    }
    
    const deleteFile = (id) => {
        setState({...state, files: state.files.filter((e, key) => key !== id)})
    }
    const deleteFilePrev = (id) => {
        setState({...state, prevFiles: state.prevFiles.filter((e, key) => key !== id)})
    }
    
    React.useEffect(async () => {
        reloadTokenController(setCookie, Controller().getChatMembers, contacts.active)
        reloadTokenController(setCookie, Controller().getChatMessages)
    }, [contacts.active])
    
    async function getMessages (){
        return reloadTokenController(setCookie, Controller().getChatMessages)
    }

    async function handleSendMessage() {
        if (state.files.length > 0){
            let ids = []
            for (let file of state.files) {
                let r = await reloadTokenController(setCookie, Controller().sendMedia, file)
                ids.push({id: r.data.data.id})
            }
            //id here
            //and create message with ID
            sendJsonMessage({
                event: 'create_message',
                content: {
                    media: ids,
                    text: state.message,
                    access_token: cookies.access_token
                }
            });
            setState({...state, message: "", prevMessage: "", files: []})
        } else {
            sendJsonMessage({
                event: 'create_message',
                content: {
                    text: state.message,
                    access_token: cookies.access_token
                }
            });
        }
    }
    
    React.useEffect(() => {
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                setState({...state, message: "", prevMessage: ""})
                setIsEdit(false)
            }
        }, false);
        return document.removeEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                setState({...state, message: "", prevMessage: ""})
                setIsEdit(false)
            }
        }, false);
    }, [])
    
    React.useEffect(() => {
        setState({...state, message: "", prevMessage: ""})
    }, [contacts.active])

    function handleDeleteMessage(id) {
        sendJsonMessage({
            event: 'delete_message',
            content: {
                id: id,
                when: "now",
                access_token: cookies.access_token
            }
        });
    }
    
    const toPythonStr = (date) => {
        return `${(date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))}/${(date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())}/${date.getFullYear()} ${(date.getHours() > 8) ? (date.getHours() + 1) : ('0' + (date.getHours() + 1))}:${(date.getMinutes() > 8) ? (date.getMinutes() + 1) : ('0' + (date.getMinutes() + 1))}:00`
    }

    function handleDeleteTimerMessage(id, date) {
        sendJsonMessage({
            event: 'delete_message',
            content: {
                id: id,
                when: toPythonStr(new Date(date)),
                access_token: cookies.access_token
            }
        });
    }
    
    async function sendRecord(file){
        let r = await reloadTokenController(setCookie, Controller().sendVoice, file)
        sendJsonMessage({
            event: 'create_message',
            content: {
                text: "",
                media: [{id: r.data.data.id}],
                access_token: cookies.access_token
            }
        });
    }

    function handleEditMessage() {
        let media = state.prevFiles.map(e => ({id:e.id}))
        sendJsonMessage({
            event: 'edit_message',
            content: {
                id: state.id,
                media: media,
                text: state.message,
                access_token: cookies.access_token
            }
        });
        setIsEdit(false)
        setState({...state, message: "", prevMessage: "", prevFiles: []})
    }

    function onEditMessage(id, text, files) {
        setState({...state, message: text, prevMessage: text, id: id, prevFiles: files})
        setIsEdit(true)
    }
    if (contacts.active === 0 && customize.isMobile){
        return null
    }
  return (
    <div style={{height: "100vh", paddingTop: "50px", overflowY: "hidden"}} className={"flex flex-col pb-4"}>
        {contacts.active === 0 ? <div className={"m-auto"}>Выберите чат</div> : <>
        <ChatBody handleDeleteMessageTimer={handleDeleteTimerMessage} getMessages={getMessages} handleDeleteMessage={handleDeleteMessage} handleEditMessage={onEditMessage}/>
        <ChatInput sendRecord={sendRecord} deleteFilePrev={deleteFilePrev} deleteFile={deleteFile}  handleFiles={handleFiles} isEdit={isEdit} onCancelEdit={() => setIsEdit(false)} state={state} setMessage={m => setState({...state, message: m})} onSend={handleSendMessage} onEditMessage={handleEditMessage}/>
        </> }
    </div>
  );
}

const hasUser = (data, uid) => {
    for (let datum of data) {
        for (let member of datum.members) {
            if (member.user === uid){
                return true
            }
        }
    }
    return false
}

const getChat = (data, uid) => {
    for (let datum of data) {
        for (let member of datum.members) {
            if (member.user === uid){
                return datum
            }
        }
    }
    return null
}

export default function Chat(props) {
    const { dispatch, contacts } = useStoreon('contacts')
    const [cookies, setCookie] = useCookies(['access_token', 'refresh_token', 'login']);
    const [wait, setWait] = React.useState(false)
    React.useEffect(() => {
        reloadTokenController(setCookie, Controller().getChats)
    }, [])
    console.log(contacts.list.members)
    React.useEffect(async () => {
        if (contacts.active !== 0) {
            console.log(contacts)
            if (Object.keys(contacts.find).length && contacts.findStr) {
                setWait(true)
                if (contacts.activeType === "private") {
                    let u = contacts.find.user.users.find(e => e.id === contacts.active)
                    if (hasUser(contacts.list, u.id)){
                        let chat = getChat(contacts.list, u.id)
                        dispatch("contacts/setFindStr", "")
                        store.dispatch("contacts/setActive", chat.id)
                        setWait(false)
                        return
                    }
                    let r = await reloadTokenController(setCookie, Controller().createChat, {title: `${u.name} ${u.surname}`})
                    await reloadTokenController(setCookie, Controller().addChatMember, r.data.data.id, {user: u.login, type: "public"})
                    await reloadTokenController(setCookie, Controller().getChats)
                    dispatch("contacts/setFindStr", "")
                    store.dispatch("contacts/setActive", r.data.data.id)
                    setWait(false)
                }
            }
        }
    }, [contacts.active])


    if (contacts.active === 0 && !contacts.findStr){
        return <div style={{height: "100vh", paddingTop: "50px", overflowY: "hidden"}} className={"flex flex-col pb-4"}>
        </div>
    }
    if (wait){
        return null
    }
    return <_Chat {...props}/>
}
