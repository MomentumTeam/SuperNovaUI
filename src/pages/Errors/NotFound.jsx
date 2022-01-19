import { Link } from 'react-router-dom';


import '../../assets/css/local/pages/errorpages.css';

const NotFound = () => (
  <div className="backgroundErrorNotFound">
    <div className="notFound">
      <div className="inner">
        <div className="content">
          <h1>404</h1>
          <h2>הדף שחיפשת לא קיים</h2>

          <br />
          <h2>
            <Link to="/" className="linkHome">
              חזור הביתה
            </Link>
          </h2>
        </div>
      </div>
    </div>
  </div>
);

export default NotFound;



