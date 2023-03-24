import { createStoreon } from 'storeon'

// Initial state, reducers and business logic are packed in independent modules
export let admin = store => {
    // Initial state
    store.on('@init', () => ({ admin: {list: []} }))
    // Reducers returns only changed part of the state
    store.on('admin/setUsers', ({ admin }, contactsAll) => {
        return { admin: {...admin, list: contactsAll} }
    })
}