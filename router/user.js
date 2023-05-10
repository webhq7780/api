// 用户路由模块
const express=require('express')
const router=express.Router()
// 导入路由模块函数
const user_handler=require('../router_handler/user')
//注册新用户
router.post('/reguser',user_handler.regUser)
//登录
router.post('/login',user_handler.login)

//导出路由
module.exports=router
