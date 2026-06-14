import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f5]">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <div className="page-enter h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}