import React from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Main from "./layouts/Main";
import Admin from "./views/Admin";
import Login from "./views/auth/Login";

export default () => {
    return (
        <>
            <BrowserRouter>
                <Switch>
                    {/* add routes with layouts */}
                    <Route path="/login" component={Login} />
                    <Route path="/admin" component={Admin} />
                    <Route path="/" component={Main} />
                    <Redirect from="*" to="/" />
                </Switch>
            </BrowserRouter>
        </>
    )
}