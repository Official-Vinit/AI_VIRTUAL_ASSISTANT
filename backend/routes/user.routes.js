import express from "express"

const userRouter=express.Router()

userRouter.get("/current",isAuth,getCurrentUser)


export default userRouter