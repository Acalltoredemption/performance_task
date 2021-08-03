import React from "react";
import "./Filter.css";

class Filter extends React.Component<any> {
  state = {
    district: "",
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state);
      }
    });
  };

  render() {
    return (
      <div className="filterscard">
        <div className="dropdownstyler">
          <label className="dropdown" htmlFor="district">
            Filter by District:{" "}
          </label>
          <select
            name="district"
            value={this.state.district}
            onChange={this.handleChange}
          >
            <option onSelect={this.handleChange}>Select a District</option>
            <option onSelect={this.handleChange}>1</option>
            <option onSelect={this.handleChange}>2</option>
            <option onSelect={this.handleChange}>3</option>
            <option onSelect={this.handleChange}>4</option>
          </select>
        </div>
      </div>
    );
  }
}

export default Filter;
