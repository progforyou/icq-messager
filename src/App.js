import React from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Main from "./layouts/Main";
import Admin from "./views/Admin";
import SignIn from "./views/SignIn";
import {useStoreon} from "storeon/react";
import {useCookies} from "react-cookie";
import SignInAdmin from "./views/SignInAdmin";

export default () => {
    const { dispatch, customize, user } = useStoreon('customize', 'user')
    const [cookies, setCookie] = useCookies(['access_token', 'refresh_token', 'login']);
    React.useEffect(() => {
        if (user.admin_access_token !== cookies.admin_access_token) {
            dispatch("user/setAccessToken", cookies.admin_access_token)
        }
        if (user.admin_refresh_token !== cookies.admin_refresh_token) {
            dispatch("user/setRefreshToken", cookies.admin_refresh_token)
        }
        if (user.login !== cookies.login) {
            dispatch("user/setLogin", cookies.login)
        }
    }, [cookies.admin_access_token, cookies.admin_refresh_token, cookies.admin_login])
    
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
                    <Route path="/admin" exact component={Admin} />
                    <Route path="/admin/signIn" exact component={SignInAdmin} />
                    <Route path="/chat" component={Main} />
                    <Redirect to={"/chat"} exact />
                </Switch>
            </BrowserRouter>
        </>
    )
}