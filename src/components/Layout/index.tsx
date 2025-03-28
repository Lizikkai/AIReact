import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <main className="box-border min-h-screen bg-hex-[#FAFAFA]">
      <Outlet></Outlet>
    </main>
  )
}