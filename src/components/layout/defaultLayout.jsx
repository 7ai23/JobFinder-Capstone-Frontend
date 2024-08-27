import Header from "../User/Homepage/Common/Header";
import Footer from "../User/Homepage/Common/Footer";
import { Outlet } from "react-router-dom";

function DefaultLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default DefaultLayout;
