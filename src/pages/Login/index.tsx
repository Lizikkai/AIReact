import React, { useRef, useEffect, useState } from "react";
import styles from "./index.module.css"; // 原CSS样式文件（需微调选择器）
import clsx from "clsx";
import { Form } from "antd";

interface Star {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  hue: number;
}

const LoginPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const stars = useRef<Star[]>([]);
  const animationFrameId = useRef<number>(Date.now());

  // 初始化参数配置
  const config = {
    maxStars: 150, // 星星数量
    hue: 200, // 基础色调
    starSpeed: 0.3, // 移动速度
    starRadius: 3, // 星星半径
    trailLength: 0.5 // 拖尾效果
  };

  // 初始化Canvas
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 生成初始星星
    stars.current = Array.from({ length: config.maxStars }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * config.starRadius,
      vx: Math.random() * config.starSpeed * 2 - config.starSpeed,
      vy: Math.random() * config.starSpeed * 2 - config.starSpeed,
      hue: config.hue
    }));
  };

  // 绘制动画帧
  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgba(0, 0, 20, ${config.trailLength})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";

    stars.current.forEach((star, i) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(
        star.x,
        star.y,
        0,
        star.x,
        star.y,
        star.radius
      );
      gradient.addColorStop(0, `hsla(${star.hue}, 100%, 85%, 1)`);
      gradient.addColorStop(1, `hsla(${star.hue}, 100%, 85%, 0)`);
      ctx.fillStyle = gradient;
      ctx.fill();

      // 更新位置
      star.x += star.vx;
      star.y += star.vy;

      // 边界检测
      if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
      if (star.y < 0 || star.y > canvas.height) star.vy *= -1;
    });

    animationFrameId.current = requestAnimationFrame(draw);
  };

  // 处理窗口大小变化
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initCanvas();
  };

  useEffect(() => {
    initCanvas();
    draw();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
  };

  function LoginForm() {
    return (
      <Form {...layout} layout="horizontal" onFinish={handleLoginFinish} autoComplete="off">
        <Form.Item name="name" label="用户名"></Form.Item>
        <Form.Item name="password" label="密码"></Form.Item>
      </Form>
    );
  }

  function RegisterForm() {
    return (
      <Form {...layout} layout="horizontal" onFinish={handleRegisterFinish}>
        <Form.Item></Form.Item>
      </Form>
    )
  }

  function handleLoginFinish(values: any) {
    console.log(values);
  }
  function handleRegisterFinish(values: any) {
    console.log(values);
  }

  function Header() {
    return (
      <div className={styles.loginBox}>
        <div className={styles.loginHeader}>
          <h2 className={styles.welcomeText}>欢迎使用</h2>
        </div>
        <div className={styles.tabs}>
          <div className={styles.tab} onClick={() => setActiveTab("login")}>
            登录
          </div>
          <div className={styles.tab} onClick={() => setActiveTab("register")}>
            注册
          </div>
        </div>
        <div className={styles.formContainer}>
          {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    );
  }

  function handleLogin() {}
  function handleRegister() {}

  return (
    <div className={clsx(styles.loginContainer, "relative")}>
      <canvas ref={canvasRef} className={styles.loginCanvas} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-2">
        <Header></Header>
      </div>
    </div>
  );
};

export default LoginPage;
