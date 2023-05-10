const express=require('express')
const router=express.Router()

const userinfo_handler=require('../router_handler/userinfo')

router.get('/userinfo',userinfo_handler.getUserinfo)
router.post('/userinfo',userinfo_handler.postUserinfo)
router.post('/updatepwd',userinfo_handler.updatepwd)
router.post('/updateAvatar',userinfo_handler.updateAvatar)

module.exports=router