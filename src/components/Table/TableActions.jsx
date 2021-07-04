/** @format */

import { useRef } from 'react';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const TableActions = () => {
  const toast = useRef(null);
  const menu = useRef(null);

  const actions = [
    {
      label: 'צפייה',
      command: () => {
        toast.current.show({
          severity: 'success',
          summary: 'צפייה',
          detail: 'Data Viewing',
          life: 3000,
        });
      },
    },
    {
      label: 'עריכת תפקיד',
      command: () => {
        toast.current.show({
          severity: 'success',
          summary: 'עריכת תפקיד',
          detail: 'Data Editing a role',
          life: 3000,
        });
      },
    },
    {
      label: 'מחיקה',
      command: () => {
        toast.current.show({
          severity: 'success',
          summary: 'מחיקה',
          detail: 'Data Request permission',
          life: 3000,
        });
      },
    },
  ];

  const openMenu = (event) => {
    menu.current.toggle(event);
  };

  return (
    <div className='moreBtnwrap'>
      <Toast ref={toast}></Toast>
      <Menu model={actions} popup ref={menu} />
      <Button className='btn more-btn' onClick={openMenu} />
    </div>
  );
};

export default TableActions;
