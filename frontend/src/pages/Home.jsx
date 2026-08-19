import { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserDataContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import aiImg from "../assets/ai.gif"
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import userImg from "../assets/user.gif"

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening, setListening] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const [statusText, setStatusText] = useState("Say my name to start")
  const [ham, setHam] = useState(false)
  const isSpeakingRef = useRef(false)
  const isRecognizingRef = useRef(false)
  const isProcessingRef = useRef(false)
  const recognitionRef = useRef(null)
  const mountedRef = useRef(false)
  const synth = window.speechSynthesis

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
    } catch (error) {
      console.log(error)
    }
    setUserData(null)
    navigate("/signin")
  }

  const startRecognition = () => {
    if (!mountedRef.current || isSpeakingRef.current || isRecognizingRef.current || isProcessingRef.current) return
    try {
      recognitionRef.current?.start()
    } catch (error) {
      if (error.name !== "InvalidStateError") console.error("Start error:", error)
    }
  }

  const stopRecognition = () => {
    try {
      recognitionRef.current?.stop()
    } catch (error) {
      if (error.name !== "InvalidStateError") console.error("Stop error:", error)
    }
    isRecognizingRef.current = false
    setListening(false)
  }

  const speak = (text) => {
    if (!text) {
      startRecognition()
      return
    }

    stopRecognition()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    const voices = window.speechSynthesis.getVoices()
    const englishVoice = voices.find(v => v.lang?.toLowerCase().startsWith('en'))
    if (englishVoice) utterance.voice = englishVoice

    isSpeakingRef.current = true
    utterance.onend = () => {
      isSpeakingRef.current = false
      setStatusText("Say my name to start")
      setTimeout(startRecognition, 600)
    }
    utterance.onerror = () => {
      isSpeakingRef.current = false
      setStatusText("Say my name to start")
      setTimeout(startRecognition, 600)
    }

    synth.cancel()
    setStatusText("Speaking...")
    synth.speak(utterance)
  }

  const handleCommand = (data) => {
    if (!data?.response) {
      const fallback = "Sorry, I could not understand that."
      setAiText(fallback)
      speak(fallback)
      return
    }

    const { type, userInput, response } = data
    setAiText(response)
    speak(response)

    const openUrl = (url) => {
      const newWindow = window.open(url, '_blank')
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        const msg = "Please allow pop-ups in your browser to open links."
        setAiText(msg)
        speak(msg)
      }
    }

    if (type === 'google-search') {
      openUrl(`https://www.google.com/search?q=${encodeURIComponent(userInput || "")}`)
    }
    if (type === 'calculator-open') {
      openUrl(`https://www.google.com/search?q=calculator`)
    }
    if (type === "instagram-open") {
      openUrl(`https://www.instagram.com/`)
    }
    if (type === "facebook-open") {
      openUrl(`https://www.facebook.com/`)
    }
    if (type === "weather-show") {
      openUrl(`https://www.google.com/search?q=weather`)
    }
    if (type === 'youtube-search' || type === 'youtube-play') {
      let query = userInput || ""
      if (query.toLowerCase() === "open youtube" || query.toLowerCase() === "youtube") {
        openUrl(`https://www.youtube.com/`)
      } else {
        openUrl(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`)
      }
    }
  }

  useEffect(() => {
    mountedRef.current = true
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setTimeout(() => {
        setAiText("Speech recognition is not supported in this browser. Please use Chrome.")
      }, 0)
      return () => {
        mountedRef.current = false
      }
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognitionRef.current = recognition

    recognition.onstart = () => {
      isRecognizingRef.current = true
      setListening(true)
      setStatusText("Listening...")
    }

    recognition.onend = () => {
      isRecognizingRef.current = false
      setListening(false)
      setStatusText("Say my name to start")
      if (mountedRef.current && !isSpeakingRef.current) {
        setTimeout(startRecognition, 700)
      }
    }

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error)
      isRecognizingRef.current = false
      setListening(false)
      setStatusText("Say my name to start")
      if (mountedRef.current && !isSpeakingRef.current && event.error !== "aborted") {
        setTimeout(startRecognition, 1000)
      }
    }

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim()
      const assistantName = userData?.assistantName?.toLowerCase()
      if (!assistantName || !transcript.toLowerCase().includes(assistantName)) return

      isProcessingRef.current = true
      stopRecognition()
      setAiText("")
      setUserText(transcript)
      try {
        const data = await getGeminiResponse(transcript)
        setUserText("")
        isProcessingRef.current = false
        handleCommand(data)
      } catch (error) {
        console.log(error)
        setUserText("")
        isProcessingRef.current = false
        handleCommand(null)
      }
    }

    const greetingTimer = setTimeout(() => {
      speak(`Hello ${userData.name}, what can I help you with?`)
    }, 0)

    return () => {
      mountedRef.current = false
      clearTimeout(greetingTimer)
      isProcessingRef.current = false
      synth.cancel()
      stopRecognition()
    }
  }, [])

  return (
    <div className='w-full min-h-screen bg-gray-50 flex justify-center items-center flex-col gap-[15px] overflow-hidden text-gray-800'>
      <CgMenuRight className='lg:hidden text-gray-800 absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer' onClick={() => setHam(true)} />
      <div className={`absolute lg:hidden top-0 w-full h-full bg-white border-l border-gray-200 p-[20px] flex flex-col gap-[20px] items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform z-50`}>
        <RxCross1 className=' text-gray-800 absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer' onClick={() => setHam(false)} />
        <button className='w-full min-w-[150px] h-[50px] text-gray-800 font-semibold bg-gray-200 hover:bg-gray-300 rounded cursor-pointer text-[16px] ' onClick={handleLogOut}>Log Out</button>
        <button className='w-full min-w-[150px] h-[50px] text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded cursor-pointer text-[16px] px-[20px] py-[10px] ' onClick={() => navigate("/customize")}>Customize your Assistant</button>
        <div className='w-full h-[1px] bg-gray-300'></div>
        <h1 className='text-gray-800 font-semibold text-[19px]'>History</h1>
        <div className='w-full h-[400px] gap-[10px] overflow-y-auto flex flex-col truncate'>
          {userData.history?.map((his, index) => (
            <div key={index} className='text-gray-600 text-[16px] w-full border-b border-gray-100 py-1'>{his}</div>
          ))}
        </div>
      </div>
      <button className='min-w-[120px] h-[40px] mt-[30px] text-gray-800 font-semibold absolute hidden lg:block top-[20px] right-[20px] bg-white border border-gray-300 hover:bg-gray-100 rounded shadow-sm cursor-pointer text-[15px] ' onClick={handleLogOut}>Log Out</button>
      <button className='min-w-[150px] h-[40px] mt-[30px] text-white font-semibold bg-blue-600 hover:bg-blue-700 absolute top-[70px] right-[20px] rounded shadow-sm cursor-pointer text-[15px] px-[15px] hidden lg:block ' onClick={() => navigate("/customize")}>Customize Assistant</button>
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded bg-gray-200 shadow-sm border border-gray-300'>
        <img src={userData?.assistantImage} alt="" className='h-full object-cover' />
      </div>
      <h1 className='text-gray-800 text-[20px] font-bold'>I'm {userData?.assistantName}</h1>
      <p className='text-gray-600 text-[14px]'>{listening ? "Listening..." : statusText}</p>
      
      <div className='h-[150px] flex items-center justify-center'>
        {!aiText && <img src={userImg} alt="" className='w-[100px] opacity-80' />}
        {aiText && <img src={aiImg} alt="" className='w-[100px] opacity-80' />}
      </div>
      
      <h1 className='text-gray-800 text-[18px] font-semibold text-wrap text-center px-[20px] max-w-2xl min-h-[50px]'>{userText || aiText || null}</h1>
    </div>
  )
}

export default Home
