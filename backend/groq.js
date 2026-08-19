import axios from "axios"

const getGroqApiUrl = () => {
    return `https://api.groq.com/openai/v1/chat/completions`
}

const groqResponse = async (command, assistantName, userName) => {
    try {
        const apiUrl = getGroqApiUrl()
        const apiKey = process.env.GROQ_API_KEY
        if (!apiKey) {
            throw new Error("Missing GROQ_API_KEY")
        }

        const model = process.env.GROQ_MODEL || "qwen/qwen3.6-27b"

        const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}.
You are not Google. You will now behave like a voice-enabled assistant.

Understand the user's natural language input and respond only with valid JSON in this format:

{
  "type": "general" | "google-search" | "youtube-search" | "youtube-play" | "get-time" | "get-date" | "get-day" | "get-month" | "calculator-open" | "instagram-open" | "facebook-open" | "weather-show",
  "userInput": "<original user input without assistant name; for google/youtube search keep only the search text>",
  "response": "<a short spoken response to read out loud to the user>"
}

Type meanings:
- "general": factual or informational question. Keep the answer short.
- "google-search": user wants to search on Google.
- "youtube-search": user wants to search on YouTube.
- "youtube-play": user wants to directly play a video or song.
- "calculator-open": user wants to open a calculator.
- "instagram-open": user wants to open Instagram.
- "facebook-open": user wants to open Facebook.
- "weather-show": user wants to know weather.
- "get-time": user asks for current time.
- "get-date": user asks for today's date.
- "get-day": user asks what day it is.
- "get-month": user asks for the current month.

Important:
- If someone asks who created you, say ${userName}.
- Only respond with the JSON object, nothing else.

User input: ${command}`

        const result = await axios.post(apiUrl, {
            model: model,
            messages: [
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        }, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        })

        return result.data?.choices?.[0]?.message?.content
    } catch (error) {
        const status = error.response?.status
        const message = error.response?.data?.error?.message || error.message
        console.log(`Groq API error${status ? ` ${status}` : ""}: ${message}`)
        throw new Error(message)
    }
}

export default groqResponse
