import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import Navbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// views

import Chat from "../views/Chat";

export default function Main() {
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
