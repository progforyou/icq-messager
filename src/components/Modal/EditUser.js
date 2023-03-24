import React from "react";
import {toast} from "react-toastify";
import Controller from "../../controller/controller";
import AdminController from "../../controller/adminController";
import ReactDOM from "react-dom";

export const EditUserMW = (props) => {
    const ref = React.useRef(null);
    const [state, setState] = React.useState({
        login: "",
        password: "",
        private_password: "",
        name: "",
        surname: "",
        role: "1",
        id: 0
    })
    React.useEffect(() => {
        setState({...state, ...props.data})
        console.log(props.data)
    }, [props.data])
    const [error, setError] = React.useState("")
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
    const changeForm = (e) => {
        if (e.target.name === "password" || e.target.name === "private_password"){
            setError("")
        }
        setState({...state, [e.target.name]: e.target.value})
    }
    const onBlur = () => {
        if (state.password === state.private_password){
            setError("Пароли не должны совпадать!")
        }
    }
    const onSubmit = async (e) => {
        state.role = Number(state.role)
        e.preventDefault();
        console.log(state)
        props.onSubmit(state)
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
                                        htmlFor="login"
                                    >
                                        Логин
                                    </label>
                                    <input
                                        id={"login"}
                                        type="text"
                                        name={"login"}
                                        required
                                        value={state.login}
                                        onChange={changeForm}
                                        className="w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        placeholder="Логин"
                                    />
                                </div>

                                <div className="relative w-full mb-3">
                                    <label
                                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                        htmlFor="name"
                                    >
                                        Имя
                                    </label>
                                    <input
                                        id={"name"}
                                        type="text"
                                        name={"name"}
                                        required
                                        value={state.name}
                                        onChange={changeForm}
                                        className="w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        placeholder="Имя"
                                    />
                                </div>

                                <div className="relative w-full mb-3">
                                    <label
                                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                        htmlFor="surname"
                                    >
                                        Фамилия
                                    </label>
                                    <input
                                        id={"surname"}
                                        type="text"
                                        name={"surname"}
                                        required
                                        value={state.surname}
                                        onChange={changeForm}
                                        className="w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        placeholder="Фамилия"
                                    />
                                </div>

                                {/*<div className="relative w-full mb-3">
                                    <label
                                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                        htmlFor="private_password"
                                    >
                                        Приватный пароль
                                    </label>
                                    <input
                                        onBlur={onBlur}
                                        id={"private_password"}
                                        type="password"
                                        required
                                        name={"private_password"}
                                        value={state.private_password}
                                        onChange={changeForm}
                                        className={"w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"}
                                        placeholder="Приватный пароль"
                                    />
                                </div>

                                <div className="relative w-full mb-3">
                                    <label
                                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                        htmlFor="password"
                                    >
                                        Пароль
                                    </label>
                                    <input
                                        onBlur={onBlur}
                                        id={"password"}
                                        required
                                        type="password"
                                        name={"password"}
                                        value={state.password}
                                        onChange={changeForm}
                                        className={"w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"}
                                        placeholder="Пароль"
                                    />
                                </div>*/}
                                <label
                                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                    htmlFor="role"
                                >
                                    Роль
                                </label>
                                <select id="role"
                                        name={"role"}
                                        onChange={changeForm}
                                        value={state.role}
                                        className="w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                                    <option value={"1"}>Пользователь</option>
                                    <option value="2">Админ</option>
                                    <option value="3">Владелец</option>
                                </select>
                                {error.length > 0 &&
                                    <span className='text-sm mt-1' style={{color: "red"}}>{error}</span>}
                                <div className="text-center mt-6">
                                    <button
                                        className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                        type="submit"
                                    >
                                        Изменить пользователя
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