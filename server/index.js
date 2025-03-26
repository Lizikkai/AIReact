import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import Koa from 'koa';
import mysql from 'mysql2/promise';
const app = new Koa();
const router = new Router({ prefix: '/api/v1' });

// 创建数据库连接池
const pool = mysql.createPool({
  // 47.236.137.139
  host: '47.236.137.139',
  user: 'root', // 替换为你的MySQL用户名
  password: 'mysql_hSAz7i', // 替换为你的MySQL密码
  database: 'user_info', // 替换为你的数据库名
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // 启动保活机制
  enableKeepAlive: true,
  // 空闲连接
  keepAliveInitialDelay: 10000,
  // 连接超时时间
  connectTimeout: 10000
})

pool.on('error', function (err) {
  console.log('db error', err)
  if (
    err.code === 'PROTOCOL_CONNECTION_LOST' ||
    err.code === 'ECONNRESET' ||
    err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR'
  ) {
    // 重新连接
    handleDisconnect()
  } else {
    throw err
  }
})

function handleDisconnect() {
  // 重新建立连接的逻辑
  pool
    .getConnection()
    .then(connection => {
      console.log('数据库重连成功')
      connection.release()
    })
    .catch(err => {
      console.log('数据库重连失败', err)
      setTimeout(handleDisconnect, 2000)
    })
}