import React from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Main from "./layouts/Main";
import Admin from "./views/Admin";
import SignIn from "./views/SignIn";
import {useStoreon} from "storeon/react";
import SignUp from "./views/SignUp";

export default () => {
    const { dispatch, customize } = useStoreon('customize')
    function handleWindowSizeChange() {
        dispatch("customize/width", window.innerWidth)
    }
    React.useEffect(() => {
        handleWindowSizeChange()
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);
    return (
        <>
            <BrowserRouter>
                <Switch>
                    {/* add routes with layouts */}
                    <Route path="/signIn" component={SignIn} />
                    <Route path="/signUp" component={SignUp} />
                    <Route path="/admin" component={Admin} />
                    <Route path="/" component={Main} />
                    <Redirect from="*" to="/" />
                </Switch>
            </BrowserRouter>
        </>
    )
}