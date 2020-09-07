import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Box,
  Button,
  Card,
  TextField,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { withNamespaces } from 'react-i18next';

import Loader from '../loader'
import Snackbar from '../snackbar'
import UnlockModal from '../unlock/unlockModal.jsx'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CopyIcon from '@material-ui/icons/FileCopy';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';

import Proposal from './proposal'

import Store from "../../stores";
import { colors } from '../../theme'

import {
  ERROR,
  CONFIGURE_RETURNED,
  PROPOSE,
  PROPOSE_RETURNED,
  GET_PROPOSALS,
  GET_PROPOSALS_RETURNED,
  VOTE_FOR_RETURNED,
  VOTE_AGAINST_RETURNED,
  GOVERNANCE_CONTRACT_CHANGED,
  GET_VOTE_STATUS,
  GET_VOTE_STATUS_RETURNED,
  REGISTER_VOTE_RETURNED,
  REGISTER_VOTE
} from '../../constants'
import { green, red, orange } from "@material-ui/core/colors";



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
  between: {
    width: '40px'
  },
  dashboard: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: '12px'
  },
  intro: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '32px'
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
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  },
  headingName: {
    paddingTop: '5px',
    flex: 2,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    minWidth: '100%',
    [theme.breakpoints.up('sm')]: {
      minWidth: 'auto',
    }
  },
  heading: {
    display: 'none',
    paddingTop: '12px',
    flex: 1,
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      paddingTop: '5px',
      display: 'block'
    }
  },
  assetSummary: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
    [theme.breakpoints.up('sm')]: {
      flexWrap: 'nowrap'
    }
  },
  assetIcon: {
    display: 'flex',
    alignItems: 'center',
    verticalAlign: 'middle',
    borderRadius: '20px',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    cursor: 'pointer',
    marginRight: '20px',
    [theme.breakpoints.up('sm')]: {
      height: '40px',
      width: '40px',
      marginRight: '24px',
    }
  },
  grey: {
    color: colors.darkGray
  },
  expansionPanel: {
    maxWidth: 'calc(100vw - 24px)',
    width: '100%'
  },
  stakeTitle: {
    width: '100%',
    color: colors.darkGray,
  },
  claimContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    margin: '20px',
    background: colors.white,
    width: '100%'
  },
  stakeButton: {
    minWidth: '300px'
  },
  proposerAddressContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& > svg': {
      visibility: 'hidden',
    },
    '&:hover > svg': {
      visibility: 'visible'
    }
  }
})

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class Vote extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')
    const proposals = store.getStore('proposals')
    const votingStatus = store.getStore('votingStatus')
    const governanceContractVersion = store.getStore('governanceContractVersion')

    this.state = {
      loading: false,
      account: account,
      proposals: proposals,
      value: 1,
      votingStatus: votingStatus,
      governanceContractVersion: governanceContractVersion
    }

    dispatcher.dispatch({ type: GET_PROPOSALS, content: {} })
    dispatcher.dispatch({ type: GET_VOTE_STATUS, content: {} })
  }

  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(CONFIGURE_RETURNED, this.configureReturned)
    emitter.on(PROPOSE_RETURNED, this.showHash)
    emitter.on(GET_PROPOSALS_RETURNED, this.proposalsReturned)
    emitter.on(VOTE_FOR_RETURNED, this.showHash);
    emitter.on(VOTE_AGAINST_RETURNED, this.showHash);
    emitter.on(GOVERNANCE_CONTRACT_CHANGED, this.governanceContractChanged);
    emitter.on(GET_VOTE_STATUS_RETURNED, this.voteStatusReturned);
    emitter.on(REGISTER_VOTE_RETURNED, this.registerVoteReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned)
    emitter.removeListener(PROPOSE_RETURNED, this.showHash)
    emitter.removeListener(GET_PROPOSALS_RETURNED, this.proposalsReturned)
    emitter.removeListener(VOTE_FOR_RETURNED, this.showHash);
    emitter.removeListener(VOTE_AGAINST_RETURNED, this.showHash);
    emitter.removeListener(GOVERNANCE_CONTRACT_CHANGED, this.governanceContractChanged);
    emitter.removeListener(GET_VOTE_STATUS_RETURNED, this.voteStatusReturned);
    emitter.removeListener(REGISTER_VOTE_RETURNED, this.registerVoteReturned);
  };

  governanceContractChanged = () => {
    this.setState({ governanceContractVersion: store.getStore('governanceContractVersion'), loading: true })
    dispatcher.dispatch({ type: GET_PROPOSALS, content: {} })
  }

  errorReturned = (error) => {
    this.setState({ loading: false })
  };

  registerVoteReturned = (txHash) => {
    this.setState({
      votingStatus: store.getStore('votingStatus'),
      loading: false
    })
    this.showSnackbar(txHash, 'Hash')
  };

  voteStatusReturned = () => {
    this.setState({
      votingStatus: store.getStore('votingStatus'),
      loading: false
    })
  }

  proposalsReturned = () => {
    const proposals = store.getStore('proposals')
    this.setState({ proposals: proposals, loading: false })
  }

  showHash = (txHash) => {
    this.showSnackbar(txHash, 'Hash')
  };

  showAddressCopiedSnack = () => {
    this.showSnackbar("Address Copied to Clipboard", 'Success')
  }

  showSnackbar = (message, type) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: message, snackbarType: type }
      that.setState(snackbarObj)
    })
  }

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
      title,
      titleError,
      description,
      descriptionError,
      votingStatus,
      governanceContractVersion
    } = this.state

    return (
      <div className={ classes.root }>
        <Typography variant={'h5'} className={ classes.disaclaimer }>This project is in beta. Use at your own risk.</Typography>
        <div className={ classes.dashboard }>
          <div>
            <Button
              className={ classes.stakeButton }
              variant="outlined"
              color="secondary"
              disabled={ loading }
              onClick={ () => { this.goToDashboard() } }
            >
              <Typography variant={ 'h4'}>Go to Voting Dashboard</Typography>
            </Button>
          </div>
        </div>
        <div className={ classes.intro }>
          <ToggleButtonGroup value={value} onChange={this.handleTabChange} aria-label="version" exclusive size={ 'small' }>
            <ToggleButton value={0} aria-label="v1">
              <Typography variant={ 'h4' }>Done</Typography>
            </ToggleButton>
            <ToggleButton value={1} aria-label="v2">
              <Typography variant={ 'h4' }>Open</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
          <div className={ classes.between }>
          </div>
          <div className={ classes.proposalContainer }>
            { (governanceContractVersion === 2 && votingStatus !== true) &&
              <Button
                className={ classes.stakeButton }
                variant="outlined"
                color="secondary"
                disabled={ loading }
                onClick={ () => { this.onRegister() } }
              >
                <Typography variant={ 'h4'}>Register to vote</Typography>
              </Button>
            }
            { (governanceContractVersion === 1 || votingStatus === true) &&
              <Button
                className={ classes.stakeButton }
                variant="outlined"
                color="secondary"
                disabled={ loading }
                onClick={ () => { this.onPropose() } }
              >
                <Typography variant={ 'h4'}>Generate a new proposal</Typography>
              </Button>
            }
          </div>
        </div>
        { this.renderProposals() }
        { snackbarMessage && this.renderSnackbar() }
        { loading && <Loader /> }
        { modalOpen && this.renderModal() }
      </div>
    )
  }

  renderProposals = () => {
    const { proposals, expanded, value } = this.state
    const { classes, t } = this.props
    const width = window.innerWidth
    const now = store.getStore('currentBlock')

    const filteredProposals = proposals.filter((proposal) => {
      return proposal.proposer != '0x0000000000000000000000000000000000000000'
    }).filter((proposal) => {
      return (value === 0 ? proposal.end < now : proposal.end > now)
    })

    if(filteredProposals.length === 0) {
      return (
        <div className={ classes.claimContainer }>
          <Typography className={ classes.stakeTitle } variant={ 'h3'}>No proposals</Typography>
        </div>
      )
    }

    return filteredProposals.map((proposal) => {
      var address = null;
      if (proposal.proposer) {
        address = proposal.proposer.substring(0,8)+'...'+proposal.proposer.substring(proposal.proposer.length-6,proposal.proposer.length)
      }

      return (
        <ExpansionPanel className={ classes.expansionPanel } square key={ proposal.id+"_expand" } expanded={ expanded === proposal.id} onChange={ () => { this.handleChange(proposal.id) } }>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <div className={ classes.assetSummary }>
              <div className={classes.headingName}>
                <div className={classes.heading}>
                  <Typography variant={'h3'}>
                    { proposal.myVotes > 0 && proposal.direction === "FOR" &&
                      <CheckCircleIcon style={{ fontSize: 20, color: green[500] }}/>
                    }
                    { proposal.myVotes > 0 && proposal.direction === "AGAINST" &&
                      <CancelIcon style={{ fontSize: 20, color: red[500] }} />
                    }
                    {
                      proposal.myVotes === 0 &&
                      <WarningIcon style={{ fontSize: 20, color: orange[500] }}/>
                    }
                    <span style={{ paddingLeft: 8}}>{ proposal.id }</span>
                  </Typography>
                  <Typography variant={ 'h5' } className={ classes.grey }>Vote Status</Typography>
                </div>
                <div>
                  <div className={ classes.proposerAddressContainer }>
                    <Typography variant={'h3'}>{address}</Typography>
                    <Box ml={1} />
                    <CopyIcon onClick={(e) => { this.copyAddressToClipboard(e, proposal.proposer) } } fontSize="small" />
                  </div>
                  <Typography variant={ 'h5' } className={ classes.grey }>Proposer</Typography>
                </div>
              </div>
              <div className={classes.heading}>
                <Typography variant={ 'h3' }>{ proposal.totalForVotes ? (parseFloat(proposal.totalForVotes)/10**18).toLocaleString(undefined, { maximumFractionDigits: 4, minimumFractionDigits: 4 }) : 0 }</Typography>
                <Typography variant={ 'h5' } className={ classes.grey }>Votes For { proposal.totalForVotes !== "0" ? ((parseFloat(proposal.totalForVotes)/10**18) / ((parseFloat(proposal.totalForVotes)/10**18) + (parseFloat(proposal.totalAgainstVotes)/10**18)) * 100).toFixed(2) : 0 }%</Typography>
              </div>
              <div className={classes.heading}>
                <Typography variant={ 'h3' }>{ proposal.totalAgainstVotes ? (parseFloat(proposal.totalAgainstVotes)/10**18).toLocaleString(undefined, { maximumFractionDigits: 4, minimumFractionDigits: 4 }) : 0 }</Typography>
                <Typography variant={ 'h5' } className={ classes.grey }>Votes Against { proposal.totalAgainstVotes !== "0" ? ((parseFloat(proposal.totalAgainstVotes)/10**18) / ((parseFloat(proposal.totalForVotes)/10**18) + (parseFloat(proposal.totalAgainstVotes)/10**18)) * 100).toFixed(2) : 0 }%</Typography>
              </div>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Proposal proposal={ proposal } startLoading={ this.startLoading } showSnackbar={ this.showSnackbar } />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )
    })
  }

  goToDashboard = () => {
    window.open('https://gov.yearn.finance/', "_blank")
  }

  handleTabChange = (event, newValue) => {
    this.setState({value:newValue})
  };

  startLoading = () => {
    this.setState({ loading: true })
  }

  handleChange = (id) => {
    this.setState({ expanded: this.state.expanded === id ? null : id })
  }

  copyAddressToClipboard = (event, address) => {
    event.stopPropagation();
    navigator.clipboard.writeText(address).then(() => {
      this.showAddressCopiedSnack();
    });
  }

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  onPropose = () => {
    this.props.history.push('propose')
  }

  onRegister = () => {
    this.setState({ loading: true })
    dispatcher.dispatch({ type: REGISTER_VOTE, content: {  } })
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

export default withRouter(withStyles(styles)(Vote));
