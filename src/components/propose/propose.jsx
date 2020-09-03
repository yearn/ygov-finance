import React, { Component } from "react";
import {Link, withRouter} from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
  Card,
  TextField
} from '@material-ui/core';

import Loader from '../loader'
import Snackbar from '../snackbar'
import UnlockModal from '../unlock/unlockModal.jsx'

import Store from "../../stores";
import { colors } from '../../theme'

import {
  ERROR,
  CONFIGURE_RETURNED,
  PROPOSE,
  PROPOSE_RETURNED,
} from '../../constants'

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '900px',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '40px'
  },
  intro: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '700px'
  },
  introCenter: {
    minWidth: '100%',
    textAlign: 'center',
    padding: '48px 0px'
  },
  investedContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    minWidth: '100%',
    [theme.breakpoints.up('md')]: {
      minWidth: '800px',
    }
  },
  connectContainer: {
    padding: '12px',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '450px',
    [theme.breakpoints.up('md')]: {
      width: '450',
    }
  },
  actionButton: {
    '&:hover': {
      backgroundColor: "#2F80ED",
    },
    padding: '12px',
    backgroundColor: "#2F80ED",
    borderRadius: '1rem',
    border: '1px solid #E1E1E1',
    fontWeight: 500,
    [theme.breakpoints.up('md')]: {
      padding: '15px',
    }
  },
  buttonText: {
    fontWeight: '700',
    color: 'white',
  },
  disaclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '0.75rem',
    marginBottom: '24px',
  },
  addressContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden',
    flex: 1,
    whiteSpace: 'nowrap',
    fontSize: '0.83rem',
    textOverflow:'ellipsis',
    cursor: 'pointer',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    alignItems: 'center',
    maxWidth: '500px',
    [theme.breakpoints.up('md')]: {
      width: '100%'
    }
  },
  walletAddress: {
    padding: '0px 12px'
  },
  walletTitle: {
    flex: 1,
    color: colors.darkGray
  },
  proposalContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    margin: '20px',
    background: colors.white,
  },
  field: {
    minWidth: '100%',
    paddingBottom: '20px'
  },
  fieldTitle: {
    paddingLeft: '20px'
  },
  fieldMessage: {
    paddingTop: '20px',
    paddingLeft: '20px'
  },
  code: {
    display: 'inline',
    background: '#EEE',
  },
  titleInput: {
    borderRadius: '25px'
  }
})

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class Propose extends Component {

  constructor(props) {
    super(props)

    const account = store.getStore('account')
    
    if (!account || !account.address) {
      props.history.push('/')
    }

    this.state = {
      loading: false,
      account: account,
      url: '',
    }
  }

  componentDidMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(CONFIGURE_RETURNED, this.configureReturned)
    emitter.on(PROPOSE_RETURNED, this.showHash)
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned)
    emitter.removeListener(PROPOSE_RETURNED, this.showHash)
  };

  showHash = (txHash) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  };

  errorReturned = (error) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: error.toString(), snackbarType: 'Error' }
      that.setState(snackbarObj)
    })
  };

  configureReturned = () => {
    this.setState({ loading: false })
  }

  render() {
    const { classes } = this.props;
    const {
      account,
      loading,
      modalOpen,
      snackbarMessage,
      url,
      urlError,
    } = this.state

    let address = null;
    if (account.address) {
      address = account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length)
    }

    return (
      <div className={ classes.root }>
        <Typography variant={'h5'} className={ classes.disaclaimer }>This project is in beta. Use at your own risk.</Typography>
        <div className={ classes.intro }>
          <Button
            className={ classes.stakeButton }
            variant="outlined"
            color="secondary"
            disabled={ loading }
            onClick={ () => {  this.props.history.push('/vote') } }
          >
            <Typography variant={ 'h4'}>Back</Typography>
          </Button>
          <Card className={ classes.addressContainer } onClick={this.overlayClicked}>
            <Typography variant={ 'h3'} className={ classes.walletTitle } noWrap>Wallet</Typography>
            <Typography variant={ 'h4'} className={ classes.walletAddress } noWrap>{ address }</Typography>
            <div style={{ background: '#DC6BE5', opacity: '1', borderRadius: '10px', width: '10px', height: '10px', marginRight: '3px', marginTop:'3px', marginLeft:'6px' }}/>
          </Card>
        </div>
        <div className={ classes.proposalContainer }>
            <div className={ classes.field }>
              <div className={ classes.fieldTitle }>
                <Typography variant='h4'>Proposal URL</Typography>
              </div>
              <TextField
                fullWidth
                disabled={ loading }
                className={ classes.titleInput }
                id={ 'url' }
                value={ url }
                error={ !!urlError }
                helperText={ urlError }
                onChange={ this.onChange }
                multiline
                rows={1}
                placeholder="URL to proposal in YFLINK Governance Forum"
                variant="outlined"
              />
            </div>
          <div className={ classes.field }>
            <Typography className={classes.fieldMessage} variant='h5'>You must have staked 0.1 YFL in the <Link to={"/staking"} className={classes.link}>Governance pool</Link> to submit a proposal.</Typography>
            <Typography className={classes.fieldMessage} variant='h5'>Append <Typography className={classes.code}>?meme</Typography> to the proposal URL to submit in the memes category.</Typography>
          </div>
          <Button
            className={ classes.stakeButton }
            variant="outlined"
            color="secondary"
            disabled={ loading }
            onClick={ () => { this.onPropose() } }
          >
            <Typography variant={'h4'}>Generate proposal</Typography>
          </Button>
        </div>
        { snackbarMessage && this.renderSnackbar() }
        { loading && <Loader /> }
        { modalOpen && this.renderModal() }
      </div>
    )
  }

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  onPropose = () => {
    this.setState({ urlError: false })
    const { url } = this.state

    let error = false
    if(!url || url === '') {
      this.setState({ urlError: 'This field is required' })
      error = true
    }

    if(!error) {
      this.setState({ loading: true })
      dispatcher.dispatch({ type: PROPOSE, content: { url } })
    }
  }

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }

  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  };

  overlayClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

}

export default withRouter(withStyles(styles)(Propose));
