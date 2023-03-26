import React from "react";
import ReactDOM from "react-dom";

export const DeleteTimerMW = (props) => {
    const [state, setState] = React.useState({date: ""})
    const ref = React.useRef(null);
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
        props.onSubmit(state.date)
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
                            <input type="datetime-local" id="date" name="date"></input>
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
                        <div className={"flex py-4 px-4 font-w"}>
                            Введите время, после которого ваше сообщение удалится
                        </div>
                    </div>
                </div>
            </div>
            <div className="top-0 left-0 h-screen w-full fixed inset-0 flex justify-center items-start bg-black opacity-50 text-base z-40 overflow-hidden"></div>
        </>, document.getElementById("modal")
    )
}