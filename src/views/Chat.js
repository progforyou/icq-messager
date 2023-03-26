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

const WS_URL = 'ws://127.0.0.1:8000/chat';
export default function Chat(props) {
    const { dispatch, contacts } = useStoreon('contacts')
    const [state, setState] = React.useState({message: "", files: [], prevMessage: ""})
    const [isEdit, setIsEdit] = React.useState(false)
    const [cookies, setCookie] = useCookies(['access_token', 'refresh_token', 'login']);
    if (contacts.active !== 0){}
    const { lastJsonMessage, sendJsonMessage } = useWebSocket(`${WS_URL}/${contacts.active}/?token=${cookies.access_token}`, {
        retryOnError: false,
        onClose: () => {
            
        },
        onMessage: (e) => {
            let d = JSON.parse(e.data)
            if (d.data?.message){
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
    
    React.useEffect(() => {
        reloadTokenController(setCookie, Controller().getChats)
    }, [])
    
    React.useEffect(async () => {
        reloadTokenController(setCookie, Controller().getChatMembers, contacts.active)
        reloadTokenController(setCookie, Controller().getChatMessages)
    }, [contacts.active])
    
    async function getMessages (){
        return reloadTokenController(setCookie, Controller().getChatMessages)
    }

    async function handleSendMessage() {
        if (state.files.length > 0){
            let data = {files: state.files}
            let r = await reloadTokenController(setCookie, Controller().sendMedia, data)
            console.log(r)
            //id here
            //and create message with ID
        }
        sendJsonMessage({
            event: 'create_message',
            content: {
                text: state.message,
                access_token: cookies.access_token
            }
        });
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
                access_token: cookies.access_token
            }
        });
        dispatch("messages/delete", id)
    }

    function handleEditMessage() {
        sendJsonMessage({
            event: 'edit_message',
            content: {
                message_id: state.id,
                text: state.message,
                access_token: cookies.access_token
            }
        });
        dispatch("messages/edit", state)
        setIsEdit(false)
        setState({...state, message: "", prevMessage: ""})
    }

    function onEditMessage(id, text) {
        setState({...state, message: text, prevMessage: text, id: id})
        setIsEdit(true)
    }
    
  return (
    <div style={{height: "100vh", paddingTop: "50px", overflowY: "hidden"}} className={"flex flex-col pb-4"}>
        {contacts.active === 0 ? <div className={"m-auto"}>Выберите чат</div> : <>
        <ChatBody getMessages={getMessages} handleDeleteMessage={handleDeleteMessage} handleEditMessage={onEditMessage}/>
        <ChatInput deleteFile={deleteFile}  handleFiles={handleFiles} isEdit={isEdit} onCancelEdit={() => setIsEdit(false)} state={state} setMessage={m => setState({...state, message: m})} onSend={handleSendMessage} onEditMessage={handleEditMessage}/>
        </> }
    </div>
  );
}
