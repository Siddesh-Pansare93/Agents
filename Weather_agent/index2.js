import { GoogleGenerativeAI } from "@google/generative-ai"
import readline from 'readline-sync'

import dotenv from 'dotenv'

dotenv.config()




const Gemini_Api_Key = process.env.GEMINI_API_KEY




const getWeatherDetails = (city = '') => {
    if (city.toLowerCase() === 'patiala') return '10° C'
    if (city.toLowerCase() === 'mohali') return '14° C'
    if (city.toLowerCase() === 'pune') return '15° C'
    if (city.toLowerCase() === 'bangalore') return '23° C'
    if (city.toLowerCase() === 'thane') return '34° C'
}

const tools = {
    "getWeatherDetails": getWeatherDetails
}





// GEMINI CODE 



const genAi = new GoogleGenerativeAI(Gemini_Api_Key)

const model = genAi.getGenerativeModel({ model: 'gemini-2.0-flash' })

const SYSTEM_PROMPT = `
    Respond with a valid JSON object without Markdown formatting, triple backticks, or extra newlines.
    You are an Farming assintant.Helping Farmers to solve there question 

    Please return a well-formatted JSON object containing structured information. Ensure it is a single valid JSON object, not multiple separate ones AS in examples.

`;




const chat = model.startChat({
    history: [{
        "role": "user",
        parts: [{ text: SYSTEM_PROMPT }]
    }]
})




while (true) {
    const userMessage = readline.question(">>")

    let q = {
        type: "user",
        content: userMessage
    }


    // while (true) {

    const result = await chat.sendMessage(JSON.stringify(q))
    // console.log(result.response.text())
    const response = JSON.parse(result.response.text())
    console.log(response.response)

    // if (response.type === 'asistant') {
    //     console.log(response.output)
    //     break;
    // } 
    // else if (response.type === 'action') {
    //     const fn = tools[response.function]
    //     const observation = fn(response.input)
    //     console.log("observation: " , observation)
    //     q = { "role": "developer", "content": observation }
    // }
    // }
}





