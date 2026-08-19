import { useContext, useRef } from 'react'
import Card from '../components/Card'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/authBg.png"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.jpeg"
import image7 from "../assets/image7.jpeg"
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from '../context/UserDataContext'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from "react-icons/md";
function Customize() {
  const {setBackendImage,frontendImage,setFrontendImage,selectedImage,setSelectedImage}=useContext(userDataContext)
  const navigate=useNavigate()
     const inputImage=useRef()

     const handleImage=(e)=>{
const file=e.target.files[0]
setBackendImage(file)
setFrontendImage(URL.createObjectURL(file))
     }
  return (
    <div className='w-full min-h-screen bg-gray-50 flex justify-center items-center flex-col p-[20px] '>
        <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-gray-800 cursor-pointer w-[25px] h-[25px]' onClick={()=>navigate("/")}/>
        <h1 className='text-gray-800 mb-[40px] text-[30px] text-center font-bold'>Select your <span className='text-blue-600'>Assistant Image</span></h1>
        <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]'>
      <Card image={image1}/>
       <Card image={image2}/>
        <Card image={image3}/>
         <Card image={image4}/>
          <Card image={image5}/>
           <Card image={image6}/>
            <Card image={image7}/>
     <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-white border border-gray-300 rounded overflow-hidden hover:shadow-md cursor-pointer flex items-center justify-center ${selectedImage=="input"?"border-2 border-blue-600 shadow-sm":null}` } onClick={()=>{
        inputImage.current.click()
        setSelectedImage("input")
     }}>
        {!frontendImage &&  <RiImageAddLine className='text-gray-500 w-[25px] h-[25px]'/>}
        {frontendImage && <img src={frontendImage} className='h-full object-cover'/>}
    
    </div>
    <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage}/>
      </div>
{selectedImage && <button className='min-w-[150px] h-[50px] mt-[30px] text-white font-semibold cursor-pointer bg-blue-600 hover:bg-blue-700 rounded text-[16px] px-6' onClick={()=>navigate("/customize2")}>Next</button>}
      
    </div>
  )
}

export default Customize
