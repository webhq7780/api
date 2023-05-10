//创建一个服务器
const express=require('express')
const app=express()
//解决跨域问题的中间件 npm i cors@2.8.5
const cors=require('cors')
app.use(cors())
//解析表单数据中间件
app.use(express.urlencoded({extended:false}))
//定义一个全局中间件(为了简化成功或失败的代码)
app.use((req,res,next)=>{
    res.cc=(err,status=1)=>{
        res.send({
            status,
            message:err instanceof Error ? err.message : err
        })
    },
    next()
})
//解析jwt缓存
const expressJWT=require('express-jwt')
const config=require('./config')
app.use(expressJWT({
    secret:config.jwtSecreKey
}).unless({path:[/^\/api/]}))

//定义错误级别中间件
app.use((err,req,res,next)=>{
    if(err.name==='UnauthorizedError') return res.cc('jwt失败'),
    res.cc(err)
})

//导入并使用路由
const userRouter=require('./router/user')
app.use('/api',userRouter)
//导入并使用用路由
const userinfoRouter=require('./router/userinfo')
app.use('/my',userinfoRouter)

app.listen('80',()=>{
    console.log('启动成功')
})