import { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';

const items = [
  {
    label: 'Search',
    key: 'search',
    className: 'menu__item',
  },
  {
    label: 'Rated',
    key: 'rated',
    className: 'menu__item',
  },
];

export default class Header extends Component {
  render() {
    const { active, setActive } = this.props;
    return (
      <header className="header">
        <Tabs
          onChange={setActive}
          className="menu"
          items={items}
          mode="horizontal"
          activeKey={active}
          centered
          size="large"
        />
      </header>
    );
  }
}

Header.propTypes = {
  active: PropTypes.string.isRequired,
  setActive: PropTypes.func.isRequired,
};
