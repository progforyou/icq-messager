import { createStoreon } from 'storeon'

// Initial state, reducers and business logic are packed in independent modules
export let contacts = store => {
    // Initial state
    store.on('@init', () => ({ contacts: {list: [], active: 0, activeChat: 0, activeData: {}, activeMembers: {}, find: [], activeType: "", findStr: ""} }))
    // Reducers returns only changed part of the state
    store.on('contacts/addChat', ({ contacts }, contact) => {
        return { contacts: {...contacts, list: contacts.list.concat([contact])} }
    })
    store.on('contacts/set', ({ contacts }, contactsAll) => {
        return { contacts: {...contacts, list: contactsAll} }
    })
    store.on('contacts/setActive', ({ contacts }, active) => {
        return { contacts: {...contacts, active: active, activeData: contacts.list.find(e => e.id === active) }}
    })
    store.on('contacts/setActiveChatMembers', ({ contacts }, activeMembers) => {
        return { contacts: {...contacts, activeMembers: {...activeMembers} }}
    })
    store.on('contacts/setActiveData', ({ contacts }, activeData) => {
        return { contacts: {...contacts, activeData: {...activeData} }}
    })
    store.on('contacts/setFindResult', ({ contacts }, data) => {
        return { contacts: {...contacts, find: data }}
    })
    store.on('contacts/setActiveType', ({ contacts }, activeType) => {
        return { contacts: {...contacts, activeType: activeType }}
    })
    store.on('contacts/clear', ({ contacts }, t) => {
        return { contacts: {list: [], active: 0, activeData: {}, activeMembers: {}, find: [], activeType: "", activeChat: 0} }
    })
    store.on('contacts/activeChat', ({ contacts }, activeChat) => {
        return { contacts: {...contacts, activeChat: activeChat }}
    })
    store.on('contacts/setFindStr', ({ contacts }, findStr) => {
        return { contacts: {...contacts, findStr: findStr }}
    })
} 