import express from "express"
import { registerUser,loginUser,getUserById,passwordResetviamail } from "../Controllers/user.controller.js";
import authMiddleware from "../Middleware/auth.middleware.js";
import cors from 'cors'
 

const router=express.Router()

router.use(
    cors({
        credentials:true,
        origin: 'http://localhost:5173'
    })
)

//router.get('/', test)



router.post('/register',registerUser)
router.post('/login',loginUser)
//router.put('/reset/:id',updateUser)
router.get('/find',authMiddleware,getUserById)
router.post('/sendpasswordlink',passwordResetviamail)
//router.get('/forgotpassword/:id/:token',passwordResetviamail)


export default router;
