import React from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Main from "./layouts/Main";
import Admin from "./views/Admin";
import SignIn from "./views/SignIn";
import {useStoreon} from "storeon/react";
import {useCookies} from "react-cookie";

export default () => {
    const { dispatch, customize, user } = useStoreon('customize', 'user')
    const [cookies, setCookie] = useCookies(['access_token', 'refresh_token', 'login']);
    React.useEffect(() => {
        if (user.access_token !== cookies.access_token) {
            dispatch("user/setAccessToken", cookies.access_token)
        }
        if (user.refresh_token !== cookies.refresh_token) {
            dispatch("user/setRefreshToken", cookies.refresh_token)
        }
        if (user.login !== cookies.login) {
            dispatch("user/setLogin", cookies.login)
        }
    }, [cookies.access_token, cookies.refresh_token, cookies.login])
    
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
                    <Route path="/admin" component={Admin} />
                    <Route path="/chat" component={Main} />
                </Switch>
            </BrowserRouter>
        </>
    )
}