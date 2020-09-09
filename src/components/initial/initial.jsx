import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import { Typography, InputBase, IconButton, CircularProgress } from '@material-ui/core';
import ArrowRightAltOutlinedIcon from '@material-ui/icons/ArrowRightAltOutlined';
import { withNamespaces } from 'react-i18next';
import { colors } from '../../theme'

import HeaderLogo from '../header/logo/logo'
import HeaderLink from '../header/link/link'
import SocialShare from "../social/social";
import Store from "../../stores";
import MailchimpSubscribe from "react-mailchimp-subscribe"
import {ReactComponent as OptionsIcon} from '../../assets/YFLink-header-options.svg'
import RedirectModal from '../header/modal/modal';

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
    '@media (max-width: 768px)': {
      display: 'none',
    }    
  },
  leftMarkSection: {
    zIndex: '1',    
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: '15%',
    left: '-100px',
    width: '470px',
    height: '560px',
    '@media (max-width: 768px)': {
      display: 'none',
    }    
  },
  topMainSection: {
    zIndex: '1',
    position: 'absolute',
    top: '-25%',
    left: '-30%',
    width: '300%',
    height: '100%',
    transform: `rotate(12deg)`,
    background: 'rgba(0, 0, 0, 0.2)',
    '@media (min-width: 768px)': {
      display: 'none',
    }
  },
  bottomMarkSection: {
    zIndex: '1',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: '68%',
    left: '-20px',
    width: '200px',
    height: '230px',

    '@media (min-width: 768px)': {
      display: 'none',
    }
  },

  desktopHeaderContainer: {
    zIndex: '2',
    width: '100%',
    height: '90px',
    paddingLeft: '30px',
    paddingRight: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '@media (max-width: 768px)': {
      display: 'none',
    }    
  },
  mobileHeaderContainer: {
    zIndex: '2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    '@media (min-width: 768px)': {
      display: 'none',
    }
  },

  logoContainer: {
    zIndex: '2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    minWidth: '400px',
    '@media (max-width: 768px)': {
      minWidth: '100px',
    }
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

  optionsContainer: {
    zIndex: '2',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  desktopBodyContainer: {
    zIndex: '2',    
    width: '100%',
    flex: 1,
    display: 'flex',
    '@media (max-width: 768px)': {
      display: 'none',
    }
  },

  mobileBodyContainer: {
    zIndex: '2',
    width: '100%',
    flex: 1,
    display: 'flex',
    '@media (min-width: 768px)': {
      display: 'none',
    }
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
    flex: 1,
  },
  bodyRightMain: {
    flex: 5,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    '@media (max-width: 768px)': {
      padding: '30px',
      flex: 7,
    }
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
    marginBottom: '30px',
    width: '100%',
    '@media (min-width: 768px)': {
      height: '80px',      
    }
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
    '@media (max-width: 768px)': {
      width: '100%',
      marginLeft: '0px',
    }
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
    width: '100%',
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
    '& a': {
      color: colors.white,
    }
  },
  emailSuccessText: {
    color: colors.green,
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
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    '@media (max-width: 768px)': {
      justifyContent: 'center',
    }
  },
  loadingIcon: {
    color: colors.white,
  },
  desktopBackground: {
    position: 'absolute',
    width: '100vw',
    height: '100vh',
    top: '0px',
    left: '0px',
    '@media (max-width: 768px)': {
      display: 'none',
    }
  },
  mobileBackground: {
    position: 'absolute',
    width: '100vw',
    height: '100vh',
    top: '0px',
    left: '0px',
    '@media (min-width: 768px)': {
      display: 'none',
    }
  }
});

const ValidateEmail = (mail) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return ''
  }
  return "Invalid Address!"
}

const store = Store.store
const mailchimpUrl = "https://yflink.us17.list-manage.com/subscribe/post?u=f170cca247406899e9a7fbe82&amp;id=feee202dc5";

class Initial extends Component {

  constructor(props) {
    super(props)
    this.state = {
      inputEmail: '',
      error: '',
      modalOpen: false,
    }
  }

  renderHeader = (screenType) => {
    const { classes } = this.props
    const account = store.getStore('account')
    if (screenType === 'DESKTOP') {
      return (
        <div className={ classes.desktopHeaderContainer }>
          <div className={ classes.logoContainer }>
            <HeaderLogo />
          </div>
          <div className={classes.linkContainer}>
            <HeaderLink text='STAKE' to={account && account.address ? '/staking' : '/account'} redirectedTo={'/staking'} />
            <HeaderLink text='VOTE' to={account && account.address ? '/vote' : '/account'} redirectedTo={'/vote'} />
            <HeaderLink text='Buy YFL on Uniswap' to={'https://app.uniswap.org/#/swap?inputCurrency=0x28cb7e841ee97947a86b06fa4090c8451f64c0be'} externalLink={true}/>
            <HeaderLink text='LINKSWAP' to='/' disabled tag='SOON' />
            <HeaderLink text='PRODUCTS' to='/' disabled tag='SOON' />
          </div>
        </div>
      )
    } else {
      return (
        <div className={ classes.mobileHeaderContainer }>
          <div className={ classes.logoContainer }>
            <HeaderLogo />
          </div>
          <div className={classes.optionsContainer}>
            <IconButton
              onClick={() => {
                this.setState({modalOpen: true})
              }}
            >
              <OptionsIcon style={{color: colors.white}}/>
            </IconButton>
          </div>
        </div>
      )
    }
  }

  renderBody = (screenType) => {
    const { classes } = this.props
    const { inputEmail, error } = this.state
    return (
      <div className={ screenType === 'DESKTOP' ? classes.desktopBodyContainer : classes.mobileBodyContainer }>
        {screenType === 'DESKTOP' && (
          <div className={classes.bodyLeftContainer} />
        )}
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
              {screenType === 'MOBILE' ? (
                <img alt="linkswap" src={require("../../assets/YFLink-linkswap-logo.svg")} width="100%" />
              ) : (
                <img alt="linkswap" src={require("../../assets/YFLink-linkswap-logo.svg")} height="80px" />
              )}
            </div>
              <MailchimpSubscribe
                url={mailchimpUrl}
                render={({ subscribe, status, message }) => (
                  <>
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
                            subscribe({EMAIL: inputEmail})
                          }
                        }}
                        placeholder='Enter email for updates'
                        autoFocus
                      />
                      <IconButton
                        onClick={(ev) => {
                          subscribe({ EMAIL: inputEmail })
                        }}
                      >
                        <ArrowRightAltOutlinedIcon style={{color: colors.white}}/>
                      </IconButton>
                    </div>
                  <div className={classes.emailErrorContainer}>
                      {status === "error" && (
                          <Typography
                            variant='h6'
                            className={classes.emailErrorText}
                          >
                            <div
                              dangerouslySetInnerHTML={{ __html: message }}
                            />
                          </Typography>                      
                      )}
                      {status === "sending" && (
                          <CircularProgress color="secondary" size="20px"/>
                      )}
                      {status === "success" && (
                          <Typography
                            variant='h6'
                            className={classes.emailSuccessText}
                          >
                            <div
                              dangerouslySetInnerHTML={{ __html: message }}
                            />
                          </Typography>
                      )}

                      {!message && error && (
                          <Typography
                            variant='h6'
                            className={classes.emailErrorText}
                          >
                            {error}
                          </Typography>
                      )}
                    </div>
                  </>
                )}
              />
            <div className={classes.socialMediaContainer}>
              <SocialShare
                twitterUrl="https://twitter.com/YFLinkio"
                githubUrl="https://github.com/yflink"
                mediumUrl="https://medium.com/yflink"
                telegramUrl="https://t.me/YFLinkGroup"
                discordUrl="https://discord.gg/nQWEx88"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderBackground = (screenType) => {
    const { classes } = this.props

    if (screenType === 'DESKTOP') {
      return (
        <>
          <div className={classes.rightMainSection} />
          <div className={classes.leftMarkSection}>
            <img alt="up" src={require("../../assets/yfl-up.svg")} height="200px" />
            <img alt="down" src={require("../../assets/yfl-down.svg")} height="200px" />
          </div>
        </>
      )
    } else if (screenType === 'MOBILE') {
      return (
        <>
          <div className={classes.topMainSection} />
          <div className={classes.bottomMarkSection}>
            <img alt="up" src={require("../../assets/yfl-up.svg")} height="112px" />
            <img alt="down" src={require("../../assets/yfl-down.svg")} height="112px" />
          </div>
        </>
      )
    }
  }

  renderModal = () => {
    const account = store.getStore('account')
    return (
      <RedirectModal closeModal={this.closeModal} modalOpen={this.state.modalOpen} account={account}/>
    )
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        {this.renderBackground('DESKTOP')}
        {this.renderBackground('MOBILE')}

        {this.renderHeader('DESKTOP')}
        {this.renderHeader('MOBILE')}
        
        {this.renderBody('DESKTOP')}
        {this.renderBody('MOBILE')}
        {this.renderModal()}
      </div>
    )
  };

  nav = (screen) => {
    this.props.history.push(screen)
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(Initial)));
