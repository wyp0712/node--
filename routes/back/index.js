var express = require('express');
var router = express.Router();

var {
    sqlHandle, //修改和增加操作
    readHandle, //读取操作
    searchHandle, //检测有无某条数据，有为false
    searchHandleNormal, //检测有无某条数据，有为true
    query // //基本操作
} = require("../../config/db_connect")

// 检测是否用户登录

let testUserLogin = (req, res, next) => {
    console.log(req.cookies.userId)
    var testUser = `select * from system_user where id='${req.cookies.userId}'`
    return new Promise((resolve, reject) => {
        readHandle(testUser).then((data) => {
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



router.get('/', function(req, res, next) {
    res.render('back/login', { title: '网站考试后台管理系统登录' });
});
router.get('/register', function(req, res, next) {
    res.render('back/register', { title: '网站考试后台管理系统注册' });
});
router.get('/main', function(req, res, next) {
    testUserLogin(req, res, next).then((rows) => {
        let data = {
            title: '网站考试后台管理系统 ',
            userData: rows[0]
        }
        res.render('back/index', data);
    }).catch(() => {
        res.redirect('/back');
    })

});

// 增加学院
router.get('/addCollege', function(req, res, next) {
    testUserLogin(req, res, next).then((rows) => {
        let data = {
            title: '考试系统增加学院',
            userData: rows[0],
            routerUrl: "/back/addCollege"
        }
        res.render('back/classManage/addCollege', data);
    }).catch(() => {
        res.redirect('/back');
    })

});
//增加课程
router.get('/addcourse', function(req, res, next) {
    testUserLogin(req, res, next).then((rows) => {
        let sqlselect = `select * from college`
        readHandle(sqlselect).then((collegeData) => {
            console.log(collegeData)
            let data = {
                title: '考试系统增加课程',
                userData: rows[0],
                routerUrl: "/back/addcourse",
                collegeData
            }
            res.render('back/classManage/addCourse', data);
        })

    }).catch(() => {
        res.redirect('/back');
    })

});
//课程分类列表
router.get('/courseList', function(req, res, next) {
    testUserLogin(req, res, next).then((rows) => {
        let sqlselect1 = `select * from college`
        const sqlselect2 = `select * from course`

        async function all() {
            let collegeList = await readHandle(sqlselect1)
            let courseList = await readHandle(sqlselect2)
            console.log(collegeList, courseList)
            let data = courseList.map((i) => {
                collegeList.forEach((j) => {
                    if (i.parent_id == j.id) {
                        i.college = j.cnname
                        i.collegeen = j.enname
                    }
                })
                return i
            })
            return data
        }
        all().then((courseData) => {
            let data = {
                title: '考试系统分类列表',
                userData: rows[0],
                routerUrl: "/back/courseList",
                courseData
            }
            res.render('back/classManage/courseList', data);
        })

    }).catch(() => {
        res.redirect('/back');
    })
});
//学院分类列表
router.get('/collegeList', function(req, res, next) {
    testUserLogin(req, res, next).then((rows) => {
        let sqlselect = `select * from college`

        readHandle(sqlselect).then((collegeData) => {
            let data = {
                title: '考试系统分类列表',
                userData: rows[0],
                routerUrl: "/back/collegeList",
                collegeData
            }
            res.render('back/classManage/collegeList', data);
        })

    }).catch(() => {
        res.redirect('/back');
    })
});

// 获取学院和课程信息


//试题添加
router.get('/addQuestions', function(req, res, next) {
    testUserLogin(req, res, next).then((rows) => {

        // async function all() {
        //     let data1 = await readHandle(sql_course(rows))
        //     let data2 = await readHandle(sql_college(rows, data1[0].parent_id))
        //     return {
        //         college: data2,
        //         course: data1
        //     }
        // }
        // all().then((classData) => {
        let data = {
            title: '考试系统增加试题',
            userData: rows[0],
            routerUrl: "/back/addQuestions",
            // classData
        }
        res.render('back/questionManage/addQuestions', data);
        // })

    }).catch(() => {
        res.redirect('/back');
    })
});

//试题列表
router.get('/questionsList', function(req, res, next) {
    testUserLogin(req, res, next).then((rows) => {

        let data = {
            title: '考试系统分类列表',
            userData: rows[0],
            routerUrl: "/back/addQuestions"
        }
        res.render('back/questionManage/questionsList', data);
    }).catch(() => {
        res.redirect('/back');
    })
});



























router.get('/businesspartner', function(req, res, next) {
    testUserLogin(req, res, next).then((rows) => {
        let data = {
            title: '易付兔后台合作商',
            userData: rows[0],
            routerUrl: "/back/businesspartner"
        }
        res.render('back/businessPartner/businesspartner', data);
    }).catch(() => {
        res.redirect('/back');
    })

});
// 充值加油卡添加
router.get('/refuleClass', function(req, res, next) {
    testUserLogin(req, res, next).then((rows) => {
        //读取合作商家数据
        let sqlselect = `select * from businesspartner`
        readHandle(sqlselect).then((businessData) => {
            console.log(businessData)
            let data = {
                title: '易付兔后台加油卡分类',
                userData: rows[0],

                routerUrl: "/back/refuleClass",
                businessData
            }
            res.render('back/refuleClass/refuleClass', data);
        })

    }).catch(() => {
        res.redirect('/back');
    })

});

// 回收加油卡
router.get('/recycleRefuleClass', function(req, res, next) {
    testUserLogin(req, res, next).then((rows) => {
        //读取合作商家数据
        let sqlselect = `select * from businesspartner`
        readHandle(sqlselect).then((businessData) => {
            console.log(businessData)
            let data = {
                title: '易付兔后台回收加油卡分类',
                userData: rows[0],
                routerUrl: "/back/recycleRefuleClass",
                businessData
            }
            res.render('back/recycleRefuleClass/recycleRefuleClass', data);
        })

    }).catch(() => {
        res.redirect('/back');
    })

});

// 回收加油卡列表
router.get('/recycleRefuleClassList', function(req, res, next) {
    testUserLogin(req, res, next).then((rows) => {
        //读取合作商家数据
        let sqlselect = `select * from businesspartner`
        let sqlList = `select * from recycle_refuel_card_type`

        async function all(param) {
            let businessData = await readHandle(sqlselect)
            let listData = await readHandle(sqlList)
            console.log(businessData)
            listData = listData.map((i) => {
                businessData.forEach(j => {
                    console.log(i.businesspartner == j.id)
                    if (i.businesspartner == j.id) {
                        i.businesspartnerName = j.name
                    }
                });
                return i
            })
            console.log(listData)
            return { listData, businessData }
        }
        all().then((datas) => {
            let { listData, businessData } = datas
            let data = {
                title: '易付兔后台回收加油卡分类',
                routerUrl: "/back/recycleRefuleClass",
                userData: rows[0], //用户信息
                listData,
                businessData
            }
            res.render('back/recycleRefuleClass/recycleRefuleClassList', data);
        })


    }).catch(() => {
        res.redirect('/back');
    })

});
// 充值加油卡列表
router.get('/refuleClassList', function(req, res, next) {
    testUserLogin(req, res, next).then((rows) => {
        //读取合作商家数据
        let sqlselect = `select * from businesspartner`
        let sqlList = `select * from refuel_card_type`

        async function all(param) {
            let businessData = await readHandle(sqlselect)
            let listData = await readHandle(sqlList)
            console.log(businessData)
            listData = listData.map((i) => {
                businessData.forEach(j => {
                    console.log(i.businesspartner == j.id)
                    if (i.businesspartner == j.id) {
                        i.businesspartnerName = j.name
                    }
                });
                return i
            })
            console.log(listData)
            return { listData, businessData }
        }
        all().then((datas) => {
            let { listData, businessData } = datas
            let data = {
                title: '易付兔后台回收加油卡分类',
                routerUrl: "/back/refuleClassList",
                userData: rows[0], //用户信息
                listData,
                businessData
            }
            res.render('back/refuleClass/refuleClassList', data);
        })


    }).catch(() => {
        res.redirect('/back');
    })

});

// 商家列表
router.get('/businesspartnerList', function(req, res, next) {
    testUserLogin(req, res, next).then((rows) => {
        //读取合作商家数据
        let sqlselect = `select * from businesspartner`


        readHandle(sqlselect).then((businessData) => {

            let data = {
                title: '易付兔后台回收加油卡分类',
                routerUrl: "/back/businesspartnerList",
                userData: rows[0], //用户信息

                businessData
            }
            res.render('back/businessPartner/businesspartnerList', data);
        })


    }).catch(() => {
        res.redirect('/back');
    })

});
// 客户列表
router.get('/clientUserList', function(req, res, next) {
    testUserLogin(req, res, next).then((rows) => {
        //读取合作商家数据
        let sqlselect = `select * from client_user`


        readHandle(sqlselect).then((listData) => {

            let data = {
                title: '易付兔后台客户列表',
                routerUrl: "/back/clientUserList",
                userData: rows[0], //用户信息
                listData
            }
            res.render('back/clientUser/clientUserList', data);
        })


    }).catch(() => {
        res.redirect('/back');
    })

});


// 手机充值订单列表
router.get('/phoneOrder', function(req, res, next) {
    testUserLogin(req, res, next).then((rows) => {

        let sqlselect = `select * from phone_recharge_order`


        readHandle(sqlselect).then((listData) => {
            let data = {
                title: '易付兔后台手机充值订单列表',
                routerUrl: "/back/phoneOrder",
                userData: rows[0], //用户信息
                listData
            }
            res.render('back/orderList/phoneOrder', data);
        })
    }).catch(() => {
        res.redirect('/back');
    })
});

//充值加油卡订单列表
router.get('/refuleOrder', function(req, res, next) {
    testUserLogin(req, res, next).then((rows) => {

        let sqlselect = `select * from refuel_recharge_order`


        readHandle(sqlselect).then((listData) => {
            let data = {
                title: '易付兔后台加油卡充值订单列表',
                routerUrl: "/back/phoneOrder",
                userData: rows[0], //用户信息
                listData
            }
            res.render('back/orderList/refuleOrder', data);
        })
    }).catch(() => {
        res.redirect('/back');
    })
});

//回收加油卡订单列表
router.get('/recycleRefuleOrder', function(req, res, next) {
    testUserLogin(req, res, next).then((rows) => {

        let sqlselect = `select * from recycle_refuel_recharge_order`


        readHandle(sqlselect).then((listData) => {
            let data = {
                title: '易付兔后台加油卡回收订单列表',
                routerUrl: "/back/recycleRefuleOrder",
                userData: rows[0], //用户信息
                listData
            }
            res.render('back/orderList/recycleRefuleOrder', data);
        })
    }).catch(() => {
        res.redirect('/back');
    })
});


//首页轮播图
router.get('/bannerSet', function(req, res, next) {
    testUserLogin(req, res, next).then((rows) => {

        let sqlselect = `select * from bannerlist`

        readHandle(sqlselect).then((listData) => {
            let data = {
                title: '易付兔后台加油卡回收订单列表',
                routerUrl: "/back/bannerSet",
                userData: rows[0], //用户信息
                listData
            }
            res.render('back/aboutUs/bannerSet', data);
        })
    }).catch(() => {
        res.redirect('/back');
    })
});

//首页轮播图
router.get('/baseSet', function(req, res, next) {
    testUserLogin(req, res, next).then((rows) => {

        let sqlselect = `select * from bannerlist`

        readHandle(sqlselect).then((listData) => {
            let data = {
                title: '易付兔后台加油卡回收订单列表',
                routerUrl: "/back/bannerSet",
                userData: rows[0], //用户信息
                listData
            }
            res.render('back/aboutUs/baseSet', data);
        })
    }).catch(() => {
        res.redirect('/back');
    })
});
module.exports = router;