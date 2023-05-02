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
const WS_URL = `wss://bichiko.ru/ws/`;
//const WS_URL = 'wss://127.0.0.1:8000/chat';
function _Chat(props) {
    const {sendJsonMessage} = props;
    const { dispatch, contacts, customize } = useStoreon('contacts', 'customize')
    const [state, setState] = React.useState({message: "", files: [], prevMessage: "", prevFiles: []})
    const [isEdit, setIsEdit] = React.useState(false)
    const [cookies, setCookie] = useCookies(['access_token', 'login']);
    
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
                ids.push({id: r.data.id, path: r.data.path})
            }
            //id here
            //and create message with ID
            sendJsonMessage({
                type: 'create_message',
                message: {
                    media: ids,
                    text: state.message,
                    chat_id: contacts.active
                }
            });
            setState({...state, message: "", prevMessage: "", files: []})
        } else {
            sendJsonMessage({
                type: 'create_message',
                message: {
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
            type: 'delete_message',
            message: {
                id: id,
                chat_id: contacts.active
            }
        });
    }
    
    const toPythonStr = (date) => {
        return `${(date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))}/${(date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())}/${date.getFullYear()} ${(date.getHours() > 8) ? (date.getHours() + 1) : ('0' + (date.getHours() + 1))}:${(date.getMinutes() > 8) ? (date.getMinutes() + 1) : ('0' + (date.getMinutes() + 1))}:00`
    }

    function handleDeleteTimerMessage(id, date) {
        sendJsonMessage({
            type: 'delete_message',
            message: {
                id: id,
                "delete_at": new Date(date).toUTCString(),
                chat_id: contacts.active
            }
        });
    }
    
    async function sendRecord(file){
        console.log(file)
        let r = await reloadTokenController(setCookie, Controller().sendVoice, file)
        sendJsonMessage({
            type: 'create_message',
            message: {
                text: "",
                media: [{id: r.data.id, path: r.data.path}],
                chat_id: contacts.active
            }
        });
    }

    function handleEditMessage() {
        let media = state.prevFiles.map(e => ({id:e.id}))
        sendJsonMessage({
            type: 'edit_message',
            message: {
                id: state.id,
                text: state.message,
                chat_id: contacts.active
            }
        });
        setIsEdit(false)
        setState({...state, message: "", prevMessage: "", prevFiles: []})
    }

    function onEditMessage(id, text) {
        setState({...state, message: text, prevMessage: text, id: id})
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
    const { lastJsonMessage, sendJsonMessage } = useWebSocket(`${WS_URL}?token=${cookies.access_token}`, {
        retryOnError: false,
        onClose: () => {

        },
        onMessage: (e) => {
            let d = JSON.parse(e.data)
            console.log(d)
            if (d.Type === "delete_message"){
                dispatch("messages/delete", d.Message)
                return
            }
            if (d.Type === "create_message"){
                dispatch("messages/add", d.Message)
                return
            }
            if (d.Type === "edit_message"){
                dispatch("messages/edit", d.Message)
                return;
            }
            if (d.Event === "open"){
                reloadTokenController(setCookie, Controller().getChats)
                return;
            }
            if (d.Event === "close"){
                reloadTokenController(setCookie, Controller().getChats)
                return;
            }
        }
    });
    const loadAll = async () => {
        await reloadTokenController(setCookie, Controller().getChats)
        await reloadTokenController(setCookie, Controller().getAllUsers)
    }
    React.useEffect(() => {
        loadAll()
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
    return <_Chat sendJsonMessage={sendJsonMessage} {...props}/>
}
