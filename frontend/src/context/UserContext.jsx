
import React, { createContext,useState} from 'react'
export const userDataContext = createContext()
function UserContext({ children }) {
    const serverUrl = "http://localhost:5000"

    const [userData,setUserData]=useState(null)

    const handleCurrentUser=async ()=>{
        try {
            const result=await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
            setUserData(result.data)
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <userDataContext.Provider value={{ userData, setUserData, serverUrl, handleCurrentUser }}>
                {children}
            </userDataContext.Provider>
        </div>
    )
}

export default UserContext
