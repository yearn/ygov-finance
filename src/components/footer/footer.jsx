import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import {withStyles} from '@material-ui/core/styles';
import {Typography,} from '@material-ui/core';
import {withNamespaces} from 'react-i18next';
import {colors} from '../../theme'

import Store from "../../stores";

const store = Store.store

const styles = theme => ({
  footer: {
    top: '0px',
    paddingTop: '28px',
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    }
  },
  footerLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    // width: '100%',
  },
  footerLinksRight: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  footerText: {
    cursor: 'pointer'
  },
  languageContainer: {
    paddingLeft: '12px',
    display: 'none'
  },
  selectInput: {
    fontSize: '14px',
    color: colors.pink
  },
  link: {
    padding: '0 16px 0 16px',
    textDecoration: 'none',
  }
});


class Footer extends Component {

  constructor(props) {
    super(props)

    this.state = {
      rewardPools: store.getStore('rewardPools'),
      languages: store.getStore('languages'),
      language: 'en',
    }
  }

  render() {
    const {classes} = this.props;
    const {rewardPools} = this.state

    return (
        <div className={classes.footer}>
          <div className={classes.footerLinks}>
            <Link to={"/"} className={classes.link}>
              <Typography className={classes.footerText} variant={'h6'}>Home</Typography>
            </Link>
            <a href="https://discord.gg/ChPr4NA" className={classes.link} target="_blank" rel="noopener noreferrer">
              <Typography className={classes.footerText} variant="h6">Discord</Typography>
            </a>
            <a href="https://t.me/YFLinkGroup" className={classes.link} target="_blank" rel="noopener noreferrer">
              <Typography className={classes.footerText} variant="h6">Telegram</Typography>
            </a>
            <a href="https://gov.yflink.io" className={classes.link} target="_blank" rel="noopener noreferrer">
              <Typography className={classes.footerText} variant="h6">Forum</Typography>
            </a>
            <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vTYE7Y-qu1VZC7F_dmxPYVq9N1vJVx0QJTI4v8kOHkKu1L8bDGrT2_wDc1FEm_DQaSi_QdTkoMZO6Ry/pubhtml" className={classes.link} target="_blank" rel="noopener noreferrer">
              <Typography className={classes.footerText} variant="h6">YFL emission schedule</Typography>
            </a>
            {
              rewardPools.filter(p => !!p.yieldCalculator).map((rewardPool) => {
                return <a href={rewardPool.yieldCalculator} className={classes.link} key={rewardPool.id} target="_blank" rel="noopener noreferrer">
                  <Typography className={classes.footerText} variant={'h6'}>
                    {rewardPool.title} Yield
                  </Typography>
                </a>
              })
            }
            <a href="https://burn.yflink.io" className={classes.link} target="_blank" rel="noopener noreferrer">
              <Typography className={classes.footerText} variant="h6">Burn</Typography>
            </a>
          </div>
          <div className={classes.footerLinksRight}>
            <a href="https://medium.com/yflink" className={classes.link} target="_blank" rel="noopener noreferrer">
              <img src={require('../../assets/mediumlogo.png')} alt='Medium' height='24px'/>
            </a>
            <a href="https://twitter.com/yflinkio" className={classes.link} target="_blank" rel="noopener noreferrer">
              <img src={require('../../assets/twitterlogo.png')} alt='Twitter' height='24px'/>
            </a>
          </div>
          </div>
    )
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(Footer)));
