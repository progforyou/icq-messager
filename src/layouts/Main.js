import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import Navbar from "../components/Navbars/Navbar.js";
import Sidebar from "../components/Sidebar/Sidebar.js";

// views

import Chat from "../views/Chat";
import useWebSocket from "react-use-websocket";
import {useCookies} from "react-cookie";
import {useHistory} from "react-router";

export default function Main() {
    let history = useHistory();
    const [cookies, setCookie] = useCookies(['access_token','login']);
    React.useEffect(() => {
        if (!(cookies.access_token && cookies.login)){
            history.push("/signIn");
        }
    }, [])
    
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <Navbar />
        {/* Header */}
        <div className="w-full">
          <Switch>
                <Route path="/chat" exact component={Chat} />
          </Switch>
        </div>
      </div>
    </>
  );
}
