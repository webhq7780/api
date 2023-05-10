const db = require('../bd/index')
const bcry = require('bcryptjs')
const jwt=require('jsonwebtoken')
const config=require('../config')
//定义并导出路由模块的处理函数
exports.regUser = (req, res) => {
    //校验数据 用户名和密码是否为空
    const userinfo = req.body
    if (!userinfo.username || !userinfo.password) {
        return res.send('用户名和密码不合法')
    }
    //校验数据，在数据库中查询用户名是否被占用
    const sqlStr = 'select * from ev_user where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        //执行sql语句失败
        if (err) {
            return res.send({ statis: 1, message: err.message })
        }
        //执行成功
        if (results.length > 0) {
            return res.send({ status: 1, message: '用户名被占用，请更换别的用户名' })
        }
        // 调用bcry.hashSync()对密码进行加密
        userinfo.password = bcry.hashSync(userinfo.password, 10)
        // 插入密码和用户名
        const sql = 'insert into ev_user set ?'
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            if (err) return res.send({ status: 1, message: err.message })
            if (results.affectedRows !== 1) return res.send({
                status: 1,
                message: '注册新用户失败，请稍后再试！'
            })
            res.send({
                status: 0,
                message: '注册成功'
            })
        })
    })
}
exports.login = (req, res) => {
    //接收表单数据
    const userinfo = req.body
    const sql = 'select * from ev_user where username=?'
    db.query(sql, userinfo.username, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('登录失败!')
        //判断密码是否正确并解密
        const compareResults = bcry.compareSync(userinfo.password, results[0].password)
        if (!compareResults) return res.cc('登录失败!')

        //服务器生成jwt缓存
        const user={...results[0],password:'',user_pic:''}
        const tokenStr=jwt.sign(user,config.jwtSecreKey,{expiresIn:config.expiresIn})
        res.send({
            status:0,
            message:'登录成功',
            token:'Bearer '+tokenStr
        })
    })
}