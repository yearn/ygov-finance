/* eslint-disable jsx-a11y/anchor-is-valid */
import bigInt from "big-integer";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";

import Loader from "../loader";
import Snackbar from "../snackbar";

import Store from "../../stores";
import { colors } from "../../theme";

import {
  ERROR,
  EXIT,
  EXIT_RETURNED,
  GET_BALANCES_RETURNED,
  GET_REWARDS,
  GET_REWARDS_RETURNED,
  GET_GOV_REQUIREMENTS,
  GET_GOV_REQUIREMENTS_RETURNED,
  STAKE,
  STAKE_RETURNED,
  WITHDRAW,
  WITHDRAW_RETURNED,
} from "../../constants";

const styles = (theme) => ({
  root: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    maxWidth: "900px",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: "40px",
  },
  intro: {
    width: "100%",
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  introCenter: {
    minWidth: "100%",
    textAlign: "center",
    padding: "48px 0px",
  },
  investedContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px",
    minWidth: "100%",
    [theme.breakpoints.up("md")]: {
      minWidth: "800px",
    },
  },
  connectContainer: {
    padding: "12px",
    display: "flex",
    justifyContent: "center",
    width: "100%",
    maxWidth: "450px",
    [theme.breakpoints.up("md")]: {
      width: "450",
    },
  },
  disaclaimer: {
    padding: "12px",
    border: "1px solid rgb(174, 174, 174)",
    borderRadius: "0.75rem",
    marginBottom: "24px",
  },
  addressContainer: {
    display: "flex",
    justifyContent: "space-between",
    overflow: "hidden",
    flex: 1,
    whiteSpace: "nowrap",
    fontSize: "0.83rem",
    textOverflow: "ellipsis",
    cursor: "pointer",
    padding: "28px 30px",
    borderRadius: "50px",
    border: "1px solid " + colors.borderBlue,
    alignItems: "center",
    maxWidth: "500px",
    [theme.breakpoints.up("md")]: {
      width: "100%",
    },
  },
  walletAddress: {
    padding: "0px 12px",
  },
  walletTitle: {
    flex: 1,
    color: colors.darkGray,
  },
  overview: {
    display: "flex",
    justifyContent: "space-between",
    padding: "28px 30px",
    borderRadius: "50px",
    border: "1px solid " + colors.borderBlue,
    alignItems: "center",
    marginTop: "40px",
    width: "100%",
    background: colors.white,
  },
  overviewField: {
    display: "flex",
    flexDirection: "column",
  },
  overviewTitle: {
    color: colors.darkGray,
  },
  overviewValue: {},
  actions: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "900px",
    flexWrap: "wrap",
    background: colors.white,
    border: "1px solid " + colors.borderBlue,
    padding: "28px 30px",
    borderRadius: "50px",
    marginTop: "40px",
  },
  actionContainer: {
    minWidth: "calc(50% - 40px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px",
  },
  primaryButton: {
    "&:hover": {
      backgroundColor: "#2F80ED",
    },
    padding: "20px 32px",
    backgroundColor: "#2F80ED",
    borderRadius: "50px",
    fontWeight: 500,
  },
  actionButton: {
    padding: "20px 32px",
    borderRadius: "50px",
  },
  buttonText: {
    fontWeight: "700",
  },
  stakeButtonText: {
    fontWeight: "700",
    color: "white",
  },
  valContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  actionInput: {
    padding: "0px 0px 12px 0px",
    fontSize: "0.5rem",
  },
  inputAdornment: {
    fontWeight: "600",
    fontSize: "1.5rem",
  },
  assetIcon: {
    display: "inline-block",
    verticalAlign: "middle",
    borderRadius: "25px",
    background: "#dedede",
    height: "30px",
    width: "30px",
    textAlign: "center",
    marginRight: "16px",
  },
  balances: {
    width: "100%",
    textAlign: "right",
    paddingRight: "20px",
    cursor: "pointer",
  },
  stakeTitle: {
    width: "100%",
    color: colors.darkGray,
    marginBottom: "20px",
  },
  stakeButtons: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    align: "center",
    marginTop: "20px",
  },
  stakeButton: {
    minWidth: "300px",
  },
  requirement: {
    display: "flex",
    alignItems: "center",
  },
  check: {
    paddingTop: "6px",
  },
  wrapMessage: {
    width: "100%",
    margin: "20px",
  },
  voteLockMessage: {
    margin: "20px",
  },
  startDateMessage: {
    margin: "20px",
    fontStyle: "italic",
  },
  title: {
    width: "100%",
    color: colors.darkGray,
    minWidth: "100%",
    marginLeft: "20px",
  },
});

const emitter = Store.emitter;
const dispatcher = Store.dispatcher;
const store = Store.store;

class Stake extends Component {
  constructor(props) {
    super();

    const account = store.getStore("account");
    const pool = store.getStore("currentPool");

    if (!pool) {
      props.history.push("/");
    }

    if (!account || !account.address) {
      props.history.push("/");
    }

    this.state = {
      pool: pool,
      loading: !(account || pool),
      account: account,
      value: "options",
      voteLockValid: false,
      balanceValid: false,
      voteLock: null,
    };

    if (pool && pool.id.startsWith("gov") && account && account.address) {
      dispatcher.dispatch({ type: GET_GOV_REQUIREMENTS, content: {} });
    }
  }

  componentDidMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(STAKE_RETURNED, this.showHash);
    emitter.on(WITHDRAW_RETURNED, this.showHash);
    emitter.on(EXIT_RETURNED, this.showHash);
    emitter.on(GET_REWARDS_RETURNED, this.showHash);
    emitter.on(GET_GOV_REQUIREMENTS_RETURNED, this.govRequirementsReturned);
    emitter.on(GET_BALANCES_RETURNED, this.balancesReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(STAKE_RETURNED, this.showHash);
    emitter.removeListener(WITHDRAW_RETURNED, this.showHash);
    emitter.removeListener(EXIT_RETURNED, this.showHash);
    emitter.removeListener(GET_REWARDS_RETURNED, this.showHash);
    emitter.removeListener(
      GET_GOV_REQUIREMENTS_RETURNED,
      this.govRequirementsReturned
    );
    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned);
  }

  balancesReturned = () => {
    const currentPool = store.getStore("currentPool");
    const pools = store.getStore("rewardPools");
    let newPool = pools.filter((pool) => {
      return pool.id === currentPool.id;
    });

    if (newPool.length > 0) {
      newPool = newPool[0];
      store.setStore({ currentPool: newPool });
    }
  };

  govRequirementsReturned = (requirements) => {
    this.setState({
      balanceValid: requirements.balanceValid,
      voteLockValid: requirements.voteLockValid,
      voteLock: requirements.voteLock,
    });
  };

  showHash = (txHash) => {
    this.setState({
      snackbarMessage: null,
      snackbarType: null,
      loading: false,
    });
    const that = this;
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: "Hash" };
      that.setState(snackbarObj);
    });
  };

  errorReturned = (error) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null };
    this.setState(snackbarObj);
    this.setState({ loading: false });
    const that = this;
    setTimeout(() => {
      const snackbarObj = {
        snackbarMessage: error.toString(),
        snackbarType: "Error",
      };
      that.setState(snackbarObj);
    });
  };

  render() {
    const { classes } = this.props;
    const { value, account, pool, loading, snackbarMessage } = this.state;

    var address = null;
    if (account.address) {
      address =
        account.address.substring(0, 6) +
        "..." +
        account.address.substring(
          account.address.length - 4,
          account.address.length
        );
    }

    if (!pool) {
      return null;
    }

    const token = pool.tokens[0];
    return (
      <div className={classes.root}>
        <Typography variant={"h5"} className={classes.disaclaimer}>
          This project is in beta. Use at your own risk.
        </Typography>
        <div className={classes.intro}>
          <Button
            className={classes.stakeButton}
            variant="outlined"
            color="secondary"
            disabled={loading}
            onClick={() => {
              this.props.history.push("/staking");
            }}
          >
            <Typography variant={"h4"}>Back</Typography>
          </Button>
          <Card
            className={classes.addressContainer}
            onClick={this.overlayClicked}
          >
            <Typography variant={"h3"} className={classes.walletTitle} noWrap>
              Wallet
            </Typography>
            <Typography variant={"h4"} className={classes.walletAddress} noWrap>
              {address}
            </Typography>
            <div
              style={{
                background: "#DC6BE5",
                opacity: "1",
                borderRadius: "10px",
                width: "10px",
                height: "10px",
                marginRight: "3px",
                marginTop: "3px",
                marginLeft: "6px",
              }}
            />
          </Card>
        </div>
        <div className={classes.overview}>
          <div className={classes.overviewField}>
            <Typography variant={"h3"} className={classes.overviewTitle}>
              Your Balance
            </Typography>
            <Typography variant={"h2"} className={classes.overviewValue}>
              {token.balance ? toFixed(token.balance, token.decimals, 6) : "0"}{" "}
              {token.symbol}
            </Typography>
          </div>
          <div className={classes.overviewField}>
            <Typography variant={"h3"} className={classes.overviewTitle}>
              Currently Staked
            </Typography>
            <Typography variant={"h2"} className={classes.overviewValue}>
              {token.stakedBalance
                ? toFixed(token.stakedBalance, token.decimals, 6)
                : "0"}
            </Typography>
          </div>
          {token.rewardsSymbol && (
            <div className={classes.overviewField}>
              <Typography variant={"h3"} className={classes.overviewTitle}>
                Rewards Available
              </Typography>
              <Typography variant={"h2"} className={classes.overviewValue}>
                {token.rewardsSymbol === "$" ? token.rewardsSymbol : ""}{" "}
                {token.rewardsAvailable
                  ? toFixed(token.rewardsAvailable, token.decimals, 6)
                  : "0"}{" "}
                {token.rewardsSymbol !== "$" ? token.rewardsSymbol : ""}
              </Typography>
            </div>
          )}
        </div>
        {value === "options" && this.renderOptions()}
        {value === "stake" && this.renderStake()}
        {value === "unstake" && this.renderUnstake()}

        {snackbarMessage && this.renderSnackbar()}
        {loading && <Loader />}
      </div>
    );
  }

  renderOptions = () => {
    const { classes } = this.props;
    const { loading, pool, voteLockValid, balanceValid, voteLock } = this.state;

    return (
      <div className={classes.actions}>
        <Typography variant={"h3"} className={classes.title} noWrap>
          {pool.name}
        </Typography>
        {pool.id === "govrewards" && (
          <Typography variant={"h4"} className={classes.wrapMessage}>
            You must{" "}
            <a onClick={() => this.props.history.push("/wrap") && false}>
              wrap YFL tokens
            </a>{" "}
            before staking here
          </Typography>
        )}
        <div className={classes.actionContainer}>
          <Button
            fullWidth
            className={classes.primaryButton}
            variant="outlined"
            color="primary"
            disabled={
              !pool.depositsEnabled ||
              (pool.id.startsWith("gov")
                ? loading || voteLockValid || !balanceValid
                : loading)
            }
            onClick={() => {
              this.navigateInternal("stake");
            }}
          >
            <Typography className={classes.stakeButtonText} variant={"h4"}>
              Stake Tokens
            </Typography>
          </Button>
        </div>
        {pool.tokens[0].rewardsSymbol && (
          <div className={classes.actionContainer}>
            <Button
              fullWidth
              className={classes.actionButton}
              variant="outlined"
              color="primary"
              disabled={loading}
              onClick={() => {
                this.onClaim();
              }}
            >
              <Typography className={classes.buttonText} variant={"h4"}>
                Claim Rewards
              </Typography>
            </Button>
          </div>
        )}
        <div className={classes.actionContainer}>
          <Button
            fullWidth
            className={classes.actionButton}
            variant="outlined"
            color="primary"
            disabled={
              pool.id.startsWith("gov") ? loading || voteLockValid : loading
            }
            onClick={() => {
              this.navigateInternal("unstake");
            }}
          >
            <Typography className={classes.buttonText} variant={"h4"}>
              Unstake Tokens
            </Typography>
          </Button>
        </div>
        {pool.tokens[0].rewardsSymbol && (
          <div className={classes.actionContainer}>
            <Button
              fullWidth
              className={classes.actionButton}
              variant="outlined"
              color="primary"
              disabled={
                pool.id.startsWith("gov") ? loading || voteLockValid : loading
              }
              onClick={() => {
                this.onExit();
              }}
            >
              <Typography className={classes.buttonText} variant={"h4"}>
                Exit: Claim and Unstake
              </Typography>
            </Button>
          </div>
        )}
        {pool.startDate && (
          <Typography className={classes.startDateMessage}>
            Launching: {pool.startDate.format("ddd MMM D, HH:mm")}
          </Typography>
        )}
        {pool.id.startsWith("gov") && !voteLockValid && (
          <Typography variant={"h4"} className={classes.voteLockMessage}>
            Unstake at any time until you vote; voting locks tokens for voting
            period (up to 3 days).
          </Typography>
        )}
        {pool.id.startsWith("gov") && voteLockValid && (
          <Typography variant={"h4"} className={classes.voteLockMessage}>
            Unstaking allowed once pending votes close at block {voteLock}.
          </Typography>
        )}
      </div>
    );
  };

  navigateInternal = (val) => {
    this.setState({ value: val });
  };

  renderStake = () => {
    const { classes } = this.props;
    const { loading, pool } = this.state;

    const asset = pool.tokens[0];

    return (
      <div className={classes.actions}>
        <Typography className={classes.stakeTitle} variant={"h3"}>
          Stake your tokens
        </Typography>
        {this.renderAssetInput(asset, "stake")}
        <div className={classes.stakeButtons}>
          <Button
            className={classes.stakeButton}
            variant="outlined"
            color="secondary"
            disabled={loading}
            onClick={() => {
              this.navigateInternal("options");
            }}
          >
            <Typography variant={"h4"}>Back</Typography>
          </Button>
          <Button
            className={classes.stakeButton}
            variant="outlined"
            color="secondary"
            disabled={loading}
            onClick={() => {
              this.onStake();
            }}
          >
            <Typography variant={"h4"}>Stake</Typography>
          </Button>
        </div>
      </div>
    );
  };

  renderUnstake = () => {
    const { classes } = this.props;
    const { loading, pool, voteLockValid } = this.state;

    const asset = pool.tokens[0];

    return (
      <div className={classes.actions}>
        <Typography className={classes.stakeTitle} variant={"h3"}>
          Unstake your tokens
        </Typography>
        {this.renderAssetInput(asset, "unstake")}
        <div className={classes.stakeButtons}>
          <Button
            className={classes.stakeButton}
            variant="outlined"
            color="secondary"
            disabled={loading}
            onClick={() => {
              this.navigateInternal("options");
            }}
          >
            <Typography variant={"h4"}>Back</Typography>
          </Button>
          <Button
            className={classes.stakeButton}
            variant="outlined"
            color="secondary"
            disabled={
              pool.id.startsWith("gov") ? loading || voteLockValid : loading
            }
            onClick={() => {
              this.onUnstake();
            }}
          >
            <Typography variant={"h4"}>Unstake</Typography>
          </Button>
        </div>
      </div>
    );
  };

  overlayClicked = () => {
    this.setState({ modalOpen: true });
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  onStake = () => {
    this.setState({ amountError: false });
    const { pool } = this.state;
    const asset = pool.tokens[0];
    const amountString = this.state[asset.id + "_stake"];
    // Using toString() here seems to magically render trailing zeros past the point of significance,
    // while toFixed() renders the nearest number.
    const amount = bigInt(
      (parseFloat(amountString) * 10 ** asset.decimals).toString()
    );

    this.setState({ loading: true });
    dispatcher.dispatch({
      type: STAKE,
      content: { asset: asset, amount: amount },
    });
  };

  onClaim = () => {
    const { pool } = this.state;
    const tokens = pool.tokens;
    const selectedToken = tokens[0];

    this.setState({ loading: true });
    dispatcher.dispatch({
      type: GET_REWARDS,
      content: { asset: selectedToken },
    });
  };

  onUnstake = () => {
    this.setState({ amountError: false });
    const { pool } = this.state;
    const asset = pool.tokens[0];
    const amountString = this.state[asset.id + "_unstake"];
    const amount = bigInt(
      (parseFloat(amountString) * 10 ** asset.decimals).toString()
    );

    this.setState({ loading: true });
    dispatcher.dispatch({
      type: WITHDRAW,
      content: { asset: asset, amount: amount },
    });
  };

  onExit = () => {
    const { pool } = this.state;
    const tokens = pool.tokens;
    const selectedToken = tokens[0];

    this.setState({ loading: true });
    dispatcher.dispatch({ type: EXIT, content: { asset: selectedToken } });
  };

  renderAssetInput = (asset, type) => {
    const { classes } = this.props;

    const { loading } = this.state;

    const amount = this.state[asset.id + "_" + type];
    const amountError = this.state[asset.id + "_" + type + "_error"];

    return (
      <div className={classes.valContainer} key={asset.id + "_" + type}>
        <div className={classes.balances}>
          {type === "stake" && (
            <Typography
              variant="h4"
              onClick={() => {
                this.setAmount(
                  asset.id,
                  type,
                  asset ? asset.balance : bigInt()
                );
              }}
              className={classes.value}
              noWrap
            >
              {"Balance: " +
                (asset && asset.balance
                  ? toFixed(asset.balance, asset.decimals, 6)
                  : "0")}{" "}
              {asset ? asset.symbol : ""}
            </Typography>
          )}
          {type === "unstake" && (
            <Typography
              variant="h4"
              onClick={() => {
                this.setAmount(
                  asset.id,
                  type,
                  asset ? asset.stakedBalance : bigInt()
                );
              }}
              className={classes.value}
              noWrap
            >
              {"Balance: " +
                (asset && asset.stakedBalance
                  ? toFixed(asset.stakedBalance, asset.decimals, 6)
                  : "0")}{" "}
              {asset ? asset.symbol : ""}
            </Typography>
          )}
        </div>
        <div>
          <TextField
            fullWidth
            disabled={loading}
            className={classes.actionInput}
            id={"" + asset.id + "_" + type}
            value={amount}
            error={amountError}
            onChange={this.onChange}
            placeholder="0.00"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  className={classes.inputAdornment}
                >
                  <Typography variant="h3" className={""}>
                    {asset.symbol}
                  </Typography>
                </InputAdornment>
              ),
              startAdornment: (
                <InputAdornment
                  position="end"
                  className={classes.inputAdornment}
                >
                  <div className={classes.assetIcon}>
                    <img
                      alt=""
                      src={require("../../assets/" +
                        asset.symbol +
                        "-logo.png")}
                      height="30px"
                    />
                  </div>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>
    );
  };

  renderSnackbar = () => {
    var { snackbarType, snackbarMessage } = this.state;
    return (
      <Snackbar type={snackbarType} message={snackbarMessage} open={true} />
    );
  };

  onChange = (event) => {
    let val = [];
    val[event.target.id] = event.target.value;
    this.setState(val);
  };

  setAmount = (id, type, balance) => {
    const bal = toFixed(balance, 18, 6);
    let val = [];
    val[id + "_" + type] = bal;
    this.setState(val);
  };
}

function toFixed(bi, decimals, desired) {
  const trunc = decimals - desired;
  const shift = decimals - trunc;
  return (bi.divide(10 ** trunc).toJSNumber() / 10 ** shift).toFixed(desired);
}

export default withRouter(withStyles(styles)(Stake));
