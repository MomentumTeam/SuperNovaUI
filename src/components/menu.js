import React from 'react';


class Menu extends React.Component {
    render() {
        return (
            <div class="main-inner-item main-inner-item-nav">
                <nav>
                    <ul >
                        <li>
                            <a href="#" class="aside-item-btn aside-item-btn1" title="name">
                                <span class="for-screnReader">Name</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" class="aside-item-btn aside-item-btn2" title="name">
                                <span class="for-screnReader">Name</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" class="aside-item-btn aside-item-btn3" title="name">
                                <span class="for-screnReader">Name</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" class="aside-item-btn aside-item-btn4" title="name">
                                <span class="for-screnReader">Name</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" class="aside-item-btn aside-item-btn5" title="name">
                                <span class="for-screnReader">Name</span>
                            </a>
                        </li>
                    </ul>
                </nav>
                <div>
                    <div class="logout-btn-wrap">
                        <button class="logout-btn" title="Logout" type="button">
                            <span class="for-screnReader">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        )

    }
}



export default Menu;