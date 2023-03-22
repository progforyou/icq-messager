import React from "react";

// components

import CardTable from "../components/Cards/CardTable.js";
import {useCookies} from "react-cookie";
import {useHistory} from "react-router";

export default function Admin() {
    let history = useHistory();
    const [cookies, setCookie] = useCookies(['access_token', 'refresh_token', 'login']);
    React.useEffect(() => {
        if (!(cookies.access_token && cookies.refresh_token && cookies.login)){
            history.push("/signIn");
        }
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
