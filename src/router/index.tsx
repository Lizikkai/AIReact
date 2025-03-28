import { type RouteObject, useRoutes } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import LoginApp from "@/pages/Login";
import PageNotFound from '@/pages/NotFound'

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
    element: <LoginApp />
  },
  {
    path: '*',
    element: <PageNotFound />
  }
]

export default function RouterView() {
  return useRoutes(routes)
}