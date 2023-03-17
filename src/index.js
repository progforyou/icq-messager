import React from "react";
import ReactDOM from "react-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";
import "assets/styles/main.css"
import { StoreContext } from 'storeon/react'

import App from "./App";
import {store} from "./store";

ReactDOM.render(
    <StoreContext.Provider value={store}>
  <App/>
    </StoreContext.Provider>,
  document.getElementById("root")
);
