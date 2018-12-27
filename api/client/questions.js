var express = require('express');
var router = express.Router();
var hasOwnProperty = require('has-own-property-x'); //支持hasOwnProperty
var Unique = require("../common/Unique")
var CreatTime = require("../common/creatTime")
    // 图片上传的
var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty'); //接受form提交的

var xlsx = require('node-xlsx');
var escapeTool = require("../../module/escape.js") //html转义
var {
    sqlHandle, //修改和增加操作
    readHandle, //读取操作
    searchHandle, //检测有无某条数据，有为false
    searchHandleNormal, //检测有无某条数据，有为true
    query // //基本操作
} = require("../../config/db_connect")


//题目将实体转回为HTML
function toHTML(data) {
    return data.map((i) => {
        i.stem_type = escapeTool.unescape(decodeURIComponent(i.stem_type))
        i.stem = escapeTool.unescape(decodeURIComponent(i.stem))
        i.option_1 = escapeTool.unescape(decodeURIComponent(i.option_1))
        i.option_2 = escapeTool.unescape(decodeURIComponent(i.option_2))
        i.option_3 = escapeTool.unescape(decodeURIComponent(i.option_3))
        i.option_4 = escapeTool.unescape(decodeURIComponent(i.option_4))
        i.option_5 = escapeTool.unescape(decodeURIComponent(i.option_5))
        i.option_6 = escapeTool.unescape(decodeURIComponent(i.option_6))
        i.result = escapeTool.unescape(decodeURIComponent(i.result))
        i.author = escapeTool.unescape(decodeURIComponent(i.author))
        return i
    })
}
// 获取题目列表
router.get("/getQuestionRandom", function(req, res, next) {
    let { courseId, startunit, endunit, stem_type } = req.query
    let sql1 = `select * from course where id='${courseId}'`
    async function all() {
        // 获取课程
        let data = await readHandle(sql1)
        let sql2 = `select * from ${data[0].enname} where courseId='${data[0].id}' ${startunit?" and unit>="+startunit:""}${endunit?" and unit<="+endunit:""}${stem_type?" and stem_type='"+encodeURIComponent(escapeTool.escape(stem_type))+"'":""} order by time desc`
        console.log(sql2)
            //数据题目读取
        let questionId = await readHandle(sql2)
        let arr = questionId.sort((a, b) => {
            return Math.random() > 0.5 ? -1 : 1
        }).slice(0, 40)

        return {
            course: data[0].enname,
            questionIdArr: toHTML(arr)
        }
    }

    all().then((data) => {
        res.send({
            code: "20001",
            data: data,
            msg: "ok"
        })
    }).catch((err) => {
        res.send({
            code: "20002",
            msg: "err"
        })
    })
})

// 根据id获取题目
router.get("/getQuestion", function(req, res, next) {
        let { course, id } = req.query
        let sql1 = `select * from ${course} where id='${id}'`
        readHandle(sql1).then((data) => {
            res.send({
                code: "20011",
                data: data,
                msg: "ok"
            })
        }).catch((err) => {
            res.send({
                code: "20012",
                msg: "err"
            })
        })
    })
    // 学院和科目查询
router.get("/selectClass", function(req, res, next) {
        const sql1 = `select * from college`
        const sql2 = `select * from course`

        async function all() {
            let college = await readHandle(sql1)
            let course = await readHandle(sql2)
            console.log(college, course)
            return {
                college,
                course
            }
        }
        all().then((data) => {
            res.send({
                code: "20021",
                data,
                msg: "读取数据成功"
            })
        }).catch((err) => {
            res.send({
                code: "20022",
                msg: "读取数据失败"
            })
        })
    })
    // 错题提交

router.post("/addErrorQuestion", function(req, res, next) {
    let { id, current_answers, cause, right_answers } = req.body
    const sql = `insert into wrong_question(id,current_answers,cause,right_answers,time) values("${id}","${current_answers}","${cause}","${right_answers}","${CreatTime()}")`
    console.log(sql)
    sqlHandle(sql).then((data) => {
        res.send({
            code: "20031",
            msg: "错题提交成功"
        })
    }).catch((err) => {
        res.send({
            code: "20032",
            msg: "错题提交失败"
        })
    })
})
module.exports = router;