import { type RouteObject, useRoutes } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import LoginApp from "../pages/Login";

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      }
    ]
  },
  {
    path:'/login',
    element: <LoginApp></LoginApp>
  }
]

export default function RouterView() {
  return useRoutes(routes)
}