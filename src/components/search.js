import React from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { getCountries } from '../service/CountryService';

class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            countries: [],
            selectedCountry1: null,
            selectedCountry2: null,
            selectedCountries: null,
            filteredCountries: null,
        };

        this.searchCountry = this.searchCountry.bind(this);
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

    render() {
        return (
            <div className="search-item">
                <div className="autocomplete-wrap">

                    <div className="p-fluid">
                        <span className="p-float-label">
                            <AutoComplete value={this.state.selectedCountry1} suggestions={this.state.filteredCountries} completeMethod={this.searchCountry} field="name" onChange={(e) => this.setState({ selectedCountry1: e.value })} />
                            <label htmlFor="autocomplete">שם/מ"א/ת"ז </label>
                        </span>
                    </div>
                </div>
                <div className="autocomplete-wrap">
                    <div className="p-fluid">
                        <span className="p-float-label">
                            <AutoComplete value={this.state.selectedCountries} suggestions={this.state.filteredCountries} completeMethod={this.searchCountry} field="name" multiple onChange={(e) => this.setState({ selectedCountries: e.value })} />
                            <label htmlFor="autocomplete2">היררכיה</label>
                        </span>
                    </div>
                </div>
                <div className="autocomplete-wrap">
                    <div className="p-fluid">
                        <span className="p-float-label">
                            <AutoComplete value={this.state.selectedCountry2} suggestions={this.state.filteredCountries} completeMethod={this.searchCountry} field="name" onChange={(e) => this.setState({ selectedCountry2: e.value })} />
                            <label htmlFor="autocomplete3">חיפוש לפי תפקיד</label>
                        </span>
                    </div>
                </div>
                <button className="btn btn-search-wite" title="Print" type="button"><span className="for-screnReader">Print</span></button>
            </div>
        )
    }
}



export default Search

