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
import {useHistory} from "react-router";
//http://213.189.201.22/
//const WS_URL = `wss://${window.location.hostname}/ws/`;
const WS_URL = `wss://chat.salekhov.ru/ws/`;
//const WS_URL = 'wss://127.0.0.1:8000/chat';
function _Chat(props) {
    const { dispatch, contacts, customize } = useStoreon('contacts', 'customize')
    const [state, setState] = React.useState({message: "", files: [], prevMessage: "", prevFiles: []})
    const [isEdit, setIsEdit] = React.useState(false)
    const [cookies, setCookie] = useCookies(['access_token', 'login']);
    const { lastJsonMessage, sendJsonMessage } = useWebSocket(`${WS_URL}?token=${cookies.access_token}`, {
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
        //reloadTokenController(setCookie, Controller().getChatMembers, contacts.active)
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
                ids.push({id: r.data.id})
            }
            //id here
            //and create message with ID
            sendJsonMessage({
                event: 'create_message',
                content: {
                    media: ids,
                    text: state.message,
                    chat_id: contacts.active
                }
            });
            setState({...state, message: "", prevMessage: "", files: []})
        } else {
            sendJsonMessage({
                event: 'create_message',
                content: {
                    text: state.message,
                    chat_id: contacts.active
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
                "delete_at": new Date().toISOString(),
                chat_id: contacts.active
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
                "delete_at": new Date().toISOString(),
                chat_id: contacts.active
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
                chat_id: contacts.active
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
                chat_id: contacts.active
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

export default function Chat(props) {
    const { dispatch, contacts } = useStoreon('contacts')
    const [cookies, setCookie] = useCookies(['access_token', 'login']);
    const history = useHistory();
    React.useEffect(() => {
        reloadTokenController(setCookie, Controller().getChats)
    }, [])

    React.useEffect(() => {
        if (!cookies.access_token){
            history.push("/signIn");
        }
    }, [cookies.access_token])


    if (contacts.active === 0){
        return <div style={{height: "100vh", paddingTop: "50px", overflowY: "hidden"}} className={"flex flex-col pb-4"}>
            <div className={"m-auto"}>Выберите чат</div>
        </div>
    }
    return <_Chat {...props}/>
}
