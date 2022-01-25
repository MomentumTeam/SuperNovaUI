import { useEffect } from "react";
import healthStore from '../../store/Health';
import "../../assets/css/local/pages/errorpages.css";
import { useStores } from '../../context/use-stores';

const Error503 = () => {  
  const { configStore } = useStores();

  useEffect(() => {
    const healthcheck = setInterval(async () => {
      await healthStore.loadHealth()
      if (healthStore.isApiHealthy) return window.location.replace('/');
    }, 10000);
    return () => clearInterval(healthcheck);
  }, []);

  return (
    <div className="backgroundError">
      <div className="error503">
        <div className="inner">
          <div className="content">
            <h5>503</h5>
            <h1>המערכת אינה זמינה</h1>

            <br />
            <h2>נשוב בקרוב</h2>

            <h5>{`לתמיכה אנא פנו לצא'ט "${configStore.HI_CHAT_SUPPORT_GROUP_NAME}" במערכת היי צ'אט`}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error503;
