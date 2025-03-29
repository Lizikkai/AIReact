import React, { useRef, useEffect, useState } from "react";
import styles from "./index.module.css"; // 原CSS样式文件（需微调选择器）
import clsx from "clsx";
import { Form, Input, Button, Checkbox, Flex, message } from "antd";
import { LockOutlined, UserOutlined, PhoneOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Login, Register } from "@/apis";
import { Rule } from "antd/es/form";
import { sleep } from "@/utils/app";

interface Star {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  hue: number;
}

type LoginField = {
  name: string;
  password: string;
  remember: boolean;
};

type RegisterField = {
  name: string;
  password: string;
  confirmPassword: string;
  mobile: string;
};

const LoginPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);
  const [loginInfo, setLoginInfo] = useState(getInitialLoginValues());
  const [registerInfo, setRegisterInfo] = useState(getInitialRegisterValues());
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const stars = useRef<Star[]>([]);
  const animationFrameId = useRef<number>(Date.now());
  const navigate = useNavigate();
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

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

  function getInitialLoginValues(): LoginField {
    return {
      name: "",
      password: "",
      remember: false // 初始值为false，即不记住用户登录状态
    };
  }

  function getInitialRegisterValues(): RegisterField {
    return {
      name: "",
      password: "",
      confirmPassword: "",
      mobile: ""
    };
  }

  function LoginForm() {
    return (
      <Form
        form={loginForm}
        wrapperCol={{ flex: 1 }}
        layout="horizontal"
        onFinish={handleLoginFinish}
        autoComplete="off"
      >
        <Form.Item
          rules={[{ required: true, message: "请填写您的用户名" }]}
          name="name"
        >
          <Input
            prefix={<UserOutlined />}
            value={loginInfo.name}
            allowClear={true}
            placeholder="请输入用户名"
          ></Input>
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "请填写您的密码" }]}
        >
          <Input.Password
            placeholder="请输入密码"
            value={loginInfo.password}
            prefix={<LockOutlined />}
            allowClear={true}
          />
        </Form.Item>
        <Form.Item>
          <Flex justify="space-between" align="center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <a href="">忘记密码</a>
          </Flex>
        </Form.Item>
        <Form.Item>
          <Button
            size="large"
            loading={loginLoading}
            htmlType="submit"
            type="primary"
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    );
  }

  function RegisterForm() {
    return (
      <Form
        wrapperCol={{ flex: 1 }}
        layout="horizontal"
        onFinish={handleRegisterFinish}
        form={registerForm}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "请填写您的用户名" }]}
        >
          <Input
            prefix={<UserOutlined />}
            value={registerInfo.name}
            allowClear={true}
            placeholder="请输入用户名"
          ></Input>
        </Form.Item>
        <Form.Item
          name="mobile"
          rules={[ { required: true, message: "请填写您的手机号码" }, { pattern: /^1[3-9]\d{9}$/, message: '请输入正确格式的手机号码' } ]}
        >
          <Input
            placeholder="请输入手机号码"
            prefix={<PhoneOutlined />}
            value={registerInfo.mobile}
            allowClear={true}
          ></Input>
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "请填写您的密码" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            value={registerInfo.password}
            allowClear={true}
            placeholder="请输入密码"
          ></Input.Password>
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          rules={[ { required: true, validator: validateConfirmPassword }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            value={registerInfo.confirmPassword}
            allowClear={true}
            placeholder="请再次确认密码"
          ></Input.Password>
        </Form.Item>
        <Form.Item>
          <Flex justify="space-between" align="center">
            <Button size="large" htmlType="submit" type="primary" loading={registerLoading}>
              注册
            </Button>
            <div className="flex gap-2 items-center">
              <span>已有账号?</span>
              <span
                className="primary-link"
                onClick={() => setActiveTab("login")}
              >
                返回登录
              </span>
            </div>
          </Flex>
        </Form.Item>
      </Form>
    );
  }

  const validateConfirmPassword = (rule: Rule, value: string) => {
    if(!value) {
      return Promise.reject(new Error("请再次输入密码"));
    }else {
      if(value !== registerForm.getFieldsValue(['password']).password) {
        return Promise.reject(new Error("两次输入的密码不一致"));
      }
    }
    return Promise.resolve();
  }

  function handleLoginFinish(values: LoginField) {
    setLoginLoading(true);
    const body = {
      name: values.name,
      password: values.password
    } as LoginField;
    Login(body).then(() => {
      setLoginLoading(false);
      navigate("/");
    }).catch(() => {
      setLoginLoading(false);
    })
  }
  function handleRegisterFinish(values: any) {
    console.log(values);
    setRegisterLoading(true);
    const body = {
      name: values.name,
      password: values.password,
      mobile: values.mobile
    } as RegisterField;
    Register(body).then(async () => {
      setRegisterLoading(false);
      navigate("/");
      await sleep(1000);
      setActiveTab("login");
    }).catch(() => {
      setRegisterLoading(false);
    })
  }

  function Header() {
    return (
      <div className={styles.loginBox}>
        <div className={styles.loginHeader}>
          <h2 className={styles.welcomeText}>欢迎使用</h2>
        </div>
        <div className={styles.tabs}>
          <div
            className={clsx(styles.tab, {
              [styles.active]: activeTab === "login"
            })}
            onClick={() => setActiveTab("login")}
          >
            登录
          </div>
          <div
            className={clsx(styles.tab, {
              [styles.active]: activeTab === "register"
            })}
            onClick={() => setActiveTab("register")}
          >
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
      <div
        className={clsx(
          styles.loginWrapper,
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        )}
      >
        <Header></Header>
      </div>
    </div>
  );
};

export default LoginPage;
