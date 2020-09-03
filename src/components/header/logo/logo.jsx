import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import { colors } from '../../../theme/theme'

const styles = theme => ({
  root: {
    display: 'flex',
    position: 'relative',
    height: '30px',
    cursor: 'pointer',
    alignItems: 'center',
    '&:hover': {
      opacity: 0.8,
    }
  },
  iconContainer: {
    width: '30px',
    height: '30px',
    marginRight: '10px',
  },
  spanContainer: {
  },
  linkText: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '24px',
    lineHeight: '29px',
    letterSpacing: '0.3em',
    color: colors.white,
  }
});

class Logo extends Component {
  
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root} onClick={ () => { this.nav('/') } }>
        <div className={classes.iconContainer}>
          <img alt="logo" src={require("../../../assets/YFLink-header-logo.svg")} width="30px" height="30px" />
        </div>
        <div className={classes.spanContainer}>
          <Typography variant='h3' className={ classes.linkText }>YFLINK</Typography>
        </div>
      </div>
    )
  };

  nav = (screen) => {
    this.props.history.push(screen)
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(Logo)));
