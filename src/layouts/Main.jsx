import SideMenu from '../components/Layout/SideMenu';
import SocketWrapper from "../components/Layout/SocketWrapper";

const MainLayout = ({ children }) => {
  return (
    <>
      <SideMenu />
      <SocketWrapper />
      <>{children}</>
    </>
  );
};

export default MainLayout;
