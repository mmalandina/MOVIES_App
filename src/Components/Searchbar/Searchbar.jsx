import PropTypes from 'prop-types';
import { Input } from 'antd';
import './Searchbar.css';

const Searchbar = ({ value, onSearchChange }) => (
  <Input
    className="searchbar"
    placeholder="Type to search..."
    value={value}
    onChange={onSearchChange}
  />
);

Searchbar.propTypes = {
  value: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default Searchbar;
