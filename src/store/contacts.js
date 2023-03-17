import { createStoreon } from 'storeon'

// Initial state, reducers and business logic are packed in independent modules
export let contacts = store => {
    // Initial state
    store.on('@init', () => ({ contacts: {list: [
                {id: -1, name: "Избранное"},
                {id: 1, name: "Николай"},
                {id: 2, name: "Мария"},
                {id: 3, name: "qweqeqwe"}
            ], active: -1} }))
    // Reducers returns only changed part of the state
    store.on('contacts/add', ({ contacts }, contact) => {
        return { contacts: {...contacts, list: contacts.list.concat([contact])} }
    })
    store.on('contacts/setActive', ({ contacts }, active) => {
        return { contacts: {...contacts, active: active }}
    })
}