import React, { Component } from "react";
import {
  Typography,
  Tooltip
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { colors } from "../../theme";
import { withNamespaces } from 'react-i18next';

import {
  GOVERNANCE_CONTRACT_CHANGED
} from '../../constants'

import config from '../../config'
import Store from "../../stores";
const store = Store.store
const emitter = Store.emitter

const styles = theme => ({
  versionToggleContainer: {
    position: 'absolute',
    top: '112px',
    right: '12px',
    zIndex: 999,
    [theme.breakpoints.down('sm')]: {
      top: '90px',
      right: 'auto',
      left: '12px',
    }
  }
})

class VersionToggle extends Component {

  state = {
    value: store.getStore('governanceContractVersion'),
  };

  render() {

    const { value } = this.state
    const { classes } = this.props

    let title = "You are using the governance contract at "
    if( value === 1 ) {
      title += config.governanceAddress
    } else {
      title += config.governanceV2Address
    }

    return (
      <Tooltip title={ title } aria-label="add">
        <ToggleButtonGroup value={value} onChange={this.handleTabChange} aria-label="version" exclusive size={ 'small' } className={ classes.versionToggleContainer }>
          <ToggleButton value={1} aria-label="v1" color={ 'Primary' }>
              <Typography variant={ 'h4' }>V1</Typography>
          </ToggleButton>
          <ToggleButton value={2} aria-label="v2" color={ 'Secondary' }>
            <Typography variant={ 'h4' }>V2</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Tooltip>
    );
  }

  handleTabChange = (event, newValue) => {
    const { value } = this.state
    if(newValue !== null) {
      this.setState({ value : newValue })
      store.setStore({ governanceContractVersion: newValue })
      emitter.emit(GOVERNANCE_CONTRACT_CHANGED)
    }
  };
}

export default withNamespaces()(withStyles(styles)(VersionToggle));
