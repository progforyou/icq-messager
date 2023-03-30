import React, {createRef} from "react";
import {useStoreon} from "storeon/react";
import ReactDOM from "react-dom";
import {EllipsisSpinner} from "../Spinners/Ellipsis";
import InfiniteScroll from 'react-infinite-scroll-component';
import {DeleteTimerMW} from "../Modal/DeleteTimer";
import {useHistory} from "react-router";
import {NavLink} from "react-router-dom";
import {getFileName} from "../../tools/other";



function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function startTime(date) {
    let newDate = new Date(date)
    var h = newDate.getHours();
    var m = newDate.getMinutes();
    // add a zero in front of numbers<10
    h = checkTime(h);
    m = checkTime(m);
    return `${h}:${m}`
}

var fulldays = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
var months = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];


function toDate(someDateTimeStamp) {
    var dt = new Date(someDateTimeStamp),
        date = dt.getDate(),
        month = months[dt.getMonth()],
        timeDiff = someDateTimeStamp - Date.now(),
        diffDays = new Date().getDate() - date,
        diffMonths = new Date().getMonth() - dt.getMonth(),
        diffYears = new Date().getFullYear() - dt.getFullYear();

    if(diffYears === 0 && diffDays === 0 && diffMonths === 0){
        return "Сегодня";
    }else if(diffYears === 0 && diffDays === 1) {
        return "Вчера";
    }else if(diffYears === 0 && diffDays === -1) {
        return "Завтра";
    }else if(diffYears === 0 && (diffDays < -1 && diffDays > -7)) {
        return fulldays[dt.getDay()];
    }else if (diffYears >= 1){
        return date + " " + month + ", " + new Date(someDateTimeStamp).getFullYear();
    }else {
        return date + " " + month;
    }
}

const FileTyper = (props) => {
    if (props.data.file.match(/\.(jpg|jpeg|png|gif)$/i)){
        return (
            <NavLink target="_blank" to={props.data.url}>
                <img style={{maxWidth: "300px", maxHeight: "200px"}} className={props.id > 1 ? "mt-3" : ""} src={`${props.data.url}`} alt={"image"}></img>
            </NavLink>
        )
    }
    if (props.data.file.match(/\.(mp3|wav)$/i)){
        return <audio src={`${props.data.url}`}  />
    }
    return (
        <>
            <span className={"mr-2"}>{getFileName(props.data.url)}</span>
            <NavLink target="_blank" to={props.data.url}>
                <i className={"fa fa-file text-3xl cursor-pointer"}></i>
            </NavLink>
        </>
    )
}

const MessageFile = (props) => {
    return (<div>
        {props.message.media.media.map((e, key) => {
            return <FileTyper id={key} key={key} data={e}/>
        })}
        {props.message.text ? props.message.text : null}
    </div>)
}

const MessageText = (props) => {
    return (<div className={""}>
        <div className={"text-sm text-blueGray-600 font-bold"}>
            {props.message.user_name + " " + props.message.user_surname}
        </div>
        <div>
            {props.body}
        </div>
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
                    {startTime(props.message.created_at)}
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
                    {startTime(props.message.created_at)}
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
    let styles = {}
    if ((window.innerWidth / 2) < props.points.x){
        styles.left = props.points.x - 206
    } else {
        styles.left = props.points.x
    }
    if ((window.innerHeight / 2) < props.points.y){
        styles.top = props.points.y - 136
    } else {
        styles.top = props.points.y
    }
    
    return ReactDOM.createPortal(
        <div className={"absolute bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"} style={styles}>
                <ul className={"flex flex-col p-1"}>
                    <li onClick={props.onEdit} className={"hover:bg-blueGray-200 py-2 px-3 cursor-pointer whitespace-nowrap"}>
                        <i className={"fa fa-pen w-5 h-5 mr-2"}></i> Редактировать
                    </li>
                    <li onClick={props.onDelete} className={"hover:bg-blueGray-200 py-2 px-3 cursor-pointer whitespace-nowrap"}>
                        <i className={"fa fa-trash w-5 h-5 mr-2"}></i> Удалить
                    </li>
                    <li onClick={props.onDeleteTimer}  className={"hover:bg-blueGray-200 py-2 px-3 cursor-pointer whitespace-nowrap"}>
                        <i className={"fa fa-clock w-5 h-5 mr-2"}></i> Удалить по таймеру
                    </li>
                </ul>
        </div>,
        document.body
    );
}

export const ChatBody = (props) => {
    const { dispatch, contacts, messages, user } = useStoreon('contacts', 'messages', 'user')
    const [clicked, setClicked] = React.useState(false)
    const [activeMessage, setActiveMessage] = React.useState(null)
    const [points, setPoints] = React.useState({x: 0, y: 0})
    const [hasMore, setHasMore] = React.useState(true)
    const ref = React.useRef(null)
    const [deleteTimer, setDeleteTimer] = React.useState(false)

    const onContextMenu = (id) => {
        return (e) => {
            e.preventDefault();
            setClicked(true)
            setActiveMessage(id)
            setPoints({x: e.pageX, y: e.pageY})
        }
    }
    const handleClick = () => setClicked(false);
    const onDelete = () => {
        props.handleDeleteMessage(activeMessage)
    }
    const handleDeleteTimer = (date) => {
        props.handleDeleteMessageTimer(activeMessage, date)
    }
    const onEdit = () => {
        props.handleEditMessage(activeMessage, messages.list.find(e => e.id === activeMessage).text, messages.list.find(e => e.id === activeMessage).media.media)
    }
    
    const loadMessages = async () => {
        if (Math.ceil(messages.total / messages.perPage) <= messages.page){
            setHasMore(false)
            return 
        }
        dispatch("messages/addPaginate")
        return props.getMessages()
    }
    React.useEffect(() => {
        setHasMore(true)
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
            <div ref={ref}
                 id="scrollableDiv" className={"w-full flex overflow-y-auto text-black"} style={{flex: "1 1", flexDirection: "column-reverse", paddingRight: "10px"}}>
                {messages.list && messages?.list?.length === 0 ? <div className={"m-auto"}>
                    Здесь пока пусто...
                </div> : <>
                <InfiniteScroll
                    dataLength={messages.list.length}
                    next={loadMessages}
                    style={{ display: 'flex', flexDirection: 'column-reverse' }} 
                    inverse={true} //
                    hasMore={hasMore}
                    loader={<div className={"mx-auto"}>
                        <EllipsisSpinner/>
                    </div>}
                    scrollableTarget="scrollableDiv"
                >
                    {[...messages.list].map((e, key) => {
                        let typeMessage = e.media?.media?.length ? "file" : "text"
                        let messageIn = e.user_login !== user.login
                        console.log(e.user_login, user)
                        if (e.type === "devider"){
                            return <div key={key} className={"pb-3 pt-3 mx-auto text-blueGray-600 text-sm"}>{toDate(e.date)}</div>
                        }
                        if (messageIn){
                            return <Message key={key} message={e} onContextMenu={() => {}} messageIn={messageIn} typeMessage={typeMessage} body={e.text}/>
                        }
                        return <Message key={key} message={e} onContextMenu={onContextMenu(e.id)} messageIn={messageIn} typeMessage={typeMessage} body={e.text}/>
                    })}
                </InfiniteScroll>
                </>}
                {!hasMore ? <div className={"py-6"}></div> : null}

                {deleteTimer ? <DeleteTimerMW onSubmit={handleDeleteTimer} onHide={() => setDeleteTimer(false)}/> : null}
                {clicked && (<Menu points={points} onDeleteTimer={() => setDeleteTimer(true)} onDelete={onDelete} onEdit={onEdit}/>)}
            </div>
    )
}