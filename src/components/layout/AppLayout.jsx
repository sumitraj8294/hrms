import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import backgroundImage from '@/assets/background.png'

export default function AppLayout() {
  return (
    <div
      className="relative flex h-screen overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

      <div className="relative z-10 flex w-full">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />

          <main className="flex-1 overflow-y-auto">
            <div className="page-enter h-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}