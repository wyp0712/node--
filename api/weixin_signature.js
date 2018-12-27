var express = require('express');
var router = express.Router();
var fetch = require("node-fetch");
var jsSHA = require('jssha');
var beforeTime = 0; //第一次生成签名的时间；

var JsapiTicketData = null; //将微信的ticket缓存；

// 2小时后过期，需要重新获取数据后计算签名
var expireTime = 7200;

var wx_config = require("../config/db_config").wx_config


// 获取token
let getAccessToken = () => {

    return new Promise((resolve, reject) => {
        fetch(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wx_config.appid}&secret=${wx_config.secret}`, { method: "get" })
            .then(function(data) {
                data.json().then(function(data) {
                    resolve(data)
                })
            }).catch((err) => {
                reject(err)
            })
    })

}

// 获取jsapi_ticket

let getJsapiTicket = (accessTokenData) => {
    return new Promise((resolve, reject) => {
        fetch(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessTokenData.access_token}&type=jsapi`, { method: "get" })
            .then(function(data) {
                data.json().then(function(data) {

                    resolve(data)
                })
            }).catch((err) => {

                reject(err)
            })
    })

}

// 生成签名

let createNonceStrHandle = (jsapi_ticket, timestamp, nonceStr, url) => {

    // 计算签名方法
    var calcSignature = function() {
        var str = `jsapi_ticket=${jsapi_ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`
        console.log(str)
        var SHA1 = new jsSHA("SHA-1", "TEXT");
        SHA1.update(str);
        Signature = SHA1.getHash("HEX")
        console.log(Signature)
        return Signature
    }
    beforeTime = timestamp
        // wxjdk所需要的配置参数
    return {
        jsapi_ticket,
        nonceStr,
        timestamp,
        url,
        signature: calcSignature(),
    }
}

router.post('/', function(req, res, next) {


        if ((createTimeStamp() - beforeTime) < expireTime) {
            console.log(11111, wxJdkConfig)
                // 使用缓存的JsapiTicketData重新做签名
            let data = createNonceStrHandle(JsapiTicketData, createTimeStamp(), createNonceStr(), decodeURIComponent(req.body.url))
            res.send({
                code: "900001",
                data
            })

        } else {
            async function allHandle() {
                let accessTokenData = await getAccessToken()

                let TicketData = await getJsapiTicket(accessTokenData)
                JsapiTicketData = TicketData.ticket
                console.log(req.query.url)
                let data = createNonceStrHandle(JsapiTicketData, createTimeStamp(), createNonceStr(), decodeURIComponent(req.body.url))

                return data
            }
            allHandle().then((data) => {
                wxJdkConfig = data
                res.send({
                    code: "900001",
                    data
                })
            }).catch((err) => {
                res.send({
                    code: "900002",
                    err
                })
            })
        }

    })
    //创建noncestr
var createNonceStr = function() {
    return Math.random().toString(36).substr(2, 15);
};
//创建timestamp
var createTimeStamp = function() {
    return parseInt(new Date().getTime() / 1000) + '';
};
// 获取请求的url
// var getUrl = (req) => {
//     return req.protocol + '://' + req.get('host') + req.originalUrl
// }
module.exports = router;