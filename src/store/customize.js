import { createStoreon } from 'storeon'

// Initial state, reducers and business logic are packed in independent modules
export let customize = store => {
    // Initial state
    store.on('@init', () => ({ customize: {width: 0, height: 0, isMobile: false} }))
    store.on('customize/width', ({ customize }, width) => {
        const isMobile = width <= 768;
        return { customize: {...customize, width: width, isMobile: isMobile }}
    })
    store.on('customize/height', ({ customize }, height) => {
        return { customize: {...customize, height: height }}
    })
}