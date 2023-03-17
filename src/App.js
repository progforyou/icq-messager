import React from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Main from "./layouts/Main";
import Auth from "./layouts/Auth";

export default () => {
    return (
        <>
            <BrowserRouter>
                <Switch>
                    {/* add routes with layouts */}
                    <Route path="/" component={Main} />
                    <Route path="/auth" component={Auth} />
                    {/* add routes without layouts */}
                    <Redirect from="*" to="/" />
                </Switch>
            </BrowserRouter>
        </>
    )
}