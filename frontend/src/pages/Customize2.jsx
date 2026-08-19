import { useContext, useState } from 'react'
import { userDataContext } from '../context/UserDataContext'
import axios from 'axios'
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
function Customize2() {
    const {userData,backendImage,selectedImage,serverUrl,setUserData}=useContext(userDataContext)
    const [assistantName,setAssistantName]=useState(userData?.AssistantName || "")
    const [loading,setLoading]=useState(false)
    const navigate=useNavigate()

    const handleUpdateAssistant=async ()=>{
        setLoading(true)
        try {
            let formData=new FormData()
            formData.append("assistantName",assistantName)
            if(backendImage){
                 formData.append("assistantImage",backendImage)
            }else{
                formData.append("imageUrl",selectedImage)
            }
            const result=await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
setLoading(false)
            console.log(result.data)
            setUserData(result.data)
            navigate("/")
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

  return (
    <div className='w-full min-h-screen bg-gray-50 flex justify-center items-center flex-col p-[20px] relative '>
        <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-gray-800 cursor-pointer w-[25px] h-[25px]' onClick={()=>navigate("/customize")}/>
      <h1 className='text-gray-800 mb-[40px] text-[30px] text-center font-bold'>Enter Your <span className='text-blue-600'>Assistant Name</span> </h1>
      <input type="text" placeholder='eg. shifra' className='w-full max-w-[600px] h-[50px] outline-none border border-gray-300 bg-white text-gray-800 placeholder-gray-400 px-[20px] rounded text-[16px]' required onChange={(e)=>setAssistantName(e.target.value)} value={assistantName}/>
      {assistantName &&  <button className='w-full max-w-[300px] h-[50px] mt-[30px] text-white font-semibold cursor-pointer bg-blue-600 hover:bg-blue-700 rounded text-[16px] px-6' disabled={loading} onClick={()=>{
        handleUpdateAssistant()
    }
        } >{!loading?"Create Assistant":"Loading..."}</button>}
     
    </div>
  )
}

export default Customize2
