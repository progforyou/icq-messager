import React, {createRef} from "react";
import {useStoreon} from "storeon/react";
import ReactDOM from "react-dom";
import {EllipsisSpinner} from "../Spinners/Ellipsis";
import InfiniteScroll from 'react-infinite-scroll-component';
import {DeleteTimerMW} from "../Modal/DeleteTimer";
import {getFileName} from "../../tools/other";
import Waveform from "../Wave/Wave";



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
    if (props.data.path.match(/\.(jpg|jpeg|png|gif)$/i)){
        return (
            <a target="_blank" href={`/media/${props.data.path}`}>
                <img style={{maxWidth: "225px", maxHeight: "200px"}} className={props.id > 1 ? "mt-3" : ""} src={`/media/${props.data.path}`} alt={"image"}></img>
            </a>
        )
    }
    if (props.data.path.match(/\.(mp3|wav)$/i)){
        return <Waveform targetWave={`wave_${Math.random().toString(36).slice(-8)}`} targetTrack={`track_${Math.random().toString(36).slice(-8)}`} url={`/media/${props.data.path}`}/>
        /*return <audio style={{maxWidth: "100%"}}
            controls
            src={`/media/${props.data.path}`}>
        </audio>*/
    }
    return (
        <>
            <div className={"mr-2"} style={{textOverflow: "ellipsis", width: "100%", overflow: "none"}}>{getFileName(`/media/${props.data.path}`)}</div>
            <a target="_blank" href={`/media/${props.data.path}`}>
                <i className={"fa fa-file text-3xl cursor-pointer"}></i>
            </a>
        </>
    )
}

const MessageFile = (props) => {
    let user = props.users.find(e => e.id === props.message.user_id)
    return (<div>
        <div className={"text-sm text-blueGray-600 font-bold"}>
            {user ? user.name + " " + user.surname : "Вы"}
        </div>
        {props.message.media.map((e, key) => {
            return <FileTyper id={key} key={key} data={e}/>
        })}
        {props.message.text ? props.message.text : null}
    </div>)
}

const MessageText = (props) => {
    let user = props.users.find(e => e.id === props.message.user_id)
    return (<div className={""}>
        <div className={"text-sm text-blueGray-600 font-bold"}>
            {user ? user.name + " " + user.surname : "Вы"}
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
            <div className={"mr-auto relative mb-3 rounded-lg pl-4 pr-12 py-4 float-right bg-lightBlue-500 w-auto"} style={{maxWidth: props.isMobile ? "90%" : "70%"}}>
                <TypeSwitcher {...props}/>
                <div className={"absolute bottom-0 right-0 mr-2 mb-2 text-blueGray-300"} style={{fontSize: "13px"}}>
                    {startTime(props.message.create_at)}
                </div>
            </div>
        </div>
    )
}


const MessageOut = (props) => {
    return (
        <div className={"flex w-full relative"}>
            <div className={"ml-auto relative mb-3 rounded-lg pl-4 pr-12 py-4 float-right bg-lightBlue-500 w-auto"} style={{maxWidth: props.isMobile ? "90%" : "70%"}}>
                <TypeSwitcher {...props}/>
                <div className={"absolute bottom-0 right-0 mr-2 mb-2 text-blueGray-300"} style={{fontSize: "13px"}}>
                    {startTime(props.message.create_at)}
                </div>
            </div>
        </div>
    )
}

const MessageInContainer = (props) => {
    return <div className={"w-full prevent-select"}>
        <MessageIn {...props}/>
    </div>
}

const MessageOutContainer = (props) => {
    return <div className={"w-full prevent-select"} onTouchEnd={props.clearTouchTimer} onTouchCancel={props.clearTouchTimer} onTouchMove={props.clearTouchTimer} onTouchStart={props.onContextMenuIos} onContextMenu={props.onContextMenu}>
        <MessageOut {...props}/>
    </div>
}

const Menu = (props) => {
    let styles = {}
    if (props.points.x === 0 && props.points.y === 0) return null
    if ((window.innerWidth / 2) < props.points.x){
        styles.left = props.points.x - (props.isMobile ? 160 : 206)
    } else {
        styles.left = props.points.x
    }
    if ((window.innerHeight / 2) < props.points.y){
        styles.top = props.points.y - (props.isMobile ? 103 : 136)
    } else {
        styles.top = props.points.y
    }
    let isFile = props.messages.find(e => e.id === props.activeMessage).media?.length
    return ReactDOM.createPortal(
        <div className={"absolute bg-white z-50 float-left py-2 list-none text-left rounded shadow-lg " + (props.isMobile ? "text-xs " : "text-base min-w-48")} style={styles}>
                <ul className={"flex flex-col p-1"}>
                    {isFile ? null : <>
                    <li onClick={props.onEdit} className={"hover:bg-blueGray-200 cursor-pointer whitespace-nowrap " + (props.isMobile ? "py-1 px-2" : "py-2 px-3")}>
                        <i className={"fa fa-pen w-5 h-5 mr-2"}></i> Редактировать
                    </li>
                    </>}
                    <li onClick={props.onDelete} className={"hover:bg-blueGray-200 cursor-pointer whitespace-nowrap " + (props.isMobile ? "py-1 px-2" : "py-2 px-3")}>
                        <i className={"fa fa-trash w-5 h-5 mr-2"}></i> Удалить
                    </li>
                    <li onClick={props.onDeleteTimer}  className={"hover:bg-blueGray-200 cursor-pointer whitespace-nowrap " + (props.isMobile ? "py-1 px-2" : "py-2 px-3")}>
                        <i className={"fa fa-clock w-5 h-5 mr-2"}></i> Удалить по таймеру
                    </li>
                </ul>
        </div>,
        document.body
    );
}

export const ChatBody = (props) => {
    const { dispatch, contacts, messages, user, customize } = useStoreon('contacts', 'messages', 'user', 'customize')
    const [clicked, setClicked] = React.useState(false)
    const [activeMessage, setActiveMessage] = React.useState(null)
    const [points, setPoints] = React.useState({x: 0, y: 0})
    const [hasMore, setHasMore] = React.useState(true)
    const ref = React.useRef(null)
    const touchTimer = React.useRef(null)
    const [deleteTimer, setDeleteTimer] = React.useState(false)

    const onContextMenu = (id) => {
        return (e) => {
            e.preventDefault();
            setClicked(true)
            setActiveMessage(id)
            setPoints({x: e.pageX, y: e.pageY})
        }
    }
    
    const startContextMenuOnTouch = (id, e) => {
        setClicked(true)
        setActiveMessage(id)
        setPoints({x: e.touches[0].clientX, y: e.touches[0].clientY})
    }
    const onContextMenuIos = (id) => {
        return (e) => {
            if (!customize.isMobile) return
            var iOS = !window.MSStream && /iPad|iPhone|iPod/.test(navigator.userAgent);
            if (!iOS){
                return;
            }
            clearTouchTimer()
            touchTimer.current = setTimeout( startContextMenuOnTouch.bind(null, id, e) , 1000 );
        }
    }
    
    React.useEffect(() => {
        return clearTouchTimer
    }, [])
    const clearTouchTimer = () => {
        if (touchTimer.current) clearTimeout(touchTimer.current)
    }
    const handleClick = () => {
        setClicked(false);
    }
    const onDelete = () => {
        props.handleDeleteMessage(activeMessage)
        setPoints({x: 0, y: 0})
        setActiveMessage(null)
    }
    const handleDeleteTimer = (date) => {
        props.handleDeleteMessageTimer(activeMessage, date)
        setPoints({x: 0, y: 0})
        setActiveMessage(null)
    }
    const onEdit = () => {
        props.handleEditMessage(activeMessage, messages.list.find(e => e.id === activeMessage).text)
        setPoints({x: 0, y: 0})
        setActiveMessage(null)
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
                 id="scrollableDiv" className={"w-full flex overflow-y-auto text-black px-4"} style={{flex: "1 1", flexDirection: "column-reverse", paddingRight: "30px"}}>
                {messages.list && messages?.list?.length === 0 ? <div className={"m-auto"}>
                    Здесь пока пусто...
                </div> : <>
                <InfiniteScroll
                    dataLength={messages.list.length}
                    next={loadMessages}
                    style={{ display: 'flex', flexDirection: 'column-reverse', overflowX: "hidden", paddingBottom: "40px" }} 
                    inverse={true} 
                    hasMore={hasMore}
                    loader={<div className={"mx-auto"}>
                        <EllipsisSpinner/>
                    </div>}
                    scrollableTarget="scrollableDiv"
                >
                    {[...messages.list].map((e, key) => {
                        let typeMessage = e.media?.length ? "file" : "text"
                        let userData = JSON.parse(atob(user.access_token.split('.')[1]))
                        let messageIn = e.user_id !== userData.user_id
                        if (e.type === "devider"){
                            return <div key={key} className={"pb-3 pt-3 mx-auto text-blueGray-600 text-sm"}>{toDate(e.date)}</div>
                        }
                        if (messageIn){
                            return <MessageInContainer users={contacts.allUsers} key={key} message={e} messageIn={messageIn} typeMessage={typeMessage} body={e.text}/>
                        }
                        return <MessageOutContainer clearTouchTimer={clearTouchTimer} isMobile={customize.isMobile} users={contacts.allUsers} key={key} message={e} onContextMenuIos={onContextMenuIos(e.id)} onContextMenu={onContextMenu(e.id)} messageIn={messageIn} typeMessage={typeMessage} body={e.text}/>
                    })}
                </InfiniteScroll>
                </>}
                {!hasMore ? <div className={"py-6"}></div> : null}

                {deleteTimer ? <DeleteTimerMW onSubmit={handleDeleteTimer} onHide={() => setDeleteTimer(false)}/> : null}
                {clicked && (<Menu isMobile={customize.isMobile} messages={messages.list} activeMessage={activeMessage} points={points} onDeleteTimer={() => setDeleteTimer(true)} onDelete={onDelete} onEdit={onEdit}/>)}
            </div>
    )
}
