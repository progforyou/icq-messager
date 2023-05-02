import React from "react";

// components

import CardTable from "../components/Cards/CardTable.js";
import {useCookies} from "react-cookie";
import {useHistory} from "react-router";
import Controller from "../controller/controller";
import AdminController from "../controller/adminController";
import {reloadAdminTokenController, reloadTokenController} from "../tools/reloadToken";
import AdminNavbar from "../components/Navbars/AdminNavbar";
import {useStoreon} from "storeon/react";

export default function Admin() {
    const [cookies, setCookie] = useCookies(['admin_access_token', 'admin_login']);
    const { dispatch, user } = useStoreon('user')
    let history = useHistory();
    React.useEffect(() => {
        reloadAdminTokenController(setCookie, AdminController().getUsers)
    }, [user.admin_access_token])
    React.useEffect(() => {
        if (!(cookies.admin_access_token)){
            history.push("/admin/signIn");
            return
        }
    }, [cookies.admin_access_token])
    return (
        <>
            <AdminNavbar/>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <CardTable />
                </div>
            </div>
        </>
    );
}
