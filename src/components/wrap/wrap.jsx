import bigInt from 'big-integer';
import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {withStyles} from '@material-ui/core/styles';
import {Button, Card, InputAdornment, TextField, Typography} from '@material-ui/core';

import Loader from '../loader'
import Snackbar from '../snackbar'

import Store from "../../stores";
import {colors} from '../../theme'

import {
  ERROR,
  GET_WRAPPED,
  GET_WRAPPED_RETURNED,
  UNWRAP,
  UNWRAP_RETURNED,
  WRAP,
  WRAP_RETURNED
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
  },
  introCenter: {
    minWidth: '100%',
    textAlign: 'center',
    padding: '48px 0px'
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
  overview: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    alignItems: 'center',
    marginTop: '40px',
    width: '100%',
    background: colors.white
  },
  overviewField: {
    display: 'flex',
    flexDirection: 'column'
  },
  overviewTitle: {
    color: colors.darkGray
  },
  overviewValue: {

  },
  actions: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '900px',
    flexWrap: 'wrap',
    background: colors.white,
    border: '1px solid '+colors.borderBlue,
    padding: '28px 30px',
    borderRadius: '50px',
    marginTop: '40px'
  },
  actionContainer: {
    minWidth: 'calc(50% - 40px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px'
  },
  primaryButton: {
    '&:hover': {
      backgroundColor: "#2F80ED",
    },
    padding: '20px 32px',
    backgroundColor: "#2F80ED",
    borderRadius: '50px',
    fontWeight: 500,
  },
  actionButton: {
    padding: '20px 32px',
    borderRadius: '50px',
  },
  buttonText: {
    fontWeight: '700',
  },
  stakeButtonText: {
    fontWeight: '700',
    color: 'white',
  },
  valContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  actionInput: {
    padding: '0px 0px 12px 0px',
    fontSize: '0.5rem'
  },
  inputAdornment: {
    fontWeight: '600',
    fontSize: '1.5rem'
  },
  assetIcon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    borderRadius: '25px',
    background: '#dedede',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    marginRight: '16px'
  },
  balances: {
    width: '100%',
    textAlign: 'right',
    paddingRight: '20px',
    cursor: 'pointer'
  },
  stakeTitle: {
    width: '100%',
    color: colors.darkGray,
    marginBottom: '20px'
  },
  stakeButtons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    align: 'center',
    marginTop: '20px'
  },
  stakeButton: {
    minWidth: '300px'
  },
  requirement: {
    display: 'flex',
    alignItems: 'center'
  },
  check: {
    paddingTop: '6px'
  },
  voteLockMessage: {
    margin: '20px'
  },
  startDateMessage: {
    margin: '20px',
    fontStyle: 'italic',
  },
  title: {
    width: '100%',
    color: colors.darkGray,
    minWidth: '100%',
    marginLeft: '20px'
  },
})

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class Wrap extends Component {
  constructor(props) {
    super(props)

    const account = store.getStore('account')
    const wrapping = store.getStore('wrapping')

    this.state = {
      loading: !(account),
      account,
      wrapping,
    }
    dispatcher.dispatch({ type: GET_WRAPPED, content: {} })
  }

  componentDidMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(WRAP_RETURNED, this.showHash);
    emitter.on(UNWRAP_RETURNED, this.showHash);
    emitter.on(GET_WRAPPED_RETURNED, this.getWrappedReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(WRAP_RETURNED, this.showHash);
    emitter.removeListener(UNWRAP_RETURNED, this.showHash);
    emitter.removeListener(GET_WRAPPED_RETURNED, this.getWrappedReturned);
  };

  getWrappedReturned = (wrapping) => {
    // console.log(wrapping)
    this.setState({
      wrapping,
    })
  }

  showHash  = (txHash) => {
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

  render() {
    const { classes } = this.props;
    const {
      account,
      loading,
      snackbarMessage,
      wrapping: {raw, wrapper},
    } = this.state

    let address = null;
    if (account.address) {
      address = account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length)
    }

    if(!raw || !wrapper) {
      return null
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
            onClick={ () => {  this.props.history.goBack() } }
          >
            <Typography variant={ 'h4'}>Back</Typography>
          </Button>
          <Card className={ classes.addressContainer } onClick={this.overlayClicked}>
            <Typography variant={ 'h3'} className={ classes.walletTitle } noWrap>Wallet</Typography>
            <Typography variant={ 'h4'} className={ classes.walletAddress } noWrap>{ address }</Typography>
            <div style={{ background: '#DC6BE5', opacity: '1', borderRadius: '10px', width: '10px', height: '10px', marginRight: '3px', marginTop:'3px', marginLeft:'6px' }}/>
          </Card>
        </div>
        <div className={classes.overview}>
          <div className={classes.overviewField}>
            <Typography variant={'h3'} className={classes.overviewTitle}>{raw.name} Balance</Typography>
            <Typography variant={'h2'} className={classes.overviewValue}>{raw.balance ? toFixed(raw.balance, 18, 6) : "0"} {raw.symbol}</Typography>
          </div>
          <div className={classes.overviewField}>
            <Typography variant={'h3'} className={classes.overviewTitle}>{wrapper.name} Balance</Typography>
            <Typography variant={'h2'} className={classes.overviewValue}>{wrapper.balance ? toFixed(wrapper.balance, 18, 6) : "0"} {wrapper.symbol}</Typography>
          </div>
        </div>
        {this.renderWrap()}

        { snackbarMessage && this.renderSnackbar() }
        { loading && <Loader /> }
      </div>
    )
  }

  renderWrap() {
    const { classes } = this.props;

    const {
      loading,
      wrapping: {raw, wrapper},
    } = this.state

    return (
      <div className={ classes.actions }>
        <Typography className={ classes.stakeTitle } variant={ 'h3'}>Wrap your tokens</Typography>
        { this.renderAssetInput(raw.balance, 'wrap') }
        <div className={ classes.stakeButtons }>
          <Button
            className={ classes.stakeButton }
            variant="outlined"
            color="secondary"
            disabled={ loading }
            onClick={ () => { this.onWrap() } }
          >
            <Typography variant={ 'h4'}>Wrap</Typography>
          </Button>
        </div>

        <Typography className={ classes.stakeTitle } variant={ 'h3'}>Unwrap your tokens</Typography>
        { this.renderAssetInput(wrapper.balance, 'unwrap') }
        <div className={ classes.stakeButtons }>
          <Button
            className={ classes.stakeButton }
            variant="outlined"
            color="secondary"
            disabled={ loading }
            onClick={ () => { this.onUnwrap() } }
          >
            <Typography variant={ 'h4'}>Unwrap</Typography>
          </Button>
        </div>
      </div>
    )
  }

  overlayClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

  onWrap = () => {
    this.setState({ amountError: false })
    const amountString = this.state['wrap']
    // Using toString() here seems to magically render trailing zeros past the point of significance,
    // while toFixed() renders the nearest number.
    const amount = bigInt((parseFloat(amountString) * 10**18).toString())

    this.setState({ loading: true })
    dispatcher.dispatch({ type: WRAP, content: { amount: amount } })
  }

  onUnwrap = () => {
    this.setState({ amountError: false })
    const amountString = this.state['unwrap']
    const amount = bigInt((parseFloat(amountString) * 10**18).toString())

    this.setState({ loading: true })
    dispatcher.dispatch({ type: UNWRAP, content: { amount: amount } })
  }

  renderAssetInput = (balance, type) => {
    const {
      classes
    } = this.props

    const {
      loading
    } = this.state

    const amount = this.state[type]
    const amountError = this.state[type + '_error']

    return (
      <div className={ classes.valContainer } key={type}>
        <div className={ classes.balances }>
          { <Typography variant='h4' onClick={ () => { this.setAmount(type, balance) } } className={ classes.value } noWrap>{ 'Balance: '+ ( balance ? toFixed(balance, 18, 6) : '0') }</Typography> }
        </div>
        <div>
          <TextField
            fullWidth
            disabled={ loading }
            className={ classes.actionInput }
            id={ type }
            value={ amount }
            error={ amountError }
            onChange={ this.onChange }
            placeholder="0.00"
            variant="outlined"
            InputProps={{
              //endAdornment: <InputAdornment position="end" className={ classes.inputAdornment }><Typography variant='h3' className={ '' }>{ asset.symbol }</Typography></InputAdornment>,
              startAdornment: <InputAdornment position="end" className={ classes.inputAdornment }>
                <div className={ classes.assetIcon }>
                  <img
                    alt=""
                    src={ require('../../assets/YFL-logo.png') }
                    height="30px"
                  />
                </div>
              </InputAdornment>,
            }}
          />
        </div>
      </div>
    )
  }

  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  };

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  setAmount = (type, balance) => {
    const bal = toFixed(balance, 18, 6)
    let val = []
    val[type] = bal
    this.setState(val)
  }
}

function toFixed(bi, decimals, desired) {
  const trunc = decimals - desired
  const shift = decimals - trunc
  return (bi.divide(10**trunc).toJSNumber() / (10**shift)).toFixed(desired)
}

export default withRouter(withStyles(styles)(Wrap));
