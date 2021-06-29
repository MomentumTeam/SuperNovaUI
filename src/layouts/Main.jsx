import SideMenu from '../components/SideMenu';

const MainLayout = ({children}) => {
    return (
        <>
            <SideMenu />
            <>
                {children}
            </>
        </>
    )
}

export default MainLayout;