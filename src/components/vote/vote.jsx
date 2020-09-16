import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  InputBase,
  Button,
  IconButton,
  Card,
} from "@material-ui/core";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import ArrowRightAltOutlinedIcon from "@material-ui/icons/ArrowRightAltOutlined";
import bigInt from "big-integer";

import HeaderLogo from "../header/logo/logo";
import HeaderLink from "../header/link/link";
import RedirectModal from "../header/modal/modal";
import Loader from "../loader";
import Snackbar from "../snackbar";
import UnlockModal from "../unlock/unlockModal.jsx";

import Proposal from "./proposal";

import Store from "../../stores";
import { colors } from "../../theme";

import { ReactComponent as OptionsIcon } from "../../assets/YFLink-header-options.svg";

import {
  ERROR,
  CONFIGURE_RETURNED,
  PROPOSE_RETURNED,
  GET_GOV_REQUIREMENTS,
  GET_BALANCES_RETURNED,
  GET_PROPOSALS,
  GET_PROPOSALS_RETURNED,
  VOTE_FOR_RETURNED,
  VOTE_AGAINST_RETURNED,
  STAKE,
  STAKE_RETURNED,
  WITHDRAW,
  WITHDRAW_RETURNED,
} from "../../constants";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    minHeight: "100vh",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.greyBackground,
    overflow: "hidden",
    position: "relative",
  },
  between: {
    width: "40px",
  },
  intro: {
    zIndex: "2",
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: "60px",
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

  actionButton: {
    padding: "12px 16px",
    backgroundColor: "transparent",
    borderRadius: "3px",
    border: "1px solid #FFFFFF",
    color: colors.white,
    height: "43px",
  },

  buttonText: {
    fontWeight: "700",
    color: "white",
  },
  instructions: {
    textAlign: "center",
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
  proposalContainer: {
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  field: {
    minWidth: "100%",
    paddingBottom: "20px",
  },
  fieldTitle: {
    paddingLeft: "20px",
  },
  titleInput: {
    borderRadius: "25px",
  },
  headingName: {
    paddingTop: "5px",
    flex: 2,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    minWidth: "100%",
    [theme.breakpoints.up("sm")]: {
      minWidth: "auto",
    },
  },
  heading: {
    display: "none",
    paddingTop: "12px",
    flex: 1,
    flexShrink: 0,
    [theme.breakpoints.up("sm")]: {
      paddingTop: "5px",
      display: "block",
    },
  },
  assetSummary: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    flexWrap: "wrap",
    [theme.breakpoints.up("sm")]: {
      flexWrap: "nowrap",
    },
  },
  assetIcon: {
    display: "flex",
    alignItems: "center",
    verticalAlign: "middle",
    borderRadius: "20px",
    height: "30px",
    width: "30px",
    textAlign: "center",
    cursor: "pointer",
    marginRight: "20px",
    [theme.breakpoints.up("sm")]: {
      height: "40px",
      width: "40px",
      marginRight: "24px",
    },
  },
  grey: {
    color: colors.darkGray,
  },
  proposalCard: {
    maxWidth: "calc(100vw - 24px)",
    width: "100%",
    borderRadius: "4px",
    background: colors.lightGray4,
    color: colors.white,
    border: "solid 0px transparent",
    height: "96px",
    marginBottom: "16px",
    "&:hover": {
      background: colors.lightGray2,
    },
  },
  stakeTitle: {
    width: "100%",
    color: colors.white,
    textAlign: "center",
    fontWeight: "normal",
  },
  propEmptyContainer: {
    display: "flex",
    flexWrap: "wrap",
    padding: "28px 30px",
    borderRadius: "3px",
    background: "transparent",
    width: "100%",
    marginBottom: "12px",
  },
  stakeButton: {
    minWidth: "300px",
  },
  proposerAddressContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    "& > svg": {
      visibility: "hidden",
    },
    "&:hover > svg": {
      visibility: "visible",
    },
  },
  desktopHeaderContainer: {
    zIndex: "2",
    width: "100%",
    height: "90px",
    paddingLeft: "30px",
    paddingRight: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "@media (max-width: 768px)": {
      display: "none",
    },
  },
  mobileHeaderContainer: {
    zIndex: "2",
    width: "100%",
    height: "90px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px",
    "@media (min-width: 768px)": {
      display: "none",
    },
  },

  logoContainer: {
    zIndex: "2",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
    minWidth: "400px",
    "@media (max-width: 768px)": {
      minWidth: "100px",
    },
  },

  linkContainer: {
    zIndex: "2",
    flex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: "56px",
    "& > *": {
      marginRight: "40px",
    },
  },

  walletContainer: {
    zIndex: "2",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "168px",
  },

  walletButton: {
    backgroundColor: colors.transGreyBackground,
    color: colors.white,
    borderColor: colors.white,
    borderRadius: "4px",
    "&:hover": {
      backgroundColor: colors.transGreyBackgroundHover,
    },
    padding: "16px",
    width: "168px",
    height: "43px",
  },
  headerWalletAddress: {
    width: "140px",
  },
  optionsContainer: {
    zIndex: "2",
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  rightMarkSection: {
    zIndex: "1",
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    top: "90px",
    right: "0px",
    width: "270px",
    height: "100%",
    backgroundImage: `url('YFL-BG-pattern-right.svg')`,
    backgroundRepeat: "repeat-y",
    backgroundSize: "270px 1200px",
    backgroundPositionX: "left",
    "@media (max-width: 768px)": {
      display: "none",
    },
  },

  leftMarkSection: {
    zIndex: "1",
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    top: "90px",
    left: "0px",
    width: "470px",
    height: "100%",
    backgroundImage: `url('YFL-BG-pattern-left.svg')`,
    backgroundRepeat: "repeat-y",
    backgroundSize: "270px 1200px",
    backgroundPositionX: "left",
    backgroundPositionY: "-350px",
    "@media (max-width: 768px)": {
      display: "none",
    },
  },
  mainBody: {
    width: "100%",
    maxWidth: "900px",
    display: "flex",
    flexDirection: "column",
    paddingTop: "70px",
  },
  cardHeading: {
    color: colors.white,
    fontWeight: "normal",
    marginBottom: "24px",
  },
  governanceCard: {
    width: "100%",
    height: "300px",
    backgroundColor: colors.lightGray2,
    borderRadius: "8px",
  },
  governanceCardHeadSection: {
    width: "100%",
    height: "56px",
    backgroundColor: colors.darkGray2,
    borderRadius: "8px 8px 0px 0px",
    padding: "0px 12px",
    display: "flex",
    alignItems: "center",
  },
  governanceButtonSpan: {
    color: colors.white,
    marginRight: "8px",
    fontWeight: "normal",
  },
  governanceCardBodySection: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  governanceCardBodyVault: {
    display: "flex",
    width: "100%",
    padding: "12px",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  governanceVaultButtonSpan: {
    marginLeft: "12px",
    color: colors.white,
    fontWeight: "normal",
  },
  governanceVaultIcon: {
    width: "30px",
    height: "30px",
    objectFit: "contain",
  },
  govStakeWithdrawContainer: {
    width: "100%",
    display: "flex",
    paddingTop: "12px",
    paddingBottom: "24px",
  },
  govStakeContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    paddingLeft: "24px",
    paddingRight: "24px",
    minWidth: "300px",
  },
  govStakeWithdrawHeaderContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  govStakeWithdrawBalanceSpan: {
    color: colors.white,
    fontWeight: "normal",
  },
  govStakeMinBalanceSpan: {
    color: colors.greyText,
    fontWeight: "normal",
  },
  govStakeWithdrawInputContainer: {
    width: "100%",
    marginBottom: "16px",
  },

  govStakeWithdrawButtonContainer: {
    width: "100%",
    height: "43px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  govWithdrawContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    paddingLeft: "24px",
    paddingRight: "24px",
    minWidth: "300px",
  },
  customInputBoxRoot: {
    width: "100%",
    height: 42,
    background: colors.lightGray3,
    borderRadius: 3,
    border: "solid 0px rgba(255, 255, 255, 0.2)",
    color: colors.white,
    padding: "0 12px",
  },
  voteProposalList: {
    width: "100%",
    maxWidth: "900px",
    display: "flex",
    flexDirection: "column",
  },

  loadMoreButton: {
    width: "100%",
    height: "43px",
    color: colors.white,
    backgroundColor: "transparent",
    border: "solid 1px #ffffff",
    borderRadius: "3px",
  },

  loadMoreText: {
    color: colors.white,
  },

  toggleButtonRoot: {
    backgroundColor: "transparent",
    border: "solid 0px transparent",
    color: "white",
  },

  toggleButtonSelected: {
    backgroundColor: "transparent",
    border: "solid 0px transparent",
    borderBottom: "solid 3px white",
  },

  voteActionContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: "24px",
  },

  voteProposalFilters: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  voteToggleButton: {
    color: colors.white,
    backgroundColor: "transparent",
  },

  voteToggleText: {
    fontWeight: "normal",
    fontSize: "18px",
    color: colors.white,
  },

  voteToggleSelectedMark: {
    width: "calc(100% - 48px)",
    position: "absolute",
    bottom: "4px",
    height: "3px",
    backgroundColor: "white",
  },
  voteCreateProposalButton: {
    color: colors.white,
    backgroundColor: colors.brandBlue,
    borderRadius: "3px",
    "&:hover": {
      backgroundColor: colors.transGreyBackgroundHover,
    },
  },
  voteCreateProposalButtonDisabled: {
    opacity: 0.3,
    color: `${colors.white} !important`,
    backgroundColor: `${colors.blue} !important`,
    borderRadius: "3px",
  },
});

const emitter = Store.emitter;
const dispatcher = Store.dispatcher;
const store = Store.store;

function toFixed(bi, decimals, desired) {
  const trunc = decimals - desired;
  const shift = decimals - trunc;
  return (bi.divide(10 ** trunc).toJSNumber() / 10 ** shift).toFixed(desired);
}

class Vote extends Component {
  constructor(props) {
    super(props);

    const account = store.getStore("account");
    const proposals = store.getStore("proposals");
    const pool = store.getStore("currentPool");
    if (!account || !account.address) {
      props.history.push("/");
    }

    this.state = {
      loading: true,
      account: account,
      pool: pool,
      proposals: proposals,
      value: 0,
      voteLockValid: false,
      balanceValid: false,
      voteLock: null,
    };

    if (account && account.address) {
      dispatcher.dispatch({ type: GET_PROPOSALS, content: {} });
    }
    if (pool && pool.id.startsWith("gov") && account && account.address) {
      dispatcher.dispatch({ type: GET_GOV_REQUIREMENTS, content: {} });
    }
  }

  componentDidMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(CONFIGURE_RETURNED, this.configureReturned);
    emitter.on(PROPOSE_RETURNED, this.showHash);
    emitter.on(GET_PROPOSALS_RETURNED, this.proposalsReturned);
    emitter.on(GET_BALANCES_RETURNED, this.balancesReturned);
    emitter.on(VOTE_FOR_RETURNED, this.showHash);
    emitter.on(VOTE_AGAINST_RETURNED, this.showHash);
    emitter.on(STAKE_RETURNED, this.stakeReturned);
    emitter.on(WITHDRAW_RETURNED, this.withdrawReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
    emitter.removeListener(PROPOSE_RETURNED, this.showHash);
    emitter.removeListener(GET_PROPOSALS_RETURNED, this.proposalsReturned);
    emitter.removeListener(VOTE_FOR_RETURNED, this.showHash);
    emitter.removeListener(VOTE_AGAINST_RETURNED, this.showHash);
  }

  errorReturned = (_error) => {
    this.setState({ loading: false });
  };

  proposalsReturned = () => {
    const proposals = store.getStore("proposals");
    this.setState({ proposals: proposals, loading: false });
  };

  balancesReturned = () => {
    const currentPool = store.getStore("currentPool");
    const pools = store.getStore("rewardPools");
    if (currentPool) {
      let newPool = pools.filter((pool) => {
        return pool.id === currentPool.id;
      });

      if (newPool.length > 0) {
        newPool = newPool[0];
        store.setStore({ currentPool: newPool });
        this.setState({ pool: newPool });
      }
    } else {
      if (pools.length > 0) {
        store.setStore({ currentPool: pools[0] });
        this.setState({ pool: pools[0] });
      }
    }
  };

  govRequirementsReturned = (requirements) => {
    this.setState({
      balanceValid: requirements.balanceValid,
      voteLockValid: requirements.voteLockValid,
      voteLock: requirements.voteLock,
    });
  };

  stakeReturned = (txData) => {
    this.showSnackbar(txData, "Hash");
  };

  withdrawReturned = (txData) => {
    this.showSnackbar(txData, "Hash");
  };

  showHash = (txHash) => {
    this.showSnackbar(txHash, "Hash");
  };

  showAddressCopiedSnack = () => {
    this.showSnackbar("Address Copied to Clipboard", "Success");
  };

  showSnackbar = (message, type) => {
    this.setState({
      snackbarMessage: null,
      snackbarType: null,
      loading: false,
    });
    const that = this;
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: message, snackbarType: type };
      that.setState(snackbarObj);
    });
  };

  configureReturned = () => {
    this.setState({ loading: false });
  };

  renderHeader = (screenType) => {
    const { classes } = this.props;
    const { account } = this.state;
    const wallet =
      account.address &&
      account.address.substring(0, 6) +
        "..." +
        account.address.substring(
          account.address.length - 4,
          account.address.length
        );

    if (screenType === "DESKTOP") {
      return (
        <div className={classes.desktopHeaderContainer}>
          <div className={classes.logoContainer}>
            <HeaderLogo />
          </div>
          <div className={classes.linkContainer}>
            {/* <HeaderLink text='STAKE' to={account && account.address ? '/staking' : '/account'} redirectedTo={'/staking'} /> */}
            <HeaderLink
              text="VOTE"
              to={account && account.address ? "/vote" : "/account"}
              redirectedTo={"/vote"}
              selected={true}
            />
            <HeaderLink
              text="BUY YFL"
              to={
                "https://app.uniswap.org/#/swap?outputCurrency=0x28cb7e841ee97947a86b06fa4090c8451f64c0be"
              }
              externalLink={true}
            />
            <HeaderLink text="LINKSWAP" to="/" disabled tag="SOON" />
            {/* <HeaderLink text='PRODUCTS' to='/' disabled tag='SOON' /> */}
          </div>
          <div className={classes.walletContainer}>
            {account && account.address && (
              <Button
                className={classes.walletButton}
                variant="contained"
                color="primary"
                onClick={this.overlayClicked}
                startIcon={
                  <FiberManualRecordIcon style={{ color: colors.lightGreen }} />
                }
              >
                <Typography
                  variant={"h4"}
                  className={classes.headerWalletAddress}
                  noWrap
                >
                  {wallet}
                </Typography>
              </Button>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className={classes.mobileHeaderContainer}>
          <div className={classes.logoContainer}>
            <HeaderLogo />
          </div>
          <div className={classes.optionsContainer}>
            <IconButton
              onClick={() => {
                this.setState({ navModalOpen: true });
              }}
            >
              <OptionsIcon style={{ color: colors.white }} />
            </IconButton>
          </div>
        </div>
      );
    }
  };

  renderNavigationModal = () => {
    const { account } = this.state;
    return (
      <RedirectModal
        closeModal={this.closeNavModal}
        modalOpen={this.state.navModalOpen}
        account={account}
      />
    );
  };

  renderBackground = (screenType) => {
    const { classes } = this.props;

    if (screenType === "DESKTOP") {
      return (
        <>
          <div className={classes.rightMarkSection} />
          <div className={classes.leftMarkSection} />
        </>
      );
    } else if (screenType === "MOBILE") {
      return <></>;
    }
  };
  openInstructions = () => {
    window.open(
      "https://gov.yflink.io/t/staking-in-the-governance-contract/28"
    );
  };

  openContract = () => {
    window.open(
      "https://etherscan.io/address/0xc150eade946079033c3b840bd7e81cdd5354e467"
    );
  };

  openProposal = (url) => {
    window.open(url);
  };

  loadMore = () => {
    const { account } = this.state;
    if (account && account.address) {
      this.setState({ loading: true });
      dispatcher.dispatch({ type: GET_PROPOSALS, content: {} });
    }
  };

  onStake = () => {
    const { pool, stakeAmount } = this.state;
    if (!pool) {
      console.log("OnStake POOL error!");
      return;
    }
    const asset = pool.tokens[0];
    if (!stakeAmount || stakeAmount < 0.1) {
      console.log("OnStake Invalid Amount!");
      return;
    }

    const amountString = stakeAmount;
    const amount = bigInt(
      (parseFloat(amountString) * 10 ** asset.decimals).toString()
    );

    this.setState({ loading: true });
    dispatcher.dispatch({
      type: STAKE,
      content: { asset: asset, amount: amount },
    });
  };

  onWithdraw = () => {
    const { pool, withdrawAmount } = this.state;
    if (!pool) {
      console.log("OnWithdraw POOL error!");
      return;
    }
    const asset = pool.tokens[0];
    if (!withdrawAmount) {
      console.log("OnWithdraw Invalid Amount!");
      return;
    }
    const amountString = withdrawAmount;
    const amount = bigInt(
      (parseFloat(amountString) * 10 ** asset.decimals).toString()
    );

    this.setState({ loading: true });
    dispatcher.dispatch({
      type: WITHDRAW,
      content: { asset: asset, amount: amount },
    });
  };

  render() {
    const { classes } = this.props;
    const { value, pool, loading, modalOpen, snackbarMessage } = this.state;

    const token = pool && pool.tokens[0];

    return (
      <div className={classes.root}>
        {this.renderBackground("DESKTOP")}
        {this.renderBackground("MOBILE")}
        {this.renderHeader("DESKTOP")}
        {this.renderHeader("MOBILE")}
        <div className={classes.mainBody}>
          <div className={classes.intro}>
            <Typography variant={"h1"} className={classes.cardHeading}>
              Governance
            </Typography>
            <Card className={classes.governanceCard}>
              <div className={classes.governanceCardHeadSection}>
                <IconButton
                  onClick={() => {
                    this.openInstructions();
                  }}
                >
                  <Typography
                    variant={"h4"}
                    className={classes.governanceButtonSpan}
                  >
                    Instructions
                  </Typography>
                  <ArrowRightAltOutlinedIcon style={{ color: colors.white }} />
                </IconButton>
                <IconButton
                  onClick={() => {
                    this.openContract();
                  }}
                >
                  <Typography
                    variant={"h4"}
                    className={classes.governanceButtonSpan}
                  >
                    Contract
                  </Typography>
                  <ArrowRightAltOutlinedIcon style={{ color: colors.white }} />
                </IconButton>
              </div>
              <div className={classes.governanceCardBodySection}>
                <div className={classes.governanceCardBodyVault}>
                  <IconButton
                    onClick={() => {
                      this.goToDashboard();
                    }}
                  >
                    <img
                      alt="logo"
                      src={require("../../assets/YFLink-header-logo.svg")}
                      className={classes.governanceVaultIcon}
                    />
                    <Typography
                      variant={"h3"}
                      className={classes.governanceVaultButtonSpan}
                    >
                      Governance Vault
                    </Typography>
                  </IconButton>
                </div>
                <div className={classes.govStakeWithdrawContainer}>
                  <div className={classes.govStakeContainer}>
                    <div className={classes.govStakeWithdrawHeaderContainer}>
                      <Typography
                        variant={"h4"}
                        className={classes.govStakeWithdrawBalanceSpan}
                      >
                        Your Balance:&nbsp;
                        {token && token.balance
                          ? toFixed(token.balance, token.decimals, 6)
                          : "0"}{" "}
                        {token && token.symbol}
                      </Typography>
                      <Typography
                        variant={"h4"}
                        className={classes.govStakeMinBalanceSpan}
                      >
                        Min: 0.1 YFL
                      </Typography>
                    </div>
                    <div className={classes.govStakeWithdrawInputContainer}>
                      <InputBase
                        classes={{
                          root: classes.customInputBoxRoot,
                        }}
                        onChange={(ev) => {
                          this.setState({
                            stakeAmount: ev.target.value,
                          });
                        }}
                        placeholder="Enter amount you want to deposit."
                        type="number"
                        autoFocus
                      />
                    </div>
                    <div className={classes.govStakeWithdrawButtonContainer}>
                      <Button
                        className={classes.actionButton}
                        variant="outlined"
                        onClick={() => {
                          this.onStake();
                        }}
                        disabled={!token}
                      >
                        Deposit
                      </Button>
                    </div>
                  </div>
                  <div className={classes.govWithdrawContainer}>
                    <div className={classes.govStakeWithdrawHeaderContainer}>
                      <Typography
                        variant={"h4"}
                        className={classes.govStakeWithdrawBalanceSpan}
                      >
                        Staked:&nbsp;
                        {token && token.stakedBalance
                          ? toFixed(token.stakedBalance, token.decimals, 6)
                          : "0"}{" "}
                        {token && token.symbol}
                      </Typography>
                    </div>
                    <div className={classes.govStakeWithdrawInputContainer}>
                      <InputBase
                        classes={{
                          root: classes.customInputBoxRoot,
                        }}
                        onChange={(ev) => {
                          this.setState({
                            withdrawAmount: ev.target.value,
                          });
                        }}
                        placeholder="Enter amount you want to withdraw."
                        type="number"
                        autoFocus
                      />
                    </div>
                    <div className={classes.govStakeWithdrawButtonContainer}>
                      <Button
                        className={classes.actionButton}
                        variant="outlined"
                        onClick={() => {
                          this.onWithdraw();
                        }}
                        disabled={
                          !token || (token && token.stakedBalance.value === 0n)
                        }
                      >
                        Withdraw
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div className={classes.intro}>
            <Typography variant={"h1"} className={classes.cardHeading}>
              Vote
            </Typography>
            <div className={classes.voteActionContainer}>
              <div className={classes.voteProposalFilters}>
                <Button
                  className={classes.voteToggleButton}
                  variant="text"
                  onClick={() => {
                    this.handleTabChange(null, 0);
                  }}
                >
                  <Typography variant="h4" className={classes.voteToggleText}>
                    GOV
                  </Typography>
                  {value === 0 && (
                    <div className={classes.voteToggleSelectedMark} />
                  )}
                </Button>
                <Button
                  className={classes.voteToggleButton}
                  variant="text"
                  onClick={() => {
                    this.handleTabChange(null, 1);
                  }}
                >
                  <Typography variant="h4" className={classes.voteToggleText}>
                    MEMES
                  </Typography>
                  {value === 1 && (
                    <div className={classes.voteToggleSelectedMark} />
                  )}
                </Button>
              </div>
              <Button
                variant="contained"
                classes={{
                  root: classes.voteCreateProposalButton,
                  disabled: classes.voteCreateProposalButtonDisabled,
                }}
                disabled={true}
              >
                Generate New Proposal
              </Button>
            </div>
            <div className={classes.voteProposalList}>
              {this.renderProposals()}
              <Button
                variant="outlined"
                className={classes.loadMoreButton}
                onClick={() => {
                  this.loadMore();
                }}
              >
                <Typography variant="h4" className={classes.loadMoreText}>
                  Load More
                </Typography>
              </Button>
            </div>
          </div>
        </div>
        {snackbarMessage && this.renderSnackbar()}
        {loading && <Loader />}
        {modalOpen && this.renderModal()}
        {this.renderNavigationModal()}
      </div>
    );
  }

  renderProposals = () => {
    const { proposals, value } = this.state;
    const { classes } = this.props;

    const filteredProposals = proposals
      .filter((proposal) => {
        const isGov = proposal.url.includes("gov");
        const isMeme = proposal.url.includes("?meme");
        return value === 0 ? isGov : isMeme;
      })
      .sort((prop1, prop2) => prop2.end - prop1.end);

    if (filteredProposals.length === 0) {
      return (
        <div className={classes.propEmptyContainer}>
          <Typography className={classes.stakeTitle} variant={"h3"}>
            No proposals
          </Typography>
        </div>
      );
    }

    return filteredProposals.map((proposal) => {
      return (
        <Button
          className={classes.proposalCard}
          key={proposal.id + "_expand"}
          onClick={() => {
            this.openProposal(proposal.url);
          }}
        >
          <Proposal
            proposal={proposal}
            startLoading={this.startLoading}
            showSnackbar={this.showSnackbar}
          />
        </Button>
      );
    });
  };

  goToDashboard = () => {
    window.open("https://gov.yflink.io/", "_blank");
  };

  handleTabChange = (event, newValue) => {
    this.setState({ value: newValue });
  };

  startLoading = () => {
    this.setState({ loading: true });
  };

  handleChange = (id) => {
    this.setState({ expanded: this.state.expanded === id ? null : id });
  };

  copyAddressToClipboard = (event, address) => {
    event.stopPropagation();
    navigator.clipboard.writeText(address).then(() => {
      this.showAddressCopiedSnack();
    });
  };

  onChange = (event) => {
    let val = [];
    val[event.target.id] = event.target.value;
    this.setState(val);
  };

  onPropose = () => {
    this.props.history.push("propose");
  };

  renderModal = () => {
    return (
      <UnlockModal
        closeModal={this.closeModal}
        modalOpen={this.state.modalOpen}
      />
    );
  };

  renderSnackbar = () => {
    var { snackbarType, snackbarMessage } = this.state;
    return (
      <Snackbar type={snackbarType} message={snackbarMessage} open={true} />
    );
  };

  overlayClicked = () => {
    this.setState({ modalOpen: true });
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  closeNavModal = () => {
    this.setState({ navModalOpen: false });
  };
}

export default withRouter(withStyles(styles)(Vote));
