import React from "react";
import { Link } from "react-router-dom";
import {useHistory} from "react-router";

export default function SignIn() {
  const [state, setState] = React.useState({
    login: "",
    password: ""
  })
  let history = useHistory();
  
  const changeForm = (e) => setState({...state, [e.target.name]: e.target.value})
  const onSubmit = (e) => {
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
                  <small>Вход</small>
                </div>
                <form onSubmit={onSubmit}>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Логин
                    </label>
                    <input
                      type="text"
                      name={"login"}
                      value={state.login}
                      onChange={changeForm}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Логин"
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Пароль
                    </label>
                    <input
                      type="password"
                      name={"password"}
                      value={state.password}
                      onChange={changeForm}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Пароль"
                    />
                  </div>

                  <div className="text-center mt-6">
                    <button
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Войти
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
