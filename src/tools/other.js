export function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

export function getFileName(url){
    return url.split("/")[url.split("/").length - 1]
}