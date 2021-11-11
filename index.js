const express = require('express')
const app = express()
const {main, getFeed} = require('./helper/getFeed')
const feeds = require('./helper/getTrans')

let loadings = false
app.use(express.static('public'))
app.get('/feeds', async(req, res) =>{

    loadings - true
    const mainn = await main()
    loading = false
    
    if(!loadings){
        const newFeedss = await feeds()
        res.json(newFeedss)
    }
    
    

})

app.listen(3000, () => {
    console.log('Aplikacja wystartowała')
})

