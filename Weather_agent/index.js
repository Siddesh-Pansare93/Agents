import { GoogleGenerativeAI } from "@google/generative-ai"
import readline from 'readline-sync'
import dotenv  from "dotenv"


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
    YOU ARE AN AI ASSISTANT WITH START, PLAN, ACTION, OBSERVATION, AND OUTPUT STATE.
    Wait for the user prompt and first PLAN using available tools.
    Then, take ACTION with appropriate tools and wait for the observation based on the action.
    Once you get the observation then return the Ai response based on the START prompt and observations.

    DO not answer any other question unrealted to context and do calculations of the data .
    AVAILABLE TOOLS: 
    function getWeatherDetails(city: string): string
    getWeatherDetails is the function that accepts the city name in string and returns the weather data 

    If the user asks a question you have already answered, provide the previous answer directly from your knowledge and do not call the function again.
    IF you dont have any data of any city in the GetWeatherDetails function then Tell him I dont have any data of corresponding city.
    Please return a well-formatted JSON object containing structured information. Ensure it is a single valid JSON object, not multiple separate ones AS in examples.

    Do one step at a time.

    example: 
    {"type": 'user', "user": "What is the weather of patiala?"}
    {"type": "plan", "plan": "I will call the getWeatherDetails function for patiala"} 
    {"type": "action", "function": "getWeatherDetails", "input": "patiala"}
    {"type": "observation", "observation": "10° C"}
    {"type": "output", "output": "The weather of patiala is 10° C"}

    {"type": 'user', "user": "What is the weather of patiala?"}
    {"type": "output", "output": "The weather of patiala is 10° C"}

    Respond with a valid JSON object without Markdown formatting, triple backticks, or extra newlines.
    
`;




const chat = model.startChat({
    history : [{
        "role": "user" , 
        parts : [{text : SYSTEM_PROMPT}]
    }]
})




while (true) {
    const userMessage = readline.question(">>")

    let q = {
        type: "user",
        content: userMessage
    }

   


    while (true) {
      
        const result = await chat.sendMessage(JSON.stringify(q))
        // console.log(result.response.text())
        const response = JSON.parse(result.response.text())
        console.log(response)
        
        if (response.type === 'output') {
            console.log(response.output)
            break;
        } else if (response.type === 'action') {
            const fn = tools[response.function]
            const observation = fn(response.input)
            console.log("observation: " , observation)
            q = { "role": "developer", "content": observation }
        }
    }
}





