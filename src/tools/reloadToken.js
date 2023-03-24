import Controller from "../controller/controller";

export const reloadTokenController = async (setCookie, callback, ...data) => {
    let r = await callback(...data)
    if (r === "reload"){
        r = await Controller().reloadToken()
        setCookie('access_token', r.data.access);
        setCookie('refresh_token', r.data.refresh);
        console.log(r)
        return await callback(...data)
    }
    return r
}