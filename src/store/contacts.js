import { createStoreon } from 'storeon'

// Initial state, reducers and business logic are packed in independent modules
export let contacts = store => {
    // Initial state
    store.on('@init', () => ({ contacts: {list: [
                {id: -1, title: "Избранное"},
                {id: 1, title: "Николай"},
                {id: 2, title: "Мария"},
                {id: 3, title: "qweqeqwe"}
            ], active: -1} }))
    // Reducers returns only changed part of the state
    store.on('contacts/addChat', ({ contacts }, contact) => {
        return { contacts: {...contacts, list: contacts.list.concat([contact])} }
    })
    store.on('contacts/setActive', ({ contacts }, active) => {
        return { contacts: {...contacts, active: active }}
    })
}