import React from "react";
import {useStoreon} from "storeon/react";

const MessageFile = (props) => {
    return (<div><span className={"mr-2"}>loger.txt</span>
        <i className={"fa fa-file text-3xl cursor-pointer"}></i>
    </div>)
}

const MessageText = (props) => {
    return (<div>
        {props.body}
    </div>)
}

const TypeSwitcher = (props) => {
    switch (props.typeMessage){
        case "text":
            return <MessageText {...props}/>
        case "file":
            return <MessageFile {...props}/>
    }
    return <></>
}

const MessageIn = (props) => {
    return (
    <div className={"mr-auto relative mb-3 rounded-lg pl-4 pr-12 py-4 float-right bg-lightBlue-500 w-auto"} style={{maxWidth: "70%"}}>
        <TypeSwitcher {...props}/>
        <div className={"absolute bottom-0 right-0 mr-2 mb-2 text-blueGray-300"} style={{fontSize: "13px"}}>
            22.15
        </div>
    </div>
    )
}


const MessageOut = (props) => {
    return (
        <div className={"ml-auto relative mb-3 rounded-lg pl-4 pr-12 py-4 float-right bg-lightBlue-500 w-auto"} style={{maxWidth: "70%"}}>
            <TypeSwitcher {...props}/>
            <div className={"absolute bottom-0 right-0 mr-2 mb-2 text-blueGray-300"} style={{fontSize: "13px"}}>
                22.15
            </div>
        </div>
    )
}

export const ChatBody = (props) => {
    const { dispatch, contacts } = useStoreon('contacts')
    const loadMessages = () => {
        console.log("load")
    }
    React.useEffect(() => {
        loadMessages()
    }, [contacts.active])
    return (
        <div style={{height: "calc(100vh - 50px - 50px)"}}>
            <div className={"h-full w-full flex text-black"} style={{flexDirection: "column-reverse", paddingRight: "10px"}}>
                <MessageOut typeMessage={"text"} body={"very very very very very very very very very very very very very very very very very very very very MessageOut"}/>
                <MessageIn typeMessage={"text"} body={"very very very very very very very very very very very very very very very very very very very very MessageIn"}/>
                <MessageIn typeMessage={"file"} body={"qwe"}/>
            </div>
        </div>
    )
}