var express = require('express');
var router = express.Router();
const dao = require('../database/dao')

router.get("/readPage",function(req, res, next) {
    let params = req.query;
    let page = params.page;
    let size = params.size;
    let isImp = params.isImp

    Promise.all([dao.readTotal(),dao.readPage(page,size,isImp)]).then(arr=>{
        res.json({
            data: arr[1],
            total: arr[0].total
        })
    })
})

router.get("/totalNum",function(req, res, next) {

    dao.readTotal().then((data)=>{
        res.json(data)
    })
})

router.post("/add",function(req, res, next) {
    let word = req.body;
    dao.selectOne(word.english).then(arr=>{
        if (arr.length > 0){
            res.statusCode = 500
            res.send("重复了")
            return
        }

        dao.add(word).then(()=>{
            res.statusCode = 200
            res.send("成功了")
        })
    })

})

router.post("/delete",function(req, res, next) {
    let {english} = req.body;

    dao.selectOne(english).then(arr=>{
        if (arr.length === 0){
            res.statusCode = 500
            res.send("不存在")
            return
        }

        dao.delete(english).then(()=>{
            res.statusCode = 200
            res.send("成功了")
        })
    })

})

router.post("/changeImportant",function(req,res,next){

    console.log(req)
    dao.changeImportant(req.body).then(()=>{
        res.statusCode = 200
        res.send("成功了")
    }).catch(()=>{
        res.statusCode = 500
        res.send("fail")
    })
})


module.exports = router;
