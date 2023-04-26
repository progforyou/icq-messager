import Controller from "../controller/controller";
import AdminController from "../controller/adminController";

export const reloadTokenController = async (setCookie, callback, ...data) => {
    let r = await callback(...data)
    if (r === "reload"){
        r = await Controller().reloadToken()
        if (r === "reload"){
            setCookie('access_token', "");
            setCookie('login', "");
        } else {
            setCookie('access_token', r.data.access_token);
        }
        r = await callback(...data)
        if (r === "reload"){
            setCookie('access_token', "");
            setCookie('login', "");
        }
    }
    return r
}

export const reloadAdminTokenController = async (setCookie, callback, ...data) => {
    let r = await callback(...data)
    if (r === "reload"){
        r = await AdminController().reloadToken()
        if (r === "reload"){
            setCookie('admin_access_token', "");
        } else {
            setCookie('access_token', r.data.access_token);
        }
        r = await callback(...data)
        if (r === "reload"){
            setCookie('admin_access_token', "");
        }
    }
    return r
}