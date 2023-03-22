import React from "react";
import ReactDOM from "react-dom";

import 'react-toastify/dist/ReactToastify.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/styles/tailwind.css";
import "./assets/styles/main.css"
import { StoreContext } from 'storeon/react'
import { CookiesProvider } from 'react-cookie';

import App from "./App";
import {store} from "./store";
import {ToastContainer} from "react-toastify";

ReactDOM.render(
    <CookiesProvider>
        <StoreContext.Provider value={store}>
          <App/>
          <ToastContainer />
        </StoreContext.Provider>
    </CookiesProvider>,
  document.getElementById("root")
);
