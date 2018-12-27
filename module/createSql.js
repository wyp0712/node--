   var {
       sqlHandle, //修改和增加操作
       readHandle, //读取操作
       searchHandle, //检测有无某条数据，有为false
       searchHandleNormal, //检测有无某条数据，有为true
       query // //基本操作
   } = require("../config/db_connect")
       //根据用户权限生成学院和专业的sql
   function sql_college(rows, collegeId) {
       let sql
       switch (rows[0].rose) {
           case "1000":
               {
                   sql = `select * from college`
               }
               break
           case "2000":
               {
                   sql = `select * from college where id='${rows[0].permission}'`

               }
               break
           case "3000":
               {
                   if (collegeId) {
                       sql = `select * from college where id='${collegeId}'`
                   } else {
                       sql = `select * from college`
                   }


               }
               break
       }
       return sql

   }

   function sql_course(rows) {
       let sql
       switch (rows[0].rose) {
           case "1000":
               {
                   sql = `select * from course`
               }
               break
           case "2000":
               {
                   sql = `select * from course where parent_id='${rows[0].permission}'`
               }
               break
           case "3000":
               {
                   sql = `select * from course where id='${rows[0].permission}'`

               }
               break
       }
       return sql
   }

   // 检测是否用户登录

   let testUserLogin = (req, res, next) => {

       var testUser = `select * from system_user where id='${req.cookies.userId}'`
       console.log(testUser)
       return new Promise((resolve, reject) => {
           readHandle(testUser).then((data) => {
               console.log(data)
               if (data.length > 0) {
                   resolve(data)
               } else {
                   reject()
               }

           }).catch((err) => {
               reject(err)
           })
       })
   }
   module.exports = {
       sql_college,
       sql_course,
       testUserLogin
   }