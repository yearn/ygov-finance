import * as moment from 'moment';
import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {withStyles} from '@material-ui/core/styles';
import {
  Typography,
  Button,
  Card
} from '@material-ui/core';

import UnlockModal from '../unlock/unlockModal.jsx'
import Store from "../../stores";
import {colors} from '../../theme'

import {
  CONFIGURE_RETURNED,
  GET_BALANCES,
  GET_BALANCES_RETURNED,
} from '../../constants'
import Loader from '../loader/loader.jsx';

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '700px',
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
    maxWidth: '400px'
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
    textOverflow: 'ellipsis',
    cursor: 'pointer',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid ' + colors.borderBlue,
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
  rewardPools: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    paddingTop: '20px',
    flexWrap: 'wrap'
  },
  rewardPoolContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid ' + colors.borderBlue,
    margin: '20px',
    background: colors.white,
    minHeight: '240px',
    minWidth: '200px',
  },
  title: {
    width: '100%',
    color: colors.darkGray,
    minWidth: '100%',
    marginLeft: '20px'
  },
  poolName: {
    color: colors.text
  },
  poolWebsite: {
    paddingTop: '20px',
    color: colors.darkGray,
    textDecoration: 'none'
  },
  poolInstructions: {
    marginTop: '10px',
  },
  tokensList: {
    paddingTop: '20px',
    color: colors.darkGray,
    paddingBottom: '20px',
  },
  timestamp: {
    paddingTop: '16px',
    fontStyle: 'italic',
    fontSize: '14px',
  },
})

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class RewardPools extends Component {

  constructor(props) {
    super(props)

    const account = store.getStore('account')
    const rewardPools = store.getStore('rewardPools')

    if (!account || !account.address) {
      props.history.push('/')
    }

    this.state = {
      rewardPools: rewardPools,
      loading: !(account && rewardPools),
      account: account,
    }
    if (account && account.address) {
      dispatcher.dispatch({type: GET_BALANCES, content: {}})
    }
  }

  componentDidMount() {
    emitter.on(CONFIGURE_RETURNED, this.configureReturned);
    emitter.on(GET_BALANCES_RETURNED, this.balancesReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned);
  };

  balancesReturned = () => {
    const rewardPools = store.getStore('rewardPools')
    this.setState({rewardPools: rewardPools})
  }

  configureReturned = () => {
    this.setState({loading: false})
  }

  render() {
    const {classes} = this.props;
    const {
      account,
      loading,
      modalOpen,
    } = this.state

    var address = null;
    if (account.address) {
      address = account.address.substring(0, 6) + '...' + account.address.substring(account.address.length - 4, account.address.length)
    }

    if (loading) {
      return (
        <div className={classes.root}>
          <Loader />
        </div>
      )
    }

    return (
        <div className={classes.root}>
          <Typography variant={'h5'} className={classes.disaclaimer}>This project is in beta. Use at your own
            risk.</Typography>
          <div className={classes.intro}>
            <Card className={classes.addressContainer} onClick={this.overlayClicked}>
              <Typography variant={'h3'} className={classes.walletTitle} noWrap>Wallet</Typography>
              <Typography variant={'h4'} className={classes.walletAddress} noWrap>{address}</Typography>
              <div style={{
                background: '#DC6BE5',
                opacity: '1',
                borderRadius: '10px',
                width: '10px',
                height: '10px',
                marginRight: '3px',
                marginTop: '3px',
                marginLeft: '6px'
              }}/>
            </Card>
          </div>
          <div className={classes.rewardPools}>
            <Typography variant={'h3'} className={classes.title} noWrap>Which tokens would you like to
              stake?</Typography>
            {
              this.renderRewards()
            }
          </div>
          {modalOpen && this.renderModal()}
        </div>
    )
  }

  renderRewards = () => {
    const {rewardPools} = this.state

    return rewardPools.map((rewardPool) => {
      return this.renderRewardPool(rewardPool)
    })
  }

  renderRewardPool = (rewardPool) => {
    const {classes} = this.props

    let address = null;
    let addy = ''
    if (rewardPool.tokens && rewardPool.tokens[0]) {
      addy = rewardPool.tokens[0].rewardsAddress
      address = addy.substring(0, 6) + '...' + addy.substring(addy.length - 4, addy.length)
    }

    const now = moment()
    const openingSoon = rewardPool.startDate?.isAfter(now)
    return (<div className={classes.rewardPoolContainer} key={rewardPool.id}>
      <Typography variant='h3' className={classes.poolTitle}>{rewardPool.title}</Typography>
      <Typography variant='h5' className={classes.poolName}>{rewardPool.name}</Typography>
      <Typography variant='h4' className={classes.poolWebsite}><a href={rewardPool.link} target="_blank" rel="noopener noreferrer">{rewardPool.website}</a></Typography>
      <Button className={classes.poolInstructions} variant="outlined" color="secondary" onClick={() => window.open(rewardPool.instructionsLink, '_blank')}>
        <Typography variant={'h4'}>Instructions</Typography>
      </Button>
      <Typography varian='h4' className={classes.tokensList} align='center'>
        Contract: <a href={'https://etherscan.io/address/' + addy} target="_blank" rel="noopener noreferrer">{address}</a>
      </Typography>
      <Button variant="outlined" color="secondary" onClick={() => {if (rewardPool.tokens.length > 0) {this.navigateStake(rewardPool)}}}>
        <Typography variant={'h4'}>{
          rewardPool.depositsEnabled === false ? 'Rewards exhausted' :
              openingSoon ? 'Opening Soon' :
                  rewardPool.id.startsWith('gov') ? 'Stake' :
                      'Mine $YFL'
        }</Typography>
      </Button>
      {openingSoon &&
      <Typography className={classes.timestamp}>
        Opens {rewardPool.startDate.utc().format("D MMM, HH:mm")} UTC ({rewardPool.startDate.fromNow(true)})
      </Typography>
      }
    </div>)
  }

  navigateStake = (rewardPool) => {
    store.setStore({currentPool: rewardPool})

    this.props.history.push('/stake')
  }

  renderModal = () => {
    return (
        <UnlockModal closeModal={this.closeModal} modalOpen={this.state.modalOpen}/>
    )
  }

  overlayClicked = () => {
    this.setState({modalOpen: true})
  }

  closeModal = () => {
    this.setState({modalOpen: false})
  }

}

export default withRouter(withStyles(styles)(RewardPools));
