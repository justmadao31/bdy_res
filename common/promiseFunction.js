const mysql = require('mysql')
var http = require('https');
var url = require("url");
var querystring = require("querystring");
var zlib = require('zlib');
const xml2js = require('xml2js');
const dbConfig = require('../util/mysqlConnect')
const fs = require('fs')
module.exports = {
    dbQuery: function (sql, list) {
        let connection = mysql.createConnection(dbConfig)


        return new Promise(function (resolve, reject) {
            var query = connection.query(sql, list, function (err, result) {
                if (err) {
                    console.log(err.message)
                    reject(err)
                } else {
                    resolve(result)
                }
            })
            console.log(query.sql)
            connection.end()
        })
    },
    httpGet: function (url) {
        return new Promise(function (resolve, reject) {
            http.get(url, res => {
                resolve(res)
            }).on('error', () => {
                console.log('获取弹幕出错!')
                reject()
            })
        })
    },
    zlibInflateRaw: function (buff) {
        return new Promise(function (resolve, reject) {
            zlib.inflateRaw(buff, function (error, decoded) {
                if (error) {
                    console.log(error)
                    reject()
                } else {
                    resolve(decoded)
                }
            })
        })
    },
    xmlToJson: function (str) {
        return new Promise(function (resolve, reject) {
            xml2js.parseString(str, function (err, result) {
                if (err) {
                    console.log(err)
                    reject()
                } else {
                    resolve(result)
                }

            })
        })
    },
    fsWrite: function (path, str) {
        console.log(path)
        return new Promise(function (resolve, reject) {
            fs.writeFile(path, str, 'utf-8', function (err) {
                if (err) {
                    console.log('写入弹幕失败')
                    console.log(err)
                    reject()
                } else {
                    console.log('写入弹幕成功')
                    resolve()
                }
            })
        })
    },
    fsRead: function (path) {
        return new Promise(function (resolve, reject) {
            fs.readFile(path, function (err, data) {
                if (err) {
                    console.log('读取弹幕文件失败');
                    reject()
                } else {
                    resolve(data.toString())
                }
            });
        })
    },
    saveNews: function (str, img) {
        var sql = 'insert into news (title,image) values (?,?);'
        return this.dbQuery(sql, [str, img])
    }
}