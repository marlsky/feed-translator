const dotenv = require('dotenv').config()
const {Client} = require('@notionhq/client')
const fetch =  require("node-fetch")

//init Client

const notion = new Client({
    auth: process.env.API_TOKEN
})

const database_id = process.env.DATABSE_ID

const getData = async () => {
    const payload = {
        path: `databases/${database_id}/query`,
        method: 'POST'
    }
    const {results} = await notion.request(payload)

    const feeds = results.map(page => {
        return {
            title: page.properties.Title.title[0].text.content,
            content: page.properties.Content.rich_text[0].text.content,
            date: new Date(page.properties.Date.date.start).toLocaleDateString()
        }
    })
    return feeds
}


async function feeds() {
    const newTranslate = await getData()
    return newTranslate
}
module.exports = feeds