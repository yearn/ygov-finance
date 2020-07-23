import React, { Component } from "react";
import * as moment from 'moment';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Button
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';

import {
  ERROR,
  VOTE_FOR,
  VOTE_FOR_RETURNED,
  VOTE_AGAINST,
  VOTE_AGAINST_RETURNED,
  GET_BALANCES_RETURNED
} from '../../constants'

import { colors } from '../../theme'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store


const styles = theme => ({
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
    paddingBottom: '40px',
    flexShrink: 0
  },
  right: {
    textAlign: 'right'
  },
  assetSummary: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: '100%',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  grey: {
    color: colors.darkGray
  },
});


class Proposal extends Component {

  constructor() {
    super()

    let now = store.getStore('currentBlock')

    this.state = {
      amount: '',
      amountError: false,
      redeemAmount: '',
      redeemAmountError: false,
      account: store.getStore('account'),
      currentBlock: now,
      currentTime: new Date().getTime()
    }
  }

  componentWillMount() {
    emitter.on(VOTE_FOR_RETURNED, this.voteForReturned);
    emitter.on(VOTE_AGAINST_RETURNED, this.voteAgainstReturned);
    emitter.on(GET_BALANCES_RETURNED, this.balancesUpdated);
    emitter.on(ERROR, this.errorReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(VOTE_FOR_RETURNED, this.voteForReturned);
    emitter.removeListener(VOTE_AGAINST_RETURNED, this.voteAgainstReturned);
    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesUpdated);
    emitter.removeListener(ERROR, this.errorReturned);
  };

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

  render() {
    const { classes, proposal } = this.props;
    const {
      account,
      loading,
      currentBlock,
      currentTime
    } = this.state

    if(proposal.end < currentBlock) {
      return <div></div>
    }

    const blocksTillEnd = proposal.end - currentBlock
    const blocksSinceStart = currentBlock - proposal.start

    const endTime = currentTime + (blocksTillEnd * 1000 * 13.8)
    const startTime = currentTime - (blocksSinceStart * 1000 * 13.8)

    return (<div className={ classes.actionsContainer }>
      <div className={ classes.assetSummary }>
        <div className={classes.heading}>
          <Typography variant={ 'h3' }>{ proposal.start }</Typography>
          <Typography variant={ 'h5' } className={ classes.grey }>Vote Start Block</Typography>
        </div>
        <div className={classes.heading}>
          <Typography variant={ 'h3' }>~{ moment(startTime).format("YYYY/MM/DD kk:mm") }</Typography>
          <Typography variant={ 'h5' } className={ classes.grey }>Vote Start Time</Typography>
        </div>
        <div className={classes.heading}>
          <Typography variant={ 'h3' }>{ proposal.end }</Typography>
          <Typography variant={ 'h5' } className={ classes.grey }>Vote End Block</Typography>
        </div>
        <div className={classes.heading}>
          <Typography variant={ 'h3' }>~{ moment(endTime).format("YYYY/MM/DD kk:mm") }</Typography>
          <Typography variant={ 'h5' } className={ classes.grey }>Vote End Time</Typography>
        </div>
      </div>
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
    </div>)
  };

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
}

export default withNamespaces()(withRouter(withStyles(styles, { withTheme: true })(Proposal)));
