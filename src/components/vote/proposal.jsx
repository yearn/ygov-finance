import React, { Component } from "react";
import * as moment from 'moment';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Button,
  Box,
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';

import {
  ERROR,
  VOTE_FOR,
  VOTE_FOR_RETURNED,
  VOTE_AGAINST,
  VOTE_AGAINST_RETURNED,
  GET_BALANCES_RETURNED,
  REGISTER_VOTE,
  REGISTER_VOTE_RETURNED,
  GET_VOTE_STATUS_RETURNED,
  GOVERNANCE_CONTRACT_CHANGED,
} from '../../constants'

import CopyIcon from '@material-ui/icons/FileCopy';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import { colors } from '../../theme'

import Store from "../../stores";
import { green, red, orange } from "@material-ui/core/colors";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store


const styles = theme => ({
  root: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    padding: '0px 36px 0px 18px'
  },
  value: {
    cursor: 'pointer'
  },
  actionInput: {
    padding: '0px 0px 12px 0px',
    fontSize: '0.5rem'
  },
  balances: {
    width: '100%',
    textAlign: 'right',
    paddingRight: '20px',
    cursor: 'pointer'
  },
  actionsContainer: {
    paddingBottom: '12px',
    display: 'flex',
    flex: '1',
    flexWrap: 'wrap',
  },
  title: {
    paddingRight: '24px'
  },
  actionButton: {
    height: '47px'
  },
  tradeContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  sepperator: {
    borderBottom: '1px solid #E1E1E1',
    [theme.breakpoints.up('sm')]: {
      width: '40px',
      borderBottom: 'none'
    }
  },
  scaleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 0px 12px 0px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  scale: {
    minWidth: '10px'
  },
  buttonText: {
    fontWeight: '700',
  },
  headingContainer: {
    width: '100%',
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    }
  },
  heading: {
    flexShrink: 0
  },

  votesHeading: {
    display: 'none',
    paddingTop: '12px',
    flex: 1,
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      paddingTop: '5px',
      display: 'block'
    }
  },

  YIPheading: {
    width: '64px',
    flexShrink: 0
  },
  right: {
    textAlign: 'right'
  },
  assetSummary: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: '24px',
  },
  grey: {
    color: colors.darkGray
  },
  headingName: {
    flex: 2,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    minWidth: '100%',
    [theme.breakpoints.up('sm')]: {
      minWidth: 'auto',
    }
  },
  proposerAddressContainer: {
    cursor: 'pointer',
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
});


class Proposal extends Component {

  constructor() {
    super()

    const now = store.getStore('currentBlock')
    const votingStatus = store.getStore('votingStatus')
    const governanceContractVersion = store.getStore('governanceContractVersion')

    this.state = {
      amount: '',
      amountError: false,
      redeemAmount: '',
      redeemAmountError: false,
      account: store.getStore('account'),
      currentBlock: now,
      currentTime: new Date().getTime(),
      votingStatus: votingStatus,
      governanceContractVersion: governanceContractVersion
    }
  }

  componentWillMount() {
    emitter.on(VOTE_FOR_RETURNED, this.voteForReturned);
    emitter.on(VOTE_AGAINST_RETURNED, this.voteAgainstReturned);
    emitter.on(GET_BALANCES_RETURNED, this.balancesUpdated);
    emitter.on(REGISTER_VOTE_RETURNED, this.registerReturned);
    emitter.on(GET_VOTE_STATUS_RETURNED, this.voteStatusReturned);
    emitter.on(GOVERNANCE_CONTRACT_CHANGED, this.governanceContractChanged);
    emitter.on(ERROR, this.errorReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(VOTE_FOR_RETURNED, this.voteForReturned);
    emitter.removeListener(VOTE_AGAINST_RETURNED, this.voteAgainstReturned);
    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesUpdated);
    emitter.removeListener(REGISTER_VOTE_RETURNED, this.registerReturned);
    emitter.removeListener(GET_VOTE_STATUS_RETURNED, this.voteStatusReturned);
    emitter.removeListener(GOVERNANCE_CONTRACT_CHANGED, this.governanceContractChanged);
    emitter.removeListener(ERROR, this.errorReturned);
  };

  governanceContractChanged = () => {
    this.setState({ governanceContractVersion: store.getStore('governanceContractVersion') })
  }

  registerReturned = () => {
    this.setState({
      votingStatus: store.getStore('votingStatus'),
      loading: false
    })
  };

  voteStatusReturned = () => {
    this.setState({
      votingStatus: store.getStore('votingStatus'),
      loading: false
    })
  }

  balancesUpdated = () => {
    let now = store.getStore('currentBlock')
    this.setState({ currentBlock: now })
  };

  voteForReturned = () => {
    this.setState({ loading: false })
  };

  voteAgainstReturned = (txHash) => {
    this.setState({ loading: false })
  };

  errorReturned = (error) => {
    this.setState({ loading: false })
  };

  votingMessage = (proposal) => {
    let message;
    if(proposal.myVotes > 0)
      message = "You have voted " + proposal.direction + ".";
    else
      message = "You have not voted.";

    if (proposal.canStillVote && proposal.myVotes === 0)
      message += " Please vote now.";

    return message;
  };

  formatVotes = (votes) => {
    return (parseFloat(votes)/10**18).toLocaleString(undefined, { maximumFractionDigits: 4, minimumFractionDigits: 4 });
  }

  formatAsPercent = (ratio) => {
    return (ratio * 100.0).toFixed(2).toLocaleString(undefined, { maximumFractionDigits: 4, minimumFractionDigits: 4 });
  }

  render() {
    const { classes, proposal } = this.props;
    const {
      account,
      loading,
      currentBlock,
      currentTime,
      votingStatus,
      governanceContractVersion
    } = this.state

    const blocksTillEnd = proposal.end - currentBlock
    const blocksSinceStart = currentBlock - proposal.start

    const endTime = currentTime + (blocksTillEnd * 1000 * 13.8)
    const startTime = currentTime - (blocksSinceStart * 1000 * 13.8)

    const yipURL = `https://yips.yearn.finance/YIPS/yip-${proposal.id}`;

    var address = null;
    if (proposal.executor) {
      address = proposal.executor.substring(0,8)+'...'+proposal.executor.substring(proposal.executor.length-6,proposal.executor.length)
    }

    const hashURL = proposal.hash

    return (
      <div className={ classes.root }>
        <div className={ classes.assetSummary }>
          <div className={ classes.headingName }>
            <div className={classes.YIPheading}>
              <Typography variant={ 'h3' }><a href={ yipURL } target="_blank">YIP</a></Typography>
              <Typography variant={ 'h5' } className={ classes.grey }>Link</Typography>
            </div>
            <div>
              <div className={ classes.proposerAddressContainer }>
                <Typography variant={'h3'}>{address}</Typography>
                <Box ml={1} />
                <CopyIcon onClick={(e) => { this.copyAddressToClipboard(e, proposal.executor) } } fontSize="small" />
              </div>
              <Typography variant={ 'h5' } className={ classes.grey }>Executor</Typography>
            </div>
          </div>
          <div className={classes.heading}>
            <Typography variant={ 'h3' }>~{ moment(startTime).format("YYYY/MM/DD kk:mm") }</Typography>
            <Typography variant={ 'h5' } className={ classes.grey }>Vote Start: {proposal.start}</Typography>
          </div>
        </div>
        <div className={ classes.assetSummary }>
          <div className={ classes.headingName }>
            <div className={classes.YIPheading}>
              <Typography variant={ 'h3' }><a href={ hashURL } target="_blank">IPFS</a></Typography>
              <Typography variant={ 'h5' } className={ classes.grey }>Link</Typography>
            </div>
            <div>
              <Typography variant={ 'h3' }>{ (proposal.quorum / 100).toFixed(2) }% / { (proposal.quorumRequired / 100).toFixed(2) }%</Typography>
              <Typography variant={ 'h5' } className={ classes.grey }>Quorum/Required</Typography>
            </div>
          </div>
          <div className={classes.heading}>
            <Typography variant={ 'h3' }>~{ moment(endTime).format("YYYY/MM/DD kk:mm") }</Typography>
            <Typography variant={ 'h5' } className={ classes.grey }>Vote End: {proposal.end}</Typography>
          </div>
        </div>
        <div className={ classes.assetSummary }>
          <div className={classes.headingName}>
            <div className={ classes.YIPheading }>
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
            </div>
            <div>
              <div className={ classes.proposerAddressContainer }>
                <Typography variant={'h3'}>{ this.votingMessage(proposal) }</Typography>
              </div>
              <Typography variant={ 'h5' } className={ classes.grey }>Status</Typography>
            </div>
          </div>
          <div className={ classes.votesHeading }>
            <Typography variant={ 'h3' }>{ this.formatVotes(proposal.myVotes) }</Typography>
            <Typography variant={ 'h5' } className={ classes.grey }>Used votes</Typography>
          </div>
          <div className={ classes.votesHeading }>
            <Typography variant={ 'h3' }>{ proposal.canStillVote ? this.formatVotes(proposal.availableVotes): 0 }</Typography>
            <Typography variant={ 'h5' } className={ classes.grey }>Available votes</Typography>
          </div>
          <div className={ classes.votesHeading }>
            <Typography variant={ 'h3' }>{ this.formatAsPercent(proposal.myVotesRatio) }%</Typography>
            <Typography variant={ 'h5' } className={ classes.grey }>Participation weight</Typography>
          </div>
        </div>
        { proposal.end > currentBlock &&
          <div>
            { (governanceContractVersion === 2 && votingStatus !== true) &&
              <div className={ classes.actionsContainer }>
                <div className={ classes.tradeContainer }>
                  <Button
                    className={ classes.actionButton }
                    variant="outlined"
                    color="primary"
                    disabled={ loading }
                    onClick={ this.onRegister }
                    fullWidth
                    >
                    <Typography className={ classes.buttonText } variant={ 'h5'} color={'secondary'}>Register</Typography>
                  </Button>
                </div>
              </div>
            }
            { (governanceContractVersion !== 2 || votingStatus === true) && proposal.canStillVote === true &&
              <div className={ classes.actionsContainer }>
                <div className={ classes.tradeContainer }>
                  <Button
                    className={ classes.actionButton }
                    variant="outlined"
                    color="primary"
                    disabled={ loading || proposal.end < currentBlock }
                    onClick={ this.onVoteFor }
                    fullWidth
                    >
                    <Typography className={ classes.buttonText } variant={ 'h5'} color={'secondary'}>Vote For</Typography>
                  </Button>
                </div>
                <div className={ classes.sepperator }></div>
                <div className={classes.tradeContainer}>
                  <Button
                    className={ classes.actionButton }
                    variant="outlined"
                    color="primary"
                    disabled={ loading || proposal.end < currentBlock }
                    onClick={ this.onVoteAgainst }
                    fullWidth
                    >
                    <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Vote Against</Typography>
                  </Button>
                </div>
              </div>
            }
          </div>
        }
      </div>
    )
  };

  copyAddressToClipboard = (event, address) => {
    event.stopPropagation();
    navigator.clipboard.writeText(address).then(() => {
      this.showAddressCopiedSnack();
    });
  }

  showAddressCopiedSnack = () => {
    this.props.showSnackbar("Address Copied to Clipboard", 'Success')
  }

  onVoteFor = () => {
    const { proposal, startLoading } = this.props

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: VOTE_FOR, content: { proposal: proposal } })
  }

  onVoteAgainst = () => {
    const { proposal, startLoading } = this.props

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: VOTE_AGAINST, content: { proposal: proposal } })
  }

  onRegister = () => {
    const { startLoading } = this.props

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: REGISTER_VOTE, content: {  } })
  }
}

export default withNamespaces()(withRouter(withStyles(styles, { withTheme: true })(Proposal)));
