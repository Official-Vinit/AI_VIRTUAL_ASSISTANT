import { useContext, useState } from 'react'
import bg from "../assets/authBg.png"
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserDataContext';
import axios from "axios"
function SignIn() {
  const [showPassword,setShowPassword]=useState(false)
  const {serverUrl,setUserData}=useContext(userDataContext)
  const navigate=useNavigate()
  const [email,setEmail]=useState("")
  const [loading,setLoading]=useState(false)
    const [password,setPassword]=useState("")
const [err,setErr]=useState("")
  const handleSignIn=async (e)=>{
    e.preventDefault()
    setErr("")
    setLoading(true)
try {
  let result=await axios.post(`${serverUrl}/api/auth/signin`,{
   email,password
  },{withCredentials:true} )
 setUserData(result.data)
  setLoading(false)
   navigate("/")
} catch (error) {
  console.log(error)
  setUserData(null)
  setLoading(false)
  setErr(error.response.data.message)
}
    }
  return (
    <div className='w-full h-screen bg-gray-50 flex justify-center items-center'>
      <form className='w-[90%] max-w-[400px] bg-white border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-[20px] p-[30px] rounded' onSubmit={handleSignIn}>
        <h1 className='text-gray-800 text-[24px] font-semibold mb-[10px]'>Sign In to <span className='text-blue-600'>Virtual Assistant</span></h1>

        <input type="email" placeholder='Email' className='w-full h-[50px] outline-none border border-gray-300 bg-white text-gray-800 placeholder-gray-400 px-[15px] rounded text-[16px]' required onChange={(e)=>setEmail(e.target.value)} value={email}/>
        <div className='w-full h-[50px] border border-gray-300 bg-white text-gray-800 rounded text-[16px] relative'>
          <input type={showPassword?"text":"password"} placeholder='password' className='w-full h-full rounded outline-none bg-transparent placeholder-gray-400 px-[15px]' required onChange={(e)=>setPassword(e.target.value)} value={password}/>
          {!showPassword && <IoEye className='absolute top-[12px] right-[15px] w-[25px] h-[25px] text-gray-500 cursor-pointer' onClick={()=>setShowPassword(true)}/>}
          {showPassword && <IoEyeOff className='absolute top-[12px] right-[15px] w-[25px] h-[25px] text-gray-500 cursor-pointer' onClick={()=>setShowPassword(false)}/>}
        </div>
        {err.length>0 && <p className='text-red-500 text-[14px] w-full text-left'>
          *{err}
        </p>}
        <button className='w-full h-[50px] mt-[10px] text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded text-[16px]' disabled={loading}>{loading?"Loading...":"Sign In"}</button>

        <p className='text-gray-600 text-[14px] cursor-pointer mt-2' onClick={()=>navigate("/signup")}>Want to create a new account? <span className='text-blue-600'>Sign Up</span></p>
      </form>
    </div>
  )
}

export default SignIn
