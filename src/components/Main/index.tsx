import { Outlet } from "react-router-dom";

export default function Main() {
  return (
    <div className="mx-auto min-w-1024px">
      <Outlet></Outlet>
    </div>
  )
}