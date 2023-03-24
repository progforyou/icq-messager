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
    const [cookies, setCookie] = useCookies(['access_token', 'refresh_token', 'login']);
    if (contacts.active !== 0){}
    const { lastJsonMessage, sendJsonMessage } = useWebSocket(`${WS_URL}/${contacts.active}/?token=${cookies.access_token}`, {
        retryOnError: false,
        onClose: () => {
            
        },
        onMessage: (e) => {
            let d = JSON.parse(e.data)
            if (d.messages?.messages){
                dispatch("messages/set", d.messages.messages)
            }
        }
    });
    
    React.useEffect(() => {
        reloadTokenController(setCookie, Controller().getChats)
    }, [])
    
    React.useEffect(async () => {
        reloadTokenController(setCookie, Controller().getChatMembers, contacts.active)
    }, [contacts.active])

    function handleSendMessage(data) {
        sendJsonMessage({
            event: 'create_message',
            content: data
        });
    }
    
  return (
    <div style={{height: "100vh", paddingTop: "50px"}} className={"flex flex-col pb-4"}>
        {contacts.active === 0 ? <div className={"m-auto"}>Выберите чат</div> : <>
        <ChatBody/>
        <ChatInput onSend={handleSendMessage}/>
        </> }
    </div>
  );
}
