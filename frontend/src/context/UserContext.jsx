
import React, { createContext} from 'react'
export const userDataContext = createContext()
function UserContext({ children }) {
    const serverUrl = "http://localhost:5000"

    return (
        <div>
            <userDataContext.Provider value={value}>
                {children}
            </userDataContext.Provider>
        </div>
    )
}

export default UserContext
