
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { AutoComplete } from 'primereact/autocomplete';
import { getCountries } from '../service/CountryService';
import Search from './Search';
import ChartForTree from './ChartForTree';

class ModalHierarchy extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            displayBasic: false,
            displayBasic2: false,
            displayModal: false,
            displayMaximizable: false,
            displayPosition: false,
            displayResponsive: false,
            position: 'center',
            countries: [],
            selectedCountry1: null,
            selectedCountry2: null,
            selectedCountries: null,
            filteredCountries: null,

        };

        this.onClick = this.onClick.bind(this);
        this.onHide = this.onHide.bind(this);

        this.searchCountry = this.searchCountry.bind(this);
        // this.countryservice = new CountryService();
        this.items = Array.from({ length: 100000 }).map((_, i) => ({ label: `Item #${i}`, value: i }));
    }

    componentDidMount() {
        getCountries().then(data => this.setState({ countries: data }));
    }

    searchCountry(event) {
        setTimeout(() => {
            let filteredCountries;
            if (!event.query.trim().length) {
                filteredCountries = [...this.state.countries];
            }
            else {
                filteredCountries = this.state.countries.filter((country) => {
                    return country.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            this.setState({ filteredCountries });
        }, 250);
    }

    onClick(name, position) {

        // this.props.callbackModalHide();

        let state = {
            [`${name}`]: true
        };

        if (position) {
            state = {
                ...state,
                position
            }
        }

        this.setState(state);


    }

    onHide(name, isDelete) {
        // if (!isDelete)
        //     this.props.callbackModalShow();
        // else
        //     this.props.callbackModalClose();
        this.setState({
            [`${name}`]: false
        });
    }



    renderFooter(name) {
        return (
            <div className="display-flex display-flex-end">
                <Button label="ביטול" onClick={() => this.onHide(name, false)} className="btn-underline" />
                <Button label="בחירה" onClick={() => this.onHide(name, true)} className="btn-gradient orange" />
            </div>
        );
    }
    render() {
        return (
            <div>
                <Button title="פתיחת היררכיה" className="OpeningHierarchy" type="button" label="פתיחת היררכיה" onClick={() => this.onClick('displayBasic')} />

                <Dialog className="dialogClass9" header="היררכיה" visible={this.state.displayBasic} footer={this.renderFooter('displayBasic')} onHide={() => this.onHide('displayBasic')}>
                    <div>
                        <Button className="btn-back" type="button" label="חזרה" />
                        <h2>חיפוש</h2>

                        <div className="search-row-inner style2">
                            <Search />
                        </div>

                        <div>
                            <ChartForTree />
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}
export default ModalHierarchy