var express = require('express');
var router = express.Router();
var hasOwnProperty = require('has-own-property-x'); //支持hasOwnProperty

var Unique = require("../common/Unique")
var CreatTime = require("../common/creatTime")

var {
    sqlHandle, //修改和增加操作
    readHandle, //读取操作
    searchHandle, //检测有无某条数据，有为false
    searchHandleNormal, //检测有无某条数据，有为true
    query // //基本操作
} = require("../../config/db_connect")


/* GET home page. */

router.post('/login', function(req, res, next) {
    let arg = req.body
    console.log(arg)
    if (hasOwnProperty(arg, "username") && hasOwnProperty(arg, "password")) {
        let { username, password } = arg
        var testUser = `select * from system_user where username='${username}'`
        readHandle(testUser).then((data) => {
            console.log(data)
            if (data.length > 0) {
                if (data[0].password == password) {
                    // 更新登录时间
                    let updateTimeSql = `update system_user set logintime='${CreatTime()}' where id='${data[0].id}'`
                    sqlHandle(updateTimeSql).then(() => {
                        console.log("更新登录时间成功")
                    }).catch(() => {
                        console.log("更新登录时间失败")
                    })
                    res.cookie('userId', data[0].id, { expires: new Date(Date.now() + 86400000), httpOnly: true });
                    res.send({
                        code: "10001",
                        msg: "登录成功",

                    })
                } else {
                    res.send({
                        code: "10002",
                        msg: "密码错误"
                    })
                }
            } else {
                res.send({
                    code: "10003",
                    msg: "用户名不存在"
                })
            }
        })
    } else {
        res.send({
            code: "10004",
            msg: "未输入用户名或密码"
        })
    }
});

// 用户创建
router.post('/register', function(req, res, next) {
    let arg = req.body

    if (hasOwnProperty(arg, "username") && hasOwnProperty(arg, "password")) {
        let { username, password } = arg
        var testUser = `select * from system_user where username='${username}'`
        let insertSql = `insert into system_user(id,username,password,rose,imgsrc,createtime) values('${Unique()}','${username}','${password}','${1000}','/assets/img/user.png','${CreatTime()}')`
        console.log(insertSql)
        async function allHandle() {
            await searchHandle(testUser)
            await sqlHandle(insertSql)
        }
        allHandle().then((data) => {
            res.send({
                code: "10011",
                msg: "插入成功"
            })
        }).catch(() => {
            res.send({
                code: "10012",
                msg: "插入失败"
            })
        })
    } else {
        res.send({
            code: "10013",
            msg: "未输入用户名或密码"
        })
    }
});

// function userPermission(userId, data) {
//     var userSql = `selete * from system_user`

// }
module.exports = router;