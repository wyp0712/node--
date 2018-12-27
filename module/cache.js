var express = require('express');
var router = express.Router();
var hasOwnProperty = require('has-own-property-x'); //支持hasOwnProperty
// var Unique = require("../common/Unique")
// var CreatTime = require("../common/creatTime")
// 图片上传的
var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');

var {
    sqlHandle, //修改和增加操作
    readHandle, //读取操作
    searchHandle, //检索判断数据库是否有此值(有值为false)
    searchHandleNormal, //检索判断数据库是否有此值(有值为true)
    query // //基本操作
} = require("../config/db_connect")


function updateQuestionCount_course() {
    let sql1 = `select * from course`
    async function all() {
        // 获取课程
        let data = await readHandle(sql1)

        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            let sql2 = `select count(*) from ${data[i].enname}`

            let questions = await query(sql2)

            let sql3 = `update course set questions=${questions[0]['count(*)']} where id='${data[i].id}'`

            await sqlHandle(sql3)
        }
    }
    all().then(() => {
        // console.log("更新专业的题目数量成功")
        updateQuestionCount_college()
    }).catch((err) => {
        console.log(err)
    })
}

function loop() {
    setInterval(updateQuestionCount_course, 1000)
}
module.exports = {
    loop
}