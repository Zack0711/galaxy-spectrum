import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

const DropdownMenu = props => {
  const {
    buttonVariant,
    disabled,
    label,
    list,
    onMenuClick,
    selected,
  } = props

  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpen = e => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuClick = item => () => {
    onMenuClick(item)    
    handleClose()
  }

  return (
    <div style={{ margin: '0 16px' }}>
      <Button 
        onClick={handleOpen} 
        disabled={disabled} 
        variant={buttonVariant}
      >
        {label}
        <ArrowDropDownIcon />
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {
          list.map((item, i) => (
            <MenuItem 
              key={`${item.label}-${i}`}
              onClick={handleMenuClick(item)}
              selected={selected && (item.value === selected.value)}
            >
              {item.label}
            </MenuItem>
          ))
        }
      </Menu>
    </div>
  )
}

DropdownMenu.defaultProps = {
  buttonVariant: 'text',
  disabled: false,
  list: [],
}

DropdownMenu.propTypes = {
  buttonVariant: PropTypes.oneOf(['text', 'outlined', 'contained']),
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number]),
  })),
  onMenuClick: PropTypes.func,
  selected: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number]),
  })
}

export default DropdownMenu