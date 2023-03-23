import React from "react";

// components

import {ChatInput} from "../components/Chat/ChatInput";
import {ChatBody} from "../components/Chat/ChatBody";
import {useStoreon} from "storeon/react";
import useWebSocket from "react-use-websocket";

const WS_URL = 'ws://127.0.0.1:8000/chat';
export default function Chat(props) {
    const { dispatch, contacts } = useStoreon('contacts')
    React.useEffect(() => {
        if (contacts.active === 0){
            return  null
        }
    }, [contacts.active])


    useWebSocket(`${WS_URL}/${contacts.active}/`, {
        onOpen: () => {
            console.log('WebSocket connection established.');
        },
        retryOnError: true,
        onMessage: (event) => {
            let data = JSON.parse(event.data)
            console.log(data)
        }
    });
    
  return (
    <div style={{height: "100vh", paddingTop: "50px"}} className={"flex flex-col pb-4"}>
        <ChatBody/>
        <ChatInput/>
    </div>
  );
}
