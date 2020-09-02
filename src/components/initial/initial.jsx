import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import { Typography, InputBase, IconButton } from '@material-ui/core';
import ArrowRightAltOutlinedIcon from '@material-ui/icons/ArrowRightAltOutlined';
import { withNamespaces } from 'react-i18next';
import { colors } from '../../theme'
import HeaderLogo from '../header/logo/logo'
import HeaderLink from '../header/link/link'
import SocialShare from "../social/social";

const styles = theme => ({
  root: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    background: `linear-gradient(0deg, ${colors.greyBackground}, ${colors.greyBackground})`,
    overflow: 'hidden',
    position: 'relative',
  },
  title: {
    padding: '24px',
    paddingBottom: '0px',
    [theme.breakpoints.up('sm')]: {
      paddingBottom: '24px'
    }
  },
  icon: {
    fontSize: '60px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '100px',
    }
  },
  link: {
    textDecoration: 'none'
  },
  rightMainSection: {
    zIndex: '1',
    position: 'absolute',
    top: '-30%',
    left: '300px',
    width: '100%',
    height: '200%',
    transform: `skew(-0.03turn, 15deg)`,
    background: 'rgba(0, 0, 0, 0.2)',
  },
  leftMarkSection: {
    zIndex: '1',    
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: '15%',
    left: '-100px',
    width: '470px',
    height: '560px'
  },
  headerContainer: {
    zIndex: '2',
    width: '100%',
    height: '90px',
    paddingLeft: '30px',
    paddingRight: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logoContainer: {
    zIndex: '2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    minWidth: '400px',
  },
  linkContainer: {
    zIndex: '2',
    flex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    '& > *': {
      marginRight: '40px',
    }
  },
  bodyContainer: {
    zIndex: '2',    
    width: '100%',
    flex: 1,
    display: 'flex'
  },
  bodyLeftContainer: {
    flex: 1,
    minWidth: '400px',
  },
  bodyRightContainer: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
  },
  bodyRightSpace: {
    flex: 1
  },
  bodyRightMain: {
    flex: 5,
    display: 'flex',
    flexDirection: 'column'
  },
  comingSoonTagContainer: {
    background: colors.yellowBackground,
    borderRadius: '3px',
    padding: '2px 6px',
    width: 'fit-content',
    marginLeft: '6px',
  },

  comingSoonTagText: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '16px',
    lineHeight: '20px',

    display: 'flex',
    alignItems: 'center',
    letterSpacing: '0.06em',
    color: colors.yellowText
  },

  linkSwapIconContainer: {
    height: '80px',
    marginBottom: '30px',
  },

  emailInputContainer: {
    marginLeft: '6px',
    width: '350px',
    height: '44px',
    borderRadius: '4px',
    background: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    border: 'solid 1px rgba(255, 255, 255, 0.2)',
    marginBottom: '5px',
  },

  emailInputError: {
    marginLeft: '6px',
    width: '350px',
    height: '44px',
    borderRadius: '4px',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    border: 'solid 1px rgba(255, 0, 0)',
    marginBottom: '5px',    
  },

  customInputBoxRoot: {
    width: '350px',
    height: 42,
    background: 'transparent',
    borderRadius: 3,
    border: 'solid 0px rgba(255, 255, 255, 0.2)',
    color: colors.white,
    padding: '0 12px',
  },

  customInputBoxError: {
    border: 'solid 1px rgba(255, 0, 0)',
  },

  emailErrorContainer: {
    marginLeft: '6px',
    marginBottom: '20px',
  },
  
  emailErrorText: {
    color: colors.red,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    lineHeight: '13px',
    display: 'flex',
    alignItems: 'center',
    letterSpacing: '0.06em',
  },
  socialMediaContainer: {
    marginLeft: '6px',
  }
});

const ValidateEmail = (mail) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return ''
  }
  return "Invalid Address!"
}

class Initial extends Component {

  constructor(props) {
    super(props)
    this.state = {
      inputEmail: '',
      error: ''
    }
  }

  onSubmit = (email) => {
    if (!email) {
      this.setState({ inputEmail: '', error: 'Please input email address!' })
      return
    }
    const isInvalid = ValidateEmail(email)
    if (isInvalid) {
      this.setState({ inputEmail: email, error: isInvalid })
      return
    }
    console.log('onSubmit success', email)
  }

  renderHeader = () => {
    const { classes } = this.props

    return (
      <div className={ classes.headerContainer }>
        <div className={ classes.logoContainer }>
          <HeaderLogo />
        </div>
        <div className={classes.linkContainer}>
          <HeaderLink text='STAKE' to='/staking' />
          <HeaderLink text='VOTE' to='/vote' />
          <HeaderLink text='LINKSWAP' to='/' disabled tag='SOON' />
          <HeaderLink text='PRODUCTS' to='/' disabled tag='SOON' />
        </div>
      </div>
    )
  }

  renderBody = () => {
    const { classes } = this.props
    const { inputEmail, error } = this.state
    return (
      <div className={ classes.bodyContainer }>
        <div className={ classes.bodyLeftContainer } />
        <div className={classes.bodyRightContainer}>
          <div className={classes.bodyRightSpace} />
          <div className={classes.bodyRightMain} >
            <div className={classes.comingSoonTagContainer}>
              <Typography
                variant='h6'
                className={classes.comingSoonTagText}
              >
                COMING SOON
              </Typography>
            </div>
            <div className={classes.linkSwapIconContainer}>
              <img alt="linkswap" src={require("../../assets/YFLink-linkswap-logo.svg")} height="80px" />
            </div>
            <div className={error ? classes.emailInputError : classes.emailInputContainer}>
              <InputBase
                classes={{
                  root: classes.customInputBoxRoot,
                }}
                onChange={(ev) => {
                  if (error) {
                    this.setState({
                      inputEmail: ev.target.value,
                      error: ValidateEmail(ev.target.value)
                    })
                  } else {
                    this.setState({
                      inputEmail: ev.target.value,
                    })
                  }
                }}
                onKeyPress={(ev) => {
                  if (ev.key === 'Enter') {
                    this.onSubmit(inputEmail)
                  }
                }}
                placeholder='Enter email for updates'
                autoFocus
              />
              <IconButton
                onClick={(ev) => {
                  this.onSubmit(inputEmail)
                }}
              >
                <ArrowRightAltOutlinedIcon style={{color: colors.white}}/>
              </IconButton>
            </div>
            <div className={classes.emailErrorContainer}>
              {error && (
                  <Typography
                    variant='h6'
                    className={classes.emailErrorText}
                  >
                    {error}
                  </Typography>
              )}
            </div>
            <div className={classes.socialMediaContainer}>
              <SocialShare
                twitterUrl="https://twitter.com/YFLinkio"
                githubUrl="https://github.com/yflink"
                mediumUrl="https://medium.com/yflink"
                telegramUrl="https://t.me/YFLinkGroup"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { classes, location } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.rightMainSection} />
        <div className={classes.leftMarkSection}>
          <img alt="up" src={require("../../assets/yfl-up.svg")} height="200px" />
          <img alt="down" src={require("../../assets/yfl-down.svg")} height="200px" />
        </div>
        {this.renderHeader()}
        {this.renderBody()}
      </div>
    )
  };

  nav = (screen) => {
    this.props.history.push(screen)
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(Initial)));
