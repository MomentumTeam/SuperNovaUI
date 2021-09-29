import SideMenu from '../components/Layout/SideMenu';

const MainLayout = ({ children }) => {
  return (
    <>
      <SideMenu />
      <>{children}</>
    </>
  );
};

export default MainLayout;
