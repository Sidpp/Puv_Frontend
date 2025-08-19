import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import Sidebar from "../../components/Dashboard/common/Sidebar"


function Dashboard() {
  const { loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-6rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    // This parent div now has a fixed height and prevents its children from overflowing it.
    // This is the key to removing the browser's scrollbar.
    <div className="relative flex h-[calc(100vh-6rem)] overflow-hidden">
      <Sidebar />

    
      <div className="flex-1 ">
      <div className="h-full w-full overflow-y-auto  lg:ml-34">
            <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard