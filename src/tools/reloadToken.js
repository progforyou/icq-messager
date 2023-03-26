import Controller from "../controller/controller";

export const reloadTokenController = async (setCookie, callback, ...data) => {
    let r = await callback(...data)
    if (r === "reload"){
        r = await Controller().reloadToken()
        if (r === "reload"){
            setCookie('access_token', "");
            setCookie('refresh_token', "");
            setCookie('login', "");
        } else {
            setCookie('access_token', r.data.access);
            setCookie('refresh_token', r.data.refresh);
        }
        r = await callback(...data)
        if (r === "reload"){
            setCookie('access_token', "");
            setCookie('refresh_token', "");
            setCookie('login', "");
        }
    }
    return r
}