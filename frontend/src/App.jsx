import {React,useContext} from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import { userDataContext } from './context/UserContext'


function App() {
  const {userData,setUserData}=useContext(userDataContext)
  return (
    <Routes>
        <Route path="/signup" element={<SignUp />} />
    </Routes>
  )
}

export default App