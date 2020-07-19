import React, { Component } from "react";
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
  VOTE_AGAINST_RETURNED
} from '../../constants'

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
    paddingBottom: '12px',
    flex: 1,
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    }
  },
  right: {
    textAlign: 'right'
  }
});


class Proposal extends Component {

  constructor() {
    super()

    this.state = {
      amount: '',
      amountError: false,
      redeemAmount: '',
      redeemAmountError: false,
      account: store.getStore('account'),
    }
  }

  componentWillMount() {
    emitter.on(VOTE_FOR_RETURNED, this.voteForReturned);
    emitter.on(VOTE_AGAINST_RETURNED, this.voteAgainstReturned);
    emitter.on(ERROR, this.errorReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(VOTE_FOR_RETURNED, this.voteForReturned);
    emitter.removeListener(VOTE_AGAINST_RETURNED, this.voteAgainstReturned);
    emitter.removeListener(ERROR, this.errorReturned);
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
    const { classes } = this.props;
    const {
      account,
      loading
    } = this.state

    return (<div className={ classes.actionsContainer }>
      <div className={ classes.tradeContainer }>
        <Button
          className={ classes.actionButton }
          variant="outlined"
          color="primary"
          disabled={ loading }
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
          disabled={ loading }
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
