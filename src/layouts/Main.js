import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import Navbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";

// views

import Chat from "../views/Chat";
import useWebSocket from "react-use-websocket";
const WS_URL = 'ws://127.0.0.1:8000';

export default function Main() {
    useWebSocket(WS_URL, {
        onOpen: () => {
            console.log('WebSocket connection established.');
        }
    });
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <Navbar />
        {/* Header */}
        <div className="px-4 w-full">
          <Switch>
            <Route path="/chat" exact component={Chat} />
              <Redirect from="*" to="/chat" />
          </Switch>
        </div>
      </div>
    </>
  );
}
