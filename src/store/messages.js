import { createStoreon } from 'storeon'

// Initial state, reducers and business logic are packed in independent modules
export let messages = store => {
    // Initial state
    store.on('@init', () => ({ messages: {list: [], page: 1, total: 1, perPage: 50} }))
    store.on('messages/delete', ({ messages }, message) => {
        let newData = []
        let date = new Date().getDate()
        let oldData = messages.list.concat().filter(e => e.type !== "devider" && e.id !== message.id)
        for (const item of oldData) {
            let diffDays = date - new Date(item.create_at).getDate()
            if (diffDays >= 1) {
                newData.push({type: "devider", date: item.create_at})
                date = new Date(item.create_at).getDate()
            }
            newData.push(item)
        }
        return {messages: {...messages, list: newData}}
    })
    // Reducers returns only changed part of the state
    store.on('messages/add', ({ messages }, message) => {
        console.log(message, messages.list, messages.list.find(e => e.id === message.id)?.id)
        if (messages.list.find(e => e.id === message.id)?.id) {
            return {messages: messages}
        }
            let newData = []
            let date = new Date().getDate()
            let oldData = messages.list.concat().filter(e => e.type !== "devider")
            oldData.unshift(message)
            for (const item of oldData) {
                let diffDays = date - new Date(item.create_at).getDate()
                if (diffDays >= 1) {
                    newData.push({type: "devider", date: item.create_at})
                    date = new Date(item.create_at).getDate()
                }
                newData.push(item)
            }
            return {messages: {...messages, list: newData}}
        })
    store.on('messages/set', ({ messages }, messagesAll) => {
        let newData = []
        let date = new Date().getDate()
        let oldData = messages.list.concat(messagesAll).filter(e => e.type !== "devider")
        for (const item of oldData) {
            let diffDays = date - new Date(item.create_at).getDate()
            if (diffDays >= 1){
                newData.push({type: "devider", date: item.create_at})
                date = new Date(item.create_at).getDate()
            }
            newData.push(item)
        }
        return { messages: {...messages, list: newData} }
    })
    store.on('messages/clear', ({ messages }, messagesAll) => {
        return { messages: {...messages, list: [], page: 1} }
    })
    store.on('messages/addPaginate', ({ messages }) => {
        return { messages: {...messages, page: messages.page + 1} }
    })
    store.on('messages/setTotal', ({ messages }, total) => {
        return { messages: {...messages, total: total} }
    })
    store.on('messages/delete', ({ messages }, id) => {
        console.log(messages.list)
        return { messages: {...messages, list: messages.list.filter(e => e.id !== id)} }
    })
    store.on('messages/edit', ({ messages }, data) => {
        return { messages: {...messages, list: messages.list.map(e => e.id === data.id ? data : e)} }
    })
}