import React from "react";
import ReactDOM from "react-dom";

export const CreateChatMW = (props) => {
    const ref = React.useRef(null);
    const [state, setState] = React.useState({title: ""})
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                props.onHide()
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
    const onSubmit = (e) => {
        e.preventDefault()
        props.onSubmit(state)
    }
    const changeForm = (e) => {
        setState( {...state,[e.target.name]: e.target.value})
    }
    return ReactDOM.createPortal(
        <>
            <div
                className={`top-0 left-0 w-full h-screen flex justify-center items-top overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none `}>
                <div style={{maxWidth: "500px"}} className="w-full mt-48 relative my-16 mx-auto max-w-3xl">
                    <div ref={ref}
                         className="border-0 rounded-lg bg-white shadow-md relative flex flex-col w-full bg-white outline-none focus:outline-none pb-6">
                        <div className={`flex items-start justify-between py-3 px-4 border-b border-solid border-gray-light rounded-t `}>
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
                            <form onSubmit={onSubmit} className={"w-full"}>
                                <div className="relative w-full mb-3">
                                    <label
                                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                        htmlFor="grid-password"
                                    >
                                        Имя группы
                                    </label>
                                    <input
                                        type="text"
                                        name={"title"}
                                        value={state.title}
                                        onChange={changeForm}
                                        className="w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        placeholder="Имя группы"
                                    />
                                </div>

                                <div className="text-center mt-6">
                                    <button
                                        className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                        type="submit"
                                    >
                                        Создать чат
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="top-0 left-0 h-screen w-full fixed inset-0 flex justify-center items-start bg-black opacity-50 text-base z-40 overflow-hidden"></div>
        </>, document.getElementById("modal")
    )
}