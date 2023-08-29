// 引入 express 框架
const express = require('express')
// 引入 mysql 库
const mysql = require("mysql2");
// 创建express实例
const app = express();
const bodyParser = require('body-parser');

// 格式化请求为json
const json = express.json({ type: '*/json' });
app.use(json);
app.use(bodyParser.urlencoded({ extended: false }));
// 导入定时任务模块
require('./scheduler');
// 新建一个连接池
// const db = mysql.createPool({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE
// })
const db = mysql.createPool({
    host: '147.182.251.92',
    port:'3307',
    user: 'send',
    password: 'Qwe123456',
    database: 'send'
  })
// 新增
app.post('/api/transferHistory', (req, res) => {
  const { address, from, fromScan, to, toScan, token, amount, mode, status } = req.body;
  if (address && from && fromScan && to && toScan && token && amount && mode && status) {
    db.getConnection(function (err, connection) {
      if (err) {
        console.log("建立连接失败", err);
      } else {
        connection.query(`INSERT INTO transferHistory
        (\`address\`, \`from\`, \`fromScan\`,\`to\`,\`toScan\`,\`token\`,\`amount\`,\`mode\`,\`status\`)
        VALUES('${address}', '${from}','${fromScan}',
        '${to}', '${toScan}','${token}','${amount}','${mode}'
        ,'${status}')`, function (err, rows) {
          if (err) {
            console.log(err);
            connection.destroy();
            res.send({
              code: 500,
              msg: '系统错误'
            })
          } else {
            connection.destroy();
            res.send({
              code: 200,
              msg: "操作成功"
            })
          }
        })

      }
    })


  }
  else {
    res.send({ code: 102, msg: '参数不完整' })
  }
})
// 更新
app.put('/api/transferHistory', (req, res) => {
  const { fromScan, toScan} = req.body;
  if (fromScan && toScan) {
    db.getConnection(function (err, connection) {
      if (err) {
        console.log("建立连接失败", err);
      } else {
        connection.query(`update transferHistory set  \`toScan\`='${toScan}'
      where   \`fromScan\`='${fromScan}'`, function (err, rows) {
          if (err) {
            console.log(err);
            connection.destroy();
            res.send({
              code: 500,
              msg: '系统错误'
            })
          } else {
            connection.destroy();
            res.send({
              code: 200,
              msg: "操作成功"
            })
          }
        })

      }
    })


  }
  else {
    res.send({ code: 102, msg: '参数不完整' })
  }
})
// 获取
app.get('/api/transferHistory', (req, res) => {
  // 获取查询参数
  const { address } = req.query
  db.getConnection(function (err, connection) {
    if (err) {
      console.log("建立连接失败", err);
    } else {
      let query = ` address='${address}'`;
      if (query) {
        query = 'where ' + query
      }
      connection.query(`SELECT *
      FROM transferHistory ${query}`, function (err, rows) {
        if (err) {
          console.log(err);
          connection.destroy();
          res.send({
            code: 500,
            msg: '系统错误'
          })
        } else {
          connection.destroy();
          res.send({
            code: 200,
            msg: '',
            data: rows
          })
        }
      })
    }
  })
})
// 新增
app.post('/api/tokenBalanceHistory', (req, res) => {
  const { tokenAddress,contractAddress,tokenName,chainName,balance } = req.body;
  if (tokenAddress&&contractAddress&&tokenName&&chainName&&balance) {
    db.getConnection(function (err, connection) {
      if (err) {
        console.log("建立连接失败", err);
      } else {
        connection.query(`INSERT INTO tokenBalanceHistory
        (\`tokenAddress\`, \`contractAddress\`, \`tokenName\`,\`chainName\`,\`balance\`)
        VALUES('${tokenAddress}', '${contractAddress}','${tokenName}',
        '${chainName}', '${balance}')`, function (err, rows) {
          if (err) {
            console.log(err);
            connection.destroy();
            res.send({
              code: 500,
              msg: '系统错误'
            })
          } else {
            connection.destroy();
            res.send({
              code: 200,
              msg: "操作成功"
            })
          }
        })

      }
    })


  }
  else {
    res.send({ code: 102, msg: '参数不完整' })
  }
})
// 监听端口
app.listen(5000, () => {
  console.log("服务已经启动，5000 端口监听中...");
})
