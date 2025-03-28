import bodyParser from "koa-bodyparser";
import Router from "@koa/router";
import Koa from "koa";
import mysql from "mysql2/promise";
import serve from "koa-static";
import cors from "@koa/cors";
import "dotenv/config";
const app = new Koa();
const router = new Router({ prefix: "/api/v1" });

// 创建数据库连接池
const pool = mysql.createPool({
  // 47.236.137.139
  host: "47.236.137.139",
  user: "root", // 替换为你的MySQL用户名
  password: "mysql_hSAz7i", // 替换为你的MySQL密码
  database: "user_info", // 替换为你的数据库名
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // 启动保活机制
  enableKeepAlive: true,
  // 空闲连接
  keepAliveInitialDelay: 10000,
  // 连接超时时间
  connectTimeout: 10000
});

pool.on("error", function (err) {
  console.log("db error", err);
  if (
    err.code === "PROTOCOL_CONNECTION_LOST" ||
    err.code === "ECONNRESET" ||
    err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"
  ) {
    // 重新连接
    handleDisconnect();
  } else {
    throw err;
  }
});

function handleDisconnect() {
  // 重新建立连接的逻辑
  pool
    .getConnection()
    .then((connection) => {
      console.log("数据库重连成功");
      connection.release();
    })
    .catch((err) => {
      console.log("数据库重连失败", err);
      setTimeout(handleDisconnect, 2000);
    });
}

app.use(
  cors({
    /** 允许所有域名的请求访问你的 API */
    origin: "*",
    /** 指定允许的 HTTP 请求方法 */
    allowMethods: ["GET", "POST", "OPTIONS", "DELETE", "PUT"],
    /** 允许客户端在请求中携带的 HTTP 头 */
    allowHeaders: ["Content-Type", "Authorization"],
    /** 允许浏览器访问的响应头 */
    exposeHeaders: ["Authorization"]
  })
);
/**
 * 这是一个 Koa 中间件，用于解析 HTTP 请求体
 * 它可以自动解析以下格式的数据：
 * - JSON
 * - form 表单数据
 * - text 文本数据
 * 解析后的数据会存储在 ctx.request.body 中
 * 这样在处理 POST 请求时就可以直接获取到请求体中的数据
 */
app.use(bodyParser());
/**
 * 这是 koa-static 中间件，用于提供静态文件服务
 * 'public' 参数指定了静态文件所在的目录
 * 当浏览器请求静态资源时（如图片、CSS、JavaScript文件等），会自动从 public 目录中查找并返回
 */
app.use(serve("public"));

/**
 * 错误处理的中间件
 */
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error(err);
    ctx.status = err.status || 500;
    ctx.body = {
      code: 1,
      message: err.message || "服务器错误",
      content: null
    };
  }
});

/** 校验token的中间件 */
const verifyToken = async (ctx, next) => {
  /** 从请求头获取token */
  const authHeader =
    ctx.headers["authorization"] || ctx.headers["Authorization"];
  if (!authHeader) {
    ctx.status = 401;
    ctx.body = {
      code: 1,
      message: "登录信息已失效，请重新登录",
      content: null
    };
    return;
  }

  const token =
    authHeader &&
    authHeader.replace(/^Bearer\s+Bearer\s+/, "Bearer ").split(" ")[1];
  if (!token) {
    ctx.status = 401;
    ctx.body = {
      code: 1,
      message: "登录信息失效",
      content: null
    };
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = decoded;
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = {
      code: 1,
      message: "登录已过期",
      content: null
    };
  }
};

/** 登录接口 */
router.post("/api/v1/login", async (ctx) => {
  try {
    const { name, password } = ctx.request.body;
    if (!name || !password) {
      ctx.status = 400;
      ctx.body = {
        code: 1,
        message: "用户名或密码不能为空",
        content: null
      };
      return;
    }
    const [rows] = await pool.query(
      "SELECT * FROM user_info.info WHERE name = ? AND password = ?",
      [name, password]
    );
    if (rows.length > 0) {
      const token = jwt.sign(
        {
          userId: rows[0].id,
          username: rows[0].name,
          password: rows[0].password,
          mobile: rows[0].mobile
        },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
      );
      ctx.set("Authorization", `Bearer ${token}`);
      ctx.body = {
        code: 0,
        message: "登录成功",
        content: {
          userId: rows[0].id,
          username: rows[0].name,
          password: rows[0].password,
          mobile: rows[0].mobile
        }
      };
    } else {
      ctx.status = 401;
      ctx.body = {
        code: 1,
        message: "用户名或密码错误",
        content: null
      };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      code: 1,
      message: "服务器错误",
      content: null
    }
  }
});


// 启动服务器
app.listen(9999, () => {
  console.log('服务器运行在 9999 端口')
})