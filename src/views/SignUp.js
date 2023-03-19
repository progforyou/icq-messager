import React from "react";
import { Link } from "react-router-dom";
import {useHistory} from "react-router";

export default function SignUp() {
    const [state, setState] = React.useState({
        login: "",
        password: "",
        private_password: "",
        name: "",
        surname: "",
        role: "1"
    })
    const [error, setError] = React.useState("")
    let history = useHistory();

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
    const onSubmit = (e) => {
        state.role = Number(state.role)
        e.preventDefault();
        console.log(state)
        history.push("/");
    }
    return (
        <>
            <div className="container mx-auto px-4 h-full" style={{height: "100vh"}}>
                <div className="flex content-center items-center justify-center h-full">
                    <div className="w-full lg:w-4/12 px-4">
                        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                                <div className="text-blueGray-400 text-center mb-3 font-bold">
                                    <small>Регистрация</small>
                                </div>
                                <form onSubmit={onSubmit}>
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
                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
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
                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
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
                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            placeholder="Фамилия"
                                        />
                                    </div>

                                    <div className="relative w-full mb-3">
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
                                            className={"border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"}
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
                                            className={"border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"}
                                            placeholder="Пароль"
                                        />
                                    </div>
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
                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
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
                                            disabled={error.length > 0}
                                        >
                                            Зарегистрироваться
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
