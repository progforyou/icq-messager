import React from "react";

// components

import {ChatInput} from "../components/Chat/ChatInput";
import {ChatBody} from "../components/Chat/ChatBody";
import {useStoreon} from "storeon/react";

export default function Chat() {
    const { dispatch, contacts } = useStoreon('contacts')
    if (contacts.active === 0){
        return  null
    }
  return (
    <div style={{height: "100vh", paddingTop: "50px"}} className={"flex flex-col pb-4"}>
        <ChatBody/>
        <ChatInput/>
    </div>
  );
}
