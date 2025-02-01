import { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import './Searchbar.css';

export default class Searchbar extends Component {
  render() {
    return (
      <Input
        type="search"
        className="searchbar"
        onChange={this.props.search}
        placeholder="Type to search..."
      />
    );
  }
}

Searchbar.propTypes = {
  search: PropTypes.func.isRequired,
};
