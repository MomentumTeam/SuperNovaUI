import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import ModalForm from './modal-form';
import '../assets/css/local/components/modal-item.min.css';

const Toolbar = () => {
  const [isDialogShown, setIsDialogShown] = useState(false);
  const [actionList, setActionList] = useState([]);

  useEffect(() => {
    setActionList([
      {
        id: '1',
        className: 'btn-actions btn-actions1',
        actionName: 'תפקיד חדש',
      },
      {
        id: '2',
        className: 'btn-actions btn-actions2',
        actionName: 'שינוי היררכיה',
      },
      {
        id: '3',
        className: 'btn-actions btn-actions3',
        actionName: 'מעבר תפקיד',
      },
      {
        id: '4',
        className: 'btn-actions btn-actions4',
        actionName: 'הוספת משתמש',
      },
      {
        id: '5',
        className: 'btn-actions btn-actions5',
        actionName: 'היררכיה חדשה',
      },
      {
        id: '6',
        className: 'btn-actions btn-actions6',
        actionName: 'גורם מאשר',
      },
    ]);
  }, []);

  const showDialog = () => {
    setIsDialogShown(true);
  };

  const hideDialog = () => {
    setIsDialogShown(false);
  };

  const renderFooter = () => {
    return (
      <div className='display-flex display-flex-end'>
        <Button label='ביטול' onClick={hideDialog} className='btn-underline' />
        <Button
          label='שמירה'
          onClick={hideDialog}
          className='btn-orange-gradient'
        />
      </div>
    );
  };

  return (
    <ul className='display-flex units-wrap'>
      {actionList.map(({ id, className, actionName }) => (
        <li key={id}>
          <Button
            className={className}
            title={actionName}
            label={actionName}
            onClick={showDialog}
          />
        </li>
      ))}
      <Dialog
        header='תפקיד חדש'
        visible={isDialogShown}
        onHide={hideDialog}
        footer={renderFooter()}
      >
        <ModalForm />
      </Dialog>
    </ul>
  );
};

export default Toolbar;
