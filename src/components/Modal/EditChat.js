import React from "react";
import ReactDOM from "react-dom";
import MD5 from "crypto-js/md5";

const getText = (x) => {
    if (x === 1){
        return `Вы единственный подписчик канала`
    }
    if (x === 2 || x === 3 || x === 4 ){
        return `${x} Пользователя`
    }

    if (x % 10 === 1 && x !== 11 ){
        return `${x} Пользователь`
    }
    return `${x} Пользователей`
}

export const getColorIdentity = (contactName) => {
    const hc = hashCodeIdentity(contactName) % 360;
    return `hsl(${hc}, 63%, 60%)`
}

const hashCodeIdentity = (s) => {
    s = MD5(s).toString()
    let h = 0, l = s.length, i = 0;
    if (l > 0)
        while (i < l)
            h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
};
export const EditChatMW = (props) => {
    const ref = React.useRef(null);
    const [showAddUser, setShowAddUser] = React.useState(false)
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target) && !showAddUser) {
                props.onHide()
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
    const onAddUser = async (data) =>{
        await props.handleAddUser(data)
        setShowAddUser(false)
    }
    const activeUsersIds = props.activeMembers.map(e => e.id)
    return ReactDOM.createPortal(
        <>
            <div
                className={`top-0 left-0 w-full h-screen flex justify-center items-top overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none `}>
                <div style={{maxWidth: "500px"}} className="w-full mt-48 relative my-16 mx-auto max-w-3xl">
                    <div ref={ref}
                         className="border-0 rounded-lg bg-white shadow-md relative flex flex-col w-full bg-white outline-none focus:outline-none pb-6">
                        <div className={`flex items-center justify-between py-3 px-4 border-b border-solid border-gray-light rounded-t `}>
                            <div className={"font-bold"}>
                                {props.data.title}
                            </div>
                            <button
                                className="p-1 ml-auto bg-transparent border-0 transition-all text-blueGray-600 hover:text-blueGray-500 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={props.onHide}
                            >
                            <span
                                className="bg-transparent h-4 w-4 text-2xl block outline-none focus:outline-none">
                              <i className={"fa fa-times"}/>
                            </span>
                            </button>
                        </div>
                        <div className={"flex py-4 px-4 font-w w-full"}>
                            {showAddUser ? <AddUserMW onSubmit={onAddUser}/> : 
                            <div className="relative w-full mb-3">
                                <div className="block text-blueGray-600 items-center font-bold mb-2 flex justify-between">
                                    <span className={"uppercase text-xs"}>
                                        {getText(props.activeMembers.length)}
                                    </span>
                                    <span>
                                        <i onClick={() => setShowAddUser(true)} className={"fa fa-user-plus hover:text-blueGray-500 cursor-pointer"}></i>
                                    </span>
                                </div>
                                <ul className={"w-full"}>
                                    {props.allUsers.filter(e => activeUsersIds.includes(e.id) ).map((e, key) => {
                                        return (
                                            <div key={key} className={"flex items-center mt-2"}>
                                                <div className={"w-10 h-10 mr-2 rounded-full flex"} style={{backgroundColor: getColorIdentity(e.name + e.surname)}}>
                                                    <span className={"m-auto uppercase"}>
                                                      {e.name[0]+e.surname[0]}
                                                    </span>
                                                </div>
                                                {e.name} {e.surname}
                                            </div>
                                        )
                                    })}
                                    <div key={`key-${activeUsersIds.length}`} className={"flex items-center mt-2"}>
                                        <div className={"w-10 h-10 mr-2 rounded-full flex"} style={{backgroundColor: getColorIdentity("Вы")}}>
                                                    <span className={"m-auto uppercase"}>
                                                      Вы
                                                    </span>
                                        </div>
                                        Вы
                                    </div>
                                </ul>
                            </div> }
                                
                        </div>
                    </div>
                </div>
            </div>
            <div className="top-0 left-0 h-screen w-full fixed inset-0 flex justify-center items-start bg-black opacity-50 text-base z-40 overflow-hidden"></div>
        </>, document.getElementById("modal")
    )
}

const AddUserMW = (props) => {
    const [state, setState] = React.useState({user: ""})
    const onSubmit = (e) => {
        e.preventDefault()
        props.onSubmit(state)
    }
    const changeForm = (e) => {
        setState( {...state,[e.target.name]: e.target.value})
    }
    return (
        <form onSubmit={onSubmit} className={"w-full"}>
            <div className="relative w-full mb-3">
                <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                >
                    Имя пользователя
                </label>
                <input
                    type="text"
                    name={"user"}
                    value={state.user}
                    onChange={changeForm}
                    className="w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Введите имя пользователя"
                />
            </div>

            <div className="text-center mt-6">
                <button
                    className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                    type="submit"
                >
                    Добавить пользователя
                </button>
            </div>
        </form>
    )
}