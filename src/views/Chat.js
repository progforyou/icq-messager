import React from "react";

// components

import {ChatInput} from "../components/Chat/ChatInput";
import {ChatBody} from "../components/Chat/ChatBody";

export default function Chat() {
  return (
    <div style={{height: "calc(100vh - 50px)"}} className={"flex flex-col pb-4"}>
        <ChatBody/>
        <ChatInput/>
    </div>
  );
}
