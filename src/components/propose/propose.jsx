import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
  Card,
  TextField
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';

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
  GOVERNANCE_CONTRACT_CHANGED
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
    background: colors.white,
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
  titleInput: {
    borderRadius: '25px'
  }
})

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class Propose extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')
    const governanceContractVersion = store.getStore('governanceContractVersion')

    this.state = {
      loading: false,
      account: account,
      executor: '',
      hash: '',
      governanceContractVersion: governanceContractVersion
    }
  }

  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(CONFIGURE_RETURNED, this.configureReturned)
    emitter.on(PROPOSE_RETURNED, this.showHash)
    emitter.on(GOVERNANCE_CONTRACT_CHANGED, this.setGovernanceContract)
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned)
    emitter.removeListener(PROPOSE_RETURNED, this.showHash)
    emitter.removeListener(GOVERNANCE_CONTRACT_CHANGED, this.setGovernanceContract)
  };

  setGovernanceContract = () => {
    this.setState({ governanceContractVersion: store.getStore('governanceContractVersion') })
  }

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
      value,
      account,
      loading,
      modalOpen,
      snackbarMessage,
      executor,
      executorError,
      hash,
      hashError,
      governanceContractVersion
    } = this.state

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
        </div>
        <div className={ classes.proposalContainer }>
          { governanceContractVersion === 2 &&
            <div className={ classes.field }>
              <div className={ classes.fieldTitle }>
                <Typography variant='h4'>Executor</Typography>
              </div>
              <TextField
                fullWidth
                disabled={ loading }
                className={ classes.titleInput }
                id={ 'executor' }
                value={ executor }
                error={ executorError }
                helperText={ executorError }
                onChange={ this.onChange }
                placeholder="0x..."
                variant="outlined"
              />
            </div>
          }
          { governanceContractVersion === 2 &&
            <div className={ classes.field }>
              <div className={ classes.fieldTitle }>
                <Typography variant='h4'>IPFS Hash</Typography>
              </div>
              <TextField
                fullWidth
                disabled={ loading }
                className={ classes.titleInput }
                id={ 'hash' }
                value={ hash }
                error={ hashError }
                helperText={ hashError }
                onChange={ this.onChange }
                multiline
                rows={6}
                placeholder="IPFS hash for the proposal text"
                variant="outlined"
              />
            </div>
          }
          <Button
            className={ classes.stakeButton }
            variant="outlined"
            color="secondary"
            disabled={ loading }
            onClick={ () => { this.onPropose() } }
          >
            <Typography variant={ 'h4'}>Generate proposal</Typography>
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
    this.setState({ executorError: false, hashError: false })
    const { executor, hash, governanceContractVersion } = this.state

    let error = false

    if(governanceContractVersion === 2 && (!executor || executor === '')) {
      this.setState({ executorError: 'This field is required' })
      error = true
    }

    if(governanceContractVersion === 2 && (!hash || hash === '')) {
      this.setState({ hashError: 'This field is required' })
      error = true
    }

    if(!error) {
      this.setState({ loading: true })
      dispatcher.dispatch({ type: PROPOSE, content: { executor, hash  } })
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
