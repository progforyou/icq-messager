import React from "react";

// components

import CardTable from "../components/Cards/CardTable.js";
import {useCookies} from "react-cookie";
import {useHistory} from "react-router";
import Controller from "../controller/controller";
import AdminController from "../controller/adminController";
import {reloadTokenController} from "../tools/reloadToken";

export default function Admin() {
    let history = useHistory();
    const [cookies, setCookie] = useCookies(['access_token', 'refresh_token', 'login']);
    React.useEffect(() => {
        if (!(cookies.admin_access_token && cookies.admin_refresh_token)){
            history.push("/admin/signIn");
        }

        reloadTokenController(setCookie, AdminController().getUsers)
    }, [])
    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <CardTable />
                </div>
            </div>
        </>
    );
}
