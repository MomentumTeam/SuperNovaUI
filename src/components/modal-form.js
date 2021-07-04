import React from 'react';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
class ModalForm extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedState: null,
    };

    this.states = [
      { name: 'מספר1', code: 'מספר1' },
      { name: 'מספר2', value: 'מספר2' },
      { name: 'מספר3', code: 'מספר3' },
      { name: 'מספר4', code: 'מספר4' },
      { name: 'מספר5', code: 'מספר5' },
    ];

    this.onStateChange = this.onStateChange.bind(this);
  }

  onStateChange(e) {
    this.setState({ selectedState: e.value });
  }

  render() {
    return (
      <div className='p-fluid'>
        <div className='p-fluid-item'>
          <div className='p-field '>
            <label htmlFor='2020'>
              {' '}
              <span className='required-field'>*</span> שם תפקיד
            </label>
            <InputText id='2020' type='text' required placeholder='שם תפקיד' />
          </div>
        </div>
        <div className='p-fluid-item'>
          <div className='p-field'>
            <label htmlFor='2021'>תגית תפקיד</label>
            <Dropdown
              inputId='2021'
              value={this.state.selectedState}
              options={this.states}
              onChange={this.onStateChange}
              placeholder='תגית תפקיד'
              optionLabel='name'
            />
          </div>
        </div>
        <div className='p-fluid-item-flex p-fluid-item'>
          <div className='p-field'>
            <label htmlFor='2022'>
              <span className='required-field'>*</span> היררכיה{' '}
            </label>
            <InputText id='2022' type='text' required placeholder='היררכיה' />
          </div>
          <Button className='pi pi-plus' type='button' label='Submit' />
        </div>
        <div className='p-fluid-item-flex p-fluid-item'>
          <div className='p-field'>
            <label htmlFor='2023'>
              <span className='required-field'>*</span> גורם מאשר{' '}
            </label>
            <Dropdown
              inputId='2023'
              required
              value={this.state.selectedState}
              options={this.states}
              onChange={this.onStateChange}
              placeholder='גורם מאשר'
              optionLabel='name'
            />
          </div>
          <Button className='pi pi-plus' type='button' label='Submit' />
        </div>
        <div className='p-fluid-item'>
          <button class='btn-underline' type='button' title='עבורי'>
            עבורי
          </button>
          <div className='p-field'>
            <label htmlFor='2024'>
              <span className='required-field'>*</span> משתמש בתפקיד{' '}
            </label>
            <InputText
              id='2024'
              type='text'
              required
              placeholder='משתמש בתפקיד'
            />
          </div>
        </div>
        <div className='p-fluid-item'>
          <div className='display-flex'>
            <div className='p-field w50'>
              <label htmlFor='2025'>
                <span className='required-field'>*</span> מ"א{' '}
              </label>
              <InputText id='2025' type='text' required placeholder="מ''א" />
            </div>
            <div className='p-field w50'>
              <label htmlFor='2026'>סטטוס</label>
              <Dropdown
                inputId='2026'
                value={this.state.selectedState}
                options={this.states}
                onChange={this.onStateChange}
                placeholder='סטטוס'
                optionLabel='name'
              />
            </div>
          </div>
        </div>
        <div className='p-fluid-item'>
          <div className='p-field'>
            <label htmlFor='2027'>
              <span className='required-field'>*</span> פרטי תפקיד / תיאור{' '}
            </label>
            <InputTextarea
              id='2027'
              type='text'
              required
              placeholder='פרטי תפקיד / תיאור'
              rows='4'
            />
          </div>
        </div>
        <div className='p-fluid-item'>
          <div className='p-field'>
            <label htmlFor='2028'>הערות</label>
            <InputTextarea id='2028' type='text' placeholder='הערות' rows='4' />
          </div>
        </div>
      </div>
    );
  }
}

export default ModalForm;
