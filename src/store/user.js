import { createStoreon } from 'storeon'

// Initial state, reducers and business logic are packed in independent modules
export let user = store => {
    // Initial state
    store.on('@init', () => ({ user: {access_token: "", refresh_token: "", login: ""} }))
    store.on('user/setAccessToken', ({ user }, access_token) => {
        return { user: {...user, access_token: access_token }}
    })
    store.on('user/setRefreshToken', ({ user }, refresh_token) => {
        return { user: {...user, refresh_token: refresh_token }}
    })
    store.on('user/setLogin', ({ user }, login) => {
        return { user: {...user, login: login }}
    })
}