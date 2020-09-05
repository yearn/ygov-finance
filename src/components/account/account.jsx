import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
} from '@material-ui/core';
import { colors } from '../../theme'

import UnlockModal from '../unlock/unlockModal.jsx'

import {
  ERROR,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  CONFIGURE_RETURNED
} from '../../constants'

import Store from "../../stores"
import HeaderLogo from '../header/logo/logo'

const emitter = Store.emitter
const store = Store.store

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: `linear-gradient(0deg, ${colors.greyBackground}, ${colors.greyBackground})`,    
    minWidth: '100vw',
    padding: '36px 24px',
    overflow: 'hidden',
    position: 'relative',
  },
  connectHeading: {
    maxWidth: '300px',
    textAlign: 'center',
    color: colors.white
  },
  connectContainer: {
    padding: '20px'
  },
  actionButton: {
    backgroundColor: colors.greyBackground,
    color: colors.white,
    borderColor: colors.white
  },
  notConnectedRoot: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectedRoot: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%'
  },
  address: {
    color: colors.white,
    width: '100%',
    paddingBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  balances: {
    color: colors.white,
    width: '100%',
    padding: '12px'
  },
  balanceContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between'
  },
  accountHeading: {
    paddingBottom: '6px'
  },
  icon: {
    cursor: 'pointer'
  },
  disclaimer: {
    padding: '12px',
    border: '1px solid '+colors.white,
    borderRadius: '0.75rem',
    marginBottom: '24px',
    fontWeight: 1,
    color: colors.white
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

  mainBodySection: {
    zIndex: '3',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    position: 'absolute',
    top: '0',
    padding: '30px',
    zIndex: '2',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    '@media (max-width: 768px)': {
      padding: '16px',
      height: '68px',
    }
  },
  logoContainer: {
    zIndex: '2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    minWidth: '400px',
  },  
});

class Account extends Component {

  constructor(props) {
    super(props)

    const account = store.getStore('account')

    this.state = {
      loading: false,
      account: account,
      assets: store.getStore('assets'),
      modalOpen: false,
    }
  }

  componentDidMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(CONFIGURE_RETURNED, this.configureReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
  };

  connectionConnected = () => {
    const redirectedTo = store.getStore('redirect')
    const account = store.getStore('account')
    if (account && account.address) {
      if (redirectedTo) {
        this.props.history.push(redirectedTo)
      } else {
        this.props.history.push('/')
      }
    }
  };

  configureReturned = () => {
    this.props.history.push('/')
  }

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account'), loading: false })
  }

  errorReturned = (_error) => {
    console.error('Error', _error)
    this.props.history.push('/')
  };

  render() {
    const { classes } = this.props;
    const {
      modalOpen,
    } = this.state

    return (
      <div className={ classes.root }>
        { this.renderNotConnected() }
        { modalOpen && this.renderModal() }
      </div>
    )
  };

  renderHeader = () => {
    const { classes } = this.props
    return (
      <div className={ classes.headerContainer }>
        <div className={ classes.logoContainer }>
          <HeaderLogo />
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

  renderNotConnected = () => {
    const { classes } = this.props
    const { loading } = this.state

    return (
      <div className={classes.notConnectedRoot}>
        {this.renderBackground('DESKTOP')}
        {this.renderBackground('MOBILE')}
        {this.renderHeader()}
        <div className={classes.mainBodySection} >
          <Typography variant={'h5'} className={ classes.disclaimer }>This project is in beta. Use at your own risk.</Typography>
          <div className={ classes.connectHeading }>
            <Typography variant='h3'>Connect your wallet to continue</Typography>
          </div>
          <div className={ classes.connectContainer }>
            <Button
              className={ classes.actionButton }
              variant="outlined"
              color="primary"
              onClick={ this.unlockClicked }
              disabled={ loading }
              >
              <Typography>Connect</Typography>
            </Button>
          </div>
        </div>          
      </div>
    )
  }

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }

  unlockClicked = () => {
    this.setState({ modalOpen: true, loading: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false, loading: false })
  }
}

export default withRouter(withStyles(styles)(Account));
