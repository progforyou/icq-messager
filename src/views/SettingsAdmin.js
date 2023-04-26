import React from "react";

// components

import CardTable from "../components/Cards/CardTable.js";
import {useCookies} from "react-cookie";
import {useHistory} from "react-router";
import AdminController from "../controller/adminController";
import {reloadTokenController} from "../tools/reloadToken";
import AdminNavbar from "../components/Navbars/AdminNavbar";

export default function SettingsAdmin() {
    const [state, setState] = React.useState({private_password: ""})
    let history = useHistory();
    const [cookies, setCookie] = useCookies(['access_token']);
    React.useEffect(() => {
        if (!(cookies.admin_access_token)){
            history.push("/admin/signIn");
        }

    }, [])
    const onSubmit = (e) => {
        e.preventDefault()

        reloadTokenController(setCookie, AdminController().updateAdmin, state)
    }
    return (
        <>
            <AdminNavbar/>
            <div className="flex flex-wrap mt-4 h-screen">
                <div className="w-full mt-12 px-4">
                    <div className="w-full px-4 flex">
                        <div className="relative lg:w-4/12 mx-auto flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                                <div className="text-blueGray-400 text-center mb-3 font-bold">
                                    <small>Изменить пароль</small>
                                </div>
                                <form onSubmit={onSubmit}>
                                    <div className="relative w-full mb-3">
                                        <label
                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                            htmlFor="grid-password"
                                        >
                                            Пароль
                                        </label>
                                        <input
                                            type="text"
                                            name={"private_password"}
                                            value={state.private_password}
                                            onChange={e => setState({...state, [e.target.name]: e.target.value})}
                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            placeholder="Пароль"
                                        />
                                    </div>
                                    
                                    <div className="text-center mt-6">
                                        <button
                                            className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                            type="submit"
                                        >
                                            Изменить
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
