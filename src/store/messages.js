import { createStoreon } from 'storeon'

// Initial state, reducers and business logic are packed in independent modules
export let messages = store => {
    // Initial state
    store.on('@init', () => ({ messages: [] }))
    // Reducers returns only changed part of the state
    store.on('messages/add', ({ messages }, message) => {
        return { messages: messages.concat([message]) }
    })
}