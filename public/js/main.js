const feeds = document.querySelector('.feeds')
const loading = document.querySelector('#loading')
let load = false

const getFeedFromBack = async () => {
    load = true
    const res = await fetch('http://localhost:3000/feeds')
    const data  = await res.json()
    load  = false
    
    return data
}

const addFeedsTooDom = async () => {
    const feedsAll = await getFeedFromBack()
    
    if (!load){
        loading.innerHTML = ''
    }

    feedsAll.forEach(feed => {
        const div = document.createElement('div')
        div.className = 'feedss'
        div.innerHTML = `
        <h3>${feed.title}</h3>
        <h5>Data: ${feed.date}</h5>
        <p>${feed.content}</p>
        `
        feeds.appendChild(div)
        
    })
}
addFeedsTooDom()
