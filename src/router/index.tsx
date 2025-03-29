import { Navigate, type RouteObject, useRoutes } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import LoginApp from "@/pages/Login";
import PageNotFound from '@/pages/NotFound'
import Conversation from "@/pages/Conversation";
import { getToken } from "@/utils/ls";

const Auth = ({ children }: { children: React.ReactNode }) => {
  const token = getToken();
  if (token && window.location.pathname === '/login') {
    return <Navigate to="/" replace></Navigate>
  }
  if (!token && window.location.pathname !== '/login') {
    return <Navigate to="/login" replace></Navigate>
  }
  return children
}

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Auth>
          <Home />
        </Auth>
      },
      {
        path: '/conversation',
        element: <Auth><Conversation /></Auth>
      }
    ]
  },
  {
    path:'/login',
    element: <Auth>
      <LoginApp />
    </Auth>
  },
  {
    path: '*',
    element: <PageNotFound />
  }
]


export default function RouterView() {
  return useRoutes(routes)
}