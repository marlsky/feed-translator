const fs = require('fs')
require('dotenv').config()
const {Client} = require('@notionhq/client')
const fetch =  require("node-fetch")

////////////////////////////////// Get New Feed
let Parser = require('rss-parser')
let parser = new Parser()

const getFeed = async () => {

  let feeds = await parser.parseURL('http://rss.cnn.com/rss/edition.rss');
  
  const ids = JSON.parse(fs.readFileSync('./ids.json', 'utf-8'))
  
  const newFeed = feeds.items.filter(item => ids.includes(item.title) === false)
  newFeed.forEach(item => ids.push(item.title))
  fs.writeFileSync('./ids.json', JSON.stringify(ids), 'utf-8')

  console.log(`New post: ${newFeed.length}`)
  timestamp = Date.now()
  return newFeed.map(item => {
    return{
      title: item.title,
      content: item.contentSnippet,
      date:  new Date(timestamp).toISOString(),
     
      
      
      
    }
  })

}


///////////////////////////////////////Save Feed to the Database
const notion = new Client({
    auth: process.env.API_TOKEN
})



async function uploadNotion(newItem){
  
  await notion.pages.create({
    "parent": { "database_id": process.env.DATABSE_ID },
        "properties": {
          Title: {
            title: [
              {
                text: {
                  content: newItem.translatedText
                }
              }
            ]
          },
          Content: {
            rich_text: [
              {
                text: {
                  content: newItem.TransCont
                },
              },
            ],
          },
          Date: {
            date: {
              start: newItem.date
            },
          },
         
     
    }
  })

  console.log("poszlo");
}


////////////////////////////////////////////////Translate title
async function translate(item){
  trans = []
const res = await fetch("https://translate.argosopentech.com/translate", {
	method: "POST",
	body: JSON.stringify({
		q: item.title,
		source: "en",
		target: "pl",
		format: "text"
	}),
	headers: { "Content-Type": "application/json" }
});

response = await res.json()
trans = Object.assign(response, item);

return await trans


}


///////////////////////////////////////translate Content
async function translateContent(item){
  transContent = []
const res = await fetch("https://translate.argosopentech.com/translate", {
	method: "POST",
	body: JSON.stringify({
		q: item.content,
		source: "en",
		target: "pl",
		format: "text"
	}),
	headers: { "Content-Type": "application/json" }
});

response = await res.json()
transContent = Object.assign([response]);
let newTrans = transContent.map(item => {
  return { TransCont: item.translatedText };
});

return await newTrans


}


///////////////////////////////////function main 
async function main(item){
  const newFeeds = await getFeed()
  for(item of newFeeds){
    const transFeeds = await translate(item)
    const translateCont = await translateContent(item)
    const newCont = Object.assign({}, ...translateCont);
    const newItem = Object.assign(newCont, transFeeds)
    
    uploadNotion(newItem)
     
     //console.log(newItem);
    
    
  }
}



module.exports = { getFeed, main}