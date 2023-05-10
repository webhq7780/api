const db=require('../bd/index')
const bcry = require('bcryptjs')

exports.getUserinfo=(req,res)=>{
    //查询用户的属性
    const sql='select id,username,nickname,eamil,user_pic from ev_user where id=?'
    //req.user 是jwt校验成功后自动把数值添加到req身上
    db.query(sql,req.user.id,(err,results)=>{
        if(err)return res.cc(err)
        console.log(results)
        if(results.length!==1)return res.cc('获取用户信息失败')
        res.send({
            status:0,
            message:'获取用户数据成功',
            data:results[0]
        })
    })
}
//更新用户基本信息的处理函数
exports.postUserinfo=(req,res)=>{
    const sql='update ev_user set ? where id=?'
    db.query(sql,[req.body,req.body.id],(err,results)=>{
        if(err)return res.cc(err)
        if(results.affectedRows!==1)res.cc('更新用户失败')
    })
    res.send({
        status:0,
        message:'更新成功'
    })
}
//重置密码
exports.updatepwd=(req,res)=>{
    const sql='select * from ev_user where id=?'
    db.query(sql,req.user.id,(err,results)=>{
        if(err)return res.cc('错误')
        if(results.length!==1) return res.cc('用户不存在')
        //解密并判断旧密码是否正确
        const compareResults = bcry.compareSync(req.body.oldpwd, results[0].password)
        if (!compareResults) return res.cc('密码错误!')
        //更改新密码
        const sql='update ev_user set password=? where id=?'
        const newpwd=bcry.hashSync(req.body.newpwd,10)
        db.query(sql,[newpwd,req.user.id],(err,results)=>{
            if(err)return res.cc(err)
            if(results.affectedRows!==1)return res.cc('修改失败')
        })
        res.cc('修改成功',0)
    })
}
//更新用头像
exports.updateAvatar=(req,res)=>{
    const sql='update ev_user set user_pic=? where id=?'
    db.query(sql,[req.body.avatar,req.user.id],(err,results)=>{
        if(err)return res.cc(err)
        if(results.affectedRows!==1)return res.cc('跟换头像失败')
        res.cc('更换头像成功',0)
    })
}