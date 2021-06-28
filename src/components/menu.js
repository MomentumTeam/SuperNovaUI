import React from 'react';
import logo from '../assets/images/logo.png';
import '../assets/css/local/components/menu.min.css';
import {
    BrowserRouter as Router,
    Link
} from "react-router-dom";

class Menu extends React.Component {

    componentDidMount() {
        if (window.location.pathname == '/listUsersPage')
            this.setState({ pageClicked: 'menu5' })

    }
    state = {
        pageClicked: 'menu1'

    }
    toggleMenu = (type) => (event) => {
        this.setState({ pageClicked: type })
    }
    render() {
        const { pageClicked } = this.state
        return (
            <div className="main-inner-item main-inner-item-nav">
                <nav>
                    <ul >
                        <li>
                            <Link className={"aside-item-btn aside-item-btn1 " + (pageClicked == 'menu1' ? 'active' : '')} onClick={this.toggleMenu('menu1')} title="Home" to="/">
                                <span className="for-screnReader">Home</span>
                            </Link>
                        </li>
                        <li>
                            <Link className={"aside-item-btn aside-item-btn2 " + (pageClicked == 'menu2' ? 'active' : '')} onClick={this.toggleMenu('menu2')} title="Home" to="/">
                                <span className="for-screnReader">Home</span>
                            </Link>
                        </li>
                        <li>
                            <Link className={"aside-item-btn aside-item-btn3 " + (pageClicked == 'menu3' ? 'active' : '')} onClick={this.toggleMenu('menu3')} title="Home" to="/">
                                <span className="for-screnReader">Home</span>
                            </Link>
                        </li>
                        <li>
                            <Link className={"aside-item-btn aside-item-btn4 " + (pageClicked == 'menu4' ? 'active' : '')} onClick={this.toggleMenu('menu4')} title="Home" to="/">
                                <span className="for-screnReader">Home</span>
                            </Link>
                        </li>
                        <li>

                            <Link className={"aside-item-btn aside-item-btn5 " + (pageClicked == 'menu5' ? 'active' : '')} onClick={this.toggleMenu('menu5')} title="Home" to="/listUsersPage">
                                <span className="for-screnReader">Home</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div>
                    <div className="logo-wrap">
                        <h1>
                            <img src={logo} alt="Logo יסודות" />
                        </h1>
                    </div>

                </div>
            </div>
        )

    }
}



export default Menu;