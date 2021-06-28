import Menu from '../components/menu';

const MainLayout = ({children}) => {
    return (
        <>
            <Menu />
            <>
                {children}
            </>
        </>
    )
}

export default MainLayout;