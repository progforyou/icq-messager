import React, {createRef} from "react";
import {useStoreon} from "storeon/react";
import ReactDOM from "react-dom";
import {EllipsisSpinner} from "../Spinners/Ellipsis";
import {DeleteTimerMW} from "../Modal/DeleteTimer";
import {messages} from "../../store/messages";

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
        <div className={"flex w-full relative"} onContextMenu={(e) => {
            e.preventDefault(); // prevent the default behaviour when right clicked
            console.log("Right Click");
        }}>
            <div className={"mr-auto relative mb-3 rounded-lg pl-4 pr-12 py-4 float-right bg-lightBlue-500 w-auto"} style={{maxWidth: "70%"}}>
                <TypeSwitcher {...props}/>
                <div className={"absolute bottom-0 right-0 mr-2 mb-2 text-blueGray-300"} style={{fontSize: "13px"}}>
                    22.15
                </div>
            </div>
        </div>
    )
}


const MessageOut = (props) => {
    return (
        <div className={"flex w-full relative"}>
            <div className={"ml-auto relative mb-3 rounded-lg pl-4 pr-12 py-4 float-right bg-lightBlue-500 w-auto"} style={{maxWidth: "70%"}}>
                <TypeSwitcher {...props}/>
                <div className={"absolute bottom-0 right-0 mr-2 mb-2 text-blueGray-300"} style={{fontSize: "13px"}}>
                    22.15
                </div>
            </div>
        </div>
    )
}

const Message = (props) => {
    return <div className={"w-full"} onContextMenu={props.onContextMenu}>
        {props.messageIn ? <MessageIn {...props}/> :  <MessageOut {...props}/>}
    </div>
}

const Menu = (props) => {
    return ReactDOM.createPortal(
        <div className={"absolute bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"} style={{top: props.points.y, left: props.points.x}}>
                <ul className={"flex flex-col p-1"}>
                    <li className={"hover:bg-blueGray-200 py-2 px-3 cursor-pointer whitespace-nowrap"}>
                        <i className={"fa fa-pen w-5 h-5 mr-2"}></i> Редактировать
                    </li>
                    <li  className={"hover:bg-blueGray-200 py-2 px-3 cursor-pointer whitespace-nowrap"}>
                        <i className={"fa fa-trash w-5 h-5 mr-2"}></i> Удалить
                    </li>
                    <li  className={"hover:bg-blueGray-200 py-2 px-3 cursor-pointer whitespace-nowrap"}>
                        <i className={"fa fa-clock w-5 h-5 mr-2"}></i> Удалить по таймеру
                    </li>
                </ul>
        </div>,
        document.body
    );
}

export const ChatBody = (props) => {
    const { dispatch, contacts, messages } = useStoreon('contacts', 'messages')
    const [clicked, setClicked] = React.useState(false)
    const [points, setPoints] = React.useState({x: 0, y: 0})
    const ref = createRef()
    const onContextMenu = (e) => {
        e.preventDefault(); 
        setClicked(true)
        console.log(e)
        setPoints({x: e.pageX, y: e.pageY})
    }
    const handleClick = () => setClicked(false);
    const loadMessages = () => {
        console.log("load")
    }
    React.useEffect(() => {
        loadMessages()
    }, [contacts.active])
    React.useEffect(() => {
        window.addEventListener("click", handleClick);
        window.addEventListener("contextmenu", (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setClicked(false)
            }
        });
        return () => {
            window.removeEventListener("click", handleClick);
            window.addEventListener("contextmenu", (event) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    setClicked(false)
                }
            });
        };
    }, []);
    return (
        <div style={{height: "calc(100vh - 50px - 50px)"}}>
            <div className={"h-full w-full flex"} style={{flexDirection: "column-reverse"}}>
                {messages && messages?.length === 0 ? <div className={"m-auto"}>
                    Здесь пока пусто...
                </div> : <div ref={ref} className={"w-full flex text-black overflow-y-auto"} style={{flexDirection: "column-reverse", paddingRight: "10px"}}>
                    {messages.map(e => {
                        return <Message onContextMenu={onContextMenu} messageIn  typeMessage={"text"} body={"very very very very very very very very very very very very very very very very very very very very MessageOut"}/>
                    })}
                    {/*<div className={"mx-auto"}>
                        <EllipsisSpinner/>
                    </div>*/}
                </div> }
            </div>
            {/*<DeleteTimerMW onHide={onHide}/>*/}
            {clicked && (<Menu points={points}/>
            )}
        </div>
    )
}