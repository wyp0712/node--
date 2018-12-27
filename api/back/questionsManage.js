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



//文件的重命名以及转移操作
//(解决权限问题)
function rename(oldPath, newPath) {
    return new Promise((resolve, reject) => {
        fs.readFile(oldPath, function(err, data) {
            if (err) {
                console.log('File read!');
                reject(err)
            } else {
                // Write the file
                fs.writeFile(newPath, data, function(err) {

                    // Delete the file
                    fs.unlink(oldPath, function(err) {
                        if (err) {
                            reject(err)
                        } else {
                            resolve("ok")
                        }
                    });
                    // resolve("ok")

                    console.log('File written!');
                });
            }
        })
    })
}

//数值处理
function numberHandle(item) {
    parseFloat(item)
}

// 添加试题接口
router.post('/addquestions', function(req, res, next) {

    //用multiparty进行文件的读取?
    var form = new multiparty.Form();
    //     //存储文件的地址，注意这个地址是相对于bin下面的www文件的；
    //     //注意./是直接到bin下面的www文件夹?
    form.uploadDir = path.join(__dirname, '../../public/file/excel');


    form.parse(req, function(err, fields, files) {
        // fields用来接收非文件参数，files接受文件类参数
        console.log(files, fields)

        if (err) {
            console.log('parse error: ' + err);
            res.send("写文件操作失败");
        } else {
            // 文件重命名
            renameHandle(files, fields)

        }
    });
    // 重命名
    const renameHandle = (files, fields) => {
            const fileData = files.myfile[0]

            // 上传后自动生成的文件名以及路径
            const oldPath = fileData.path
                // 重命名后将要转移的路径+文件新名称（读取上传的原文件的名字）
            const newPath = path.join(__dirname, '../../public/file/excel/') + fields.course[0] + "/" + fileData.originalFilename;
            fs.access(newPath, fs.constants.F_OK, (err) => {
                console.log(`${newPath} ${err ? '不存在' : '存在'}`);
                if (err) {
                    //解决权限问题的重命名
                    rename(oldPath, newPath).then(() => {
                        sqlHandles(fileData, fields)
                    }).catch((err) => {
                        console.log(err)
                        res.send({
                            code: "10203",
                            msg: "重命名文件操作失败"
                        })
                    })
                } else {
                    fs.unlink(oldPath, function(err) {
                        console.log("1" + err)
                        if (err) {
                            res.send({
                                code: "10204",
                                msg: "文件存在，并且删除文件失败"
                            })
                        } else {
                            res.send({
                                code: "10205",
                                msg: "文件存在"
                            })
                        }
                    });
                }
            });

        }
        // 数据库存储

    const sqlHandles = (fileData, fields) => {
        // const url = path.join(__dirname, `../../public/file/excel/${fields.course[0]}/${fileData.originalFilename}`)
        const url = path.join(__dirname, `../../public/file/excel/${fields.course[0]}/${fileData.originalFilename}`)
        console.log(url)
        var list = xlsx.parse(url); //读取excel
        console.log(list)
        let sqlArr = []
        list[0].data.forEach((i, index) => {
            if (index > 0) {

                if (i[2] && i[2] != "") {
                    var sql = `insert into ${fields.course[0]}(id,collegeId,courseId,unit,exam_type,time,visitors,stem_type,stem,option_1,option_2,option_3,option_4,option_5,option_6,result,author) values('${Unique()}','${fields.collegeId[0]}','${fields.courseId[0]}','${fields.unit[0]}','${fields.exam_type[0]}','${CreatTime()}',0,'${encodeURIComponent(escapeTool.escape(i[1]))}','${encodeURIComponent(escapeTool.escape(i[2]))}','${encodeURIComponent(escapeTool.escape(i[3]))}','${encodeURIComponent(escapeTool.escape(i[4]))}','${encodeURIComponent(escapeTool.escape(i[5]))}','${encodeURIComponent(escapeTool.escape(i[6]))}','${encodeURIComponent(escapeTool.escape(i[7]))}','${encodeURIComponent(escapeTool.escape(i[8]))}','${encodeURIComponent(escapeTool.escape(i[9]))}','${encodeURIComponent(escapeTool.escape(i[11]))}')`
                    sqlArr.push(sql)
                }
                if (i[2] == "(网站）console.log($.fn === $.prototype)的结果为？") {
                    console.log(i)
                    console.log(encodeURIComponent(escapeTool.escape(i[5])))
                    console.log(sql)

                }
            }
        });

        async function all() {
            for (let i = 0; i < sqlArr.length; i++) {
                const sql = sqlArr[i];
                // console.log(sql)
                await sqlHandle(sql)
            }
        }

        all().then(() => {
            res.send({
                code: "10201",
                msg: "插入成功"
            })
        }).catch((err) => {
            res.send({
                code: "10202",
                msg: "插入失败"
            })
        })
    }
});

// 获取题目列表
router.get("/getQuestion", function(req, res, next) {
    let { collegeId, courseId, unit, exam_type, stem_type, id } = req.query
    let sql1 = `select * from course`
    async function all() {
        // 获取课程
        let data = await readHandle(sql1)
        var sql2 = "select * from ("
        data.forEach(function(i, index) {

            if (index < data.length - 1) {
                sql2 += "SELECT * FROM " + i.enname + " UNION ALL "
            } else {
                if (collegeId || courseId || unit || exam_type || stem_type || id) {
                    sql2 += `SELECT * FROM ${i.enname})as total where ${
                                collegeId?"collegeId='"+collegeId+"'":""}${courseId?" and courseId='"+courseId+"'":""}${unit?" and unit='"+unit+"'":""}${exam_type?" and exam_type='"+exam_type+"'":""}${stem_type?" and stem_type='"+encodeURIComponent(escapeTool.escape(stem_type))+"'":""}${id?" and id='"+id+"'":""} order by time desc`;
                } else {
                    sql2 += `SELECT * FROM ${i.enname})as total order by time desc`;
                }
            }
        })

        //数据题目读取
        let question = await readHandle(sql2)
        console.log(question)
        return question
    }
    //将实体转回为HTML
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
    all().then((data) => {
        res.send({
            code: "10211",
            data: toHTML(data),
            msg: "ok"
        })
    }).catch((err) => {
        res.send({
            code: "10212",
            msg: "err"
        })
    })
})



module.exports = router;