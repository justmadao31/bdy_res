const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const fs = require('fs');
const multer = require('multer')
const upload = multer({dest: 'public/images/'});
const gm = require('gm')
const path = require('path');
const cos = require('../util/cosUtil');

router.all('*', function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');//可以支持的消息首部列表
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');//可以支持的提交方式
    res.header('Content-Type', 'application/json;charset=utf-8');//响应头中定义的类型
    next();
});

router.post('/uploadCardImg', upload.single('pic'), function (req, res, next) {
    var file = req.file;
    var dataObj = {status: 0, message: ''}
    fs.rename(file.path, path.join(__dirname, '../public/images/cards/' + req.body.fileName), function (err, data) {
        if (err) {
            dataObj.message = '移动文件夹失败'
            res.send(dataObj);
        } else {
            gm(path.join(__dirname, '../public/images/cards/' + req.body.fileName))
                .resize(480, 270, "!")
                .write(path.join(__dirname, '../public/images/thumbnail/' + req.body.fileName), function (err, data) {
                    if (err) {
                        dataObj.err = err
                        dataObj.message = '创建缩略图失败'
                        res.send(dataObj);
                    } else {
                        cos.putObject({
                            Bucket: 'yuyuyui-1257913680',
                            Region: 'ap-chengdu',
                            Key: 'yuyuyui/' + req.body.fileName,
                            StorageClass: 'STANDARD',
                            Body: fs.createReadStream(path.join(__dirname, '../public/images/cards/' + req.body.fileName)),
                            onProgress: function (progressData) {
                                console.log(JSON.stringify(progressData));
                            }
                        }, function (err, data) {
                            if (err) {
                                dataObj.err = err
                                dataObj.message = '上传原卡面失败'
                                res.send(dataObj);
                            } else {
                                cos.putObject({
                                    Bucket: 'yuyuyui-1257913680',
                                    Region: 'ap-chengdu',
                                    Key: 'thumbnail/' + req.body.fileName,
                                    StorageClass: 'STANDARD',
                                    Body: fs.createReadStream(path.join(__dirname, '../public/images/thumbnail/' + req.body.fileName)),
                                    onProgress: function (progressData) {
                                        console.log(JSON.stringify(progressData));
                                    }
                                }, function (err, data) {
                                    dataObj.err = err
                                    if (err) {
                                        dataObj.message = '上传缩略图失败'
                                    } else {
                                        dataObj.status = 1
                                    }
                                    res.send(dataObj);
                                });
                            }

                        });
                    }
                });
            res.send({status: 1});
        }
    })

});
module.exports = router;
