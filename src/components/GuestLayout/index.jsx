import { Outlet } from "react-router-dom";

function GuestLayout() {
  return (
    <div className='h-screen bg-gray-100'>
      <Outlet />
    </div>
  );
}

export default GuestLayout;
