import React from "react";
import { Link } from "react-router-dom";
import {useHistory} from "react-router";
import Controller from "../controller/controller";
import {useCookies} from "react-cookie";
import {reloadTokenController} from "../tools/reloadToken";
import AdminController from "../controller/adminController";

export default function SignInAdmin() {
  const [state, setState] = React.useState({
    login: "",
    password: "",
    client: "",
    from: "admin"
  })
  let history = useHistory();
  const [cookies, setCookie] = useCookies(['admin_access_token', 'admin_refresh_token']);

  React.useEffect(() => {
    if (cookies.admin_access_token && cookies.admin_refresh_token){
      history.push("/admin");
    }
  }, [])
  
  const changeForm = (e) => setState({...state, [e.target.name]: e.target.value})
  const onSubmit = async (e) => {
    e.preventDefault();
    state.client = getBrowserName()
    console.log(state)
    let r = await Controller().signIn(state)
    if (r && r.status === 201){
      setCookie('admin_access_token', r.data.data.access_token);
      setCookie('admin_refresh_token', r.data.data.refresh_token);
      history.push("/admin");
    }
  }

  const getBrowserName = () => {
    let browserInfo = window.navigator.userAgent;
    let browser;
    if (browserInfo.includes('Opera') || browserInfo.includes('Opr')) {
      browser = 'Opera';
    } else if (browserInfo.includes('Edg')) {
      browser = 'Edge';
    } else if (browserInfo.includes('Chrome')) {
      browser = 'Chrome';
    } else if (browserInfo.includes('Safari')) {
      browser = 'Safari';
    } else if (browserInfo.includes('Firefox')) {
      browser = 'Firefox'
    } else {
      browser = 'unknown'
    }
    return browser;
  }
  return (
    <>
      <div className="container mx-auto px-4 h-full" style={{height: "100vh"}}>
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-blueGray-400 text-center mb-3 font-bold">
                  <small>Вход в панель администратора</small>
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
