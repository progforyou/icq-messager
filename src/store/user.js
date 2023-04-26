import { createStoreon } from 'storeon'

// Initial state, reducers and business logic are packed in independent modules
export let user = store => {
    // Initial state
    store.on('@init', () => ({ user: {access_token: "", login: "", admin_access_token: ""} }))
    store.on('user/setAccessToken', ({ user }, access_token) => {
        return { user: {...user, access_token: access_token }}
    })
    store.on('user/setAdminAccessToken', ({ user }, admin_access_token) => {
        return { user: {...user, admin_access_token: admin_access_token }}
    })
    store.on('user/setLogin', ({ user }, login) => {
        return { user: {...user, login: login }}
    })
}