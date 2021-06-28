
const Header = () => (
    <div className="display-flex title-wrap">
    <div className="display-flex h-wrap">
        <h2>רשימת משתמשים</h2>
        <h3>רשימת קבוצות</h3>
    </div>
    <div className="display-flex display-flex-end btns-wrap">
        <button className="btn btn-notification" title="Notification" type="button">
            <span className="for-screnReader">Notification</span>
        </button>
        <button className="btn btn-humburger" title="Humburger" type="button">
            <span className="for-screnReader">Humburger</span>
        </button>
    </div>
</div>
)

export default Header;