import React, { Component } from "react";
import * as moment from "moment";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { withNamespaces } from "react-i18next";

import {
  ERROR,
  VOTE_FOR,
  VOTE_FOR_RETURNED,
  VOTE_AGAINST,
  VOTE_AGAINST_RETURNED,
  GET_BALANCES_RETURNED,
} from "../../constants";

import { colors } from "../../theme";

import Store from "../../stores";
const emitter = Store.emitter;
const dispatcher = Store.dispatcher;
const store = Store.store;

const styles = (theme) => ({
  root: {
    display: "flex",
    width: "100%",
  },
  indexerContainer: {
    width: "80px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "20px",
  },

  indexerValue: {
    width: "100%",
    height: "36px",
    backgroundColor: colors.lightGray5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    marginBottom: "8px",
  },

  proposalId: {
    fontWeight: "normal",
    color: colors.white,
  },

  indexerTime: {
    width: "100%",
    height: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  proposalTimeNormal: {
    fontWeight: "normal",
    fontSize: "12px",
    color: colors.white,
  },

  proposalTimeEnded: {
    fontWeight: "normal",
    fontSize: "12px",
    color: colors.greyText,
  },

  titleProperContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    marginRight: "40px",
  },

  proposalTitleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: "12px",
  },
  proposalTitle: {
    fontWeight: "normal",
    textAlign: "left",
    wordWrap: "break-word",
    textTransform: "capitalize",
  },
  proposalAddressContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  proposalAddress: {
    fontWeight: "normal",
    textAlign: "left",
    color: colors.greyText,
  },
  voteRatioContainer: {
    width: "200px",
    display: "flex",
    flexDirection: "column",
  },
  voteValueContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  voteValueLineContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  voteGreenLine: {
    height: "10px",
    backgroundColor: colors.lightGreen2,
  },

  voteRedLine: {
    height: "10px",
    backgroundColor: colors.lightRed,
  },

  voteIndicator: {
    position: "absolute",
    border: "solid 0px transparent",
    borderRight: "solid 1px #BDCBDA",
    height: "20px",
    top: "10px",
    padding: "4px",
  },
  voteIndicatorText: {
    fontSize: "12px",
    fontWeight: "normal",
    color: colors.greyText,
  },
  voteUpIcon: {
    marginRight: "8px",
  },
  voteDownIcon: {
    marginLeft: "8px",
  },
  value: {
    cursor: "pointer",
  },
  heading: {
    flexShrink: 0,
  },
  right: {
    textAlign: "right",
  },
  grey: {
    color: colors.darkGray,
  },
});

class Proposal extends Component {
  constructor() {
    super();

    const now = store.getStore("currentBlock");

    this.state = {
      amount: "",
      amountError: false,
      redeemAmount: "",
      redeemAmountError: false,
      currentBlock: now,
      currentTime: new Date().getTime(),
      title: "",
      loading: true,
    };
  }

  componentDidMount() {
    emitter.on(VOTE_FOR_RETURNED, this.voteForReturned);
    emitter.on(VOTE_AGAINST_RETURNED, this.voteAgainstReturned);
    emitter.on(GET_BALANCES_RETURNED, this.balancesUpdated);
    emitter.on(ERROR, this.errorReturned);
    this.getProposalTitle();
  }

  componentWillUnmount() {
    emitter.removeListener(VOTE_FOR_RETURNED, this.voteForReturned);
    emitter.removeListener(VOTE_AGAINST_RETURNED, this.voteAgainstReturned);
    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesUpdated);
    emitter.removeListener(ERROR, this.errorReturned);
  }

  getProposalTitle = async () => {
    const { proposal } = this.props;
    if (!proposal.url || !proposal.url.includes("gov.yflink.io")) {
      this.setState({ title: "Invalid Proposal!" });
      return;
    }
    const subSections = proposal.url.split("/");
    const propDescription = subSections[4];
    const propTitle = propDescription.replace(/-/g, " ");
    this.setState({ title: propTitle });
  };

  balancesUpdated = () => {
    let now = store.getStore("currentBlock");
    this.setState({ currentBlock: now });
  };

  voteForReturned = () => {
    this.setState({ loading: false });
  };

  voteAgainstReturned = (_txHash) => {
    this.setState({ loading: false });
  };

  errorReturned = (_error) => {
    this.setState({ loading: false });
  };

  render() {
    const { classes, proposal } = this.props;
    const { currentBlock, currentTime, title } = this.state;

    const blocksTillEnd = proposal.end - currentBlock;
    const blocksSinceStart = currentBlock - proposal.start;

    const endTime = currentTime + blocksTillEnd * 1000 * 13.8;
    const startTime = currentTime - blocksSinceStart * 1000 * 13.8;

    const proposerAddress =
      proposal && proposal.proposer
        ? proposal.proposer.substring(0, 8) +
          "..." +
          proposal.proposer.substring(
            proposal.proposer.length - 6,
            proposal.proposer.length
          )
        : null;

    let proposalTimeStamp = "Ended";
    if (proposal.end > currentBlock) {
      const periodTime = moment(endTime).subtract(startTime);
      proposalTimeStamp = `${periodTime.format("d")}d 
        ${periodTime.format("hh")}h 
        ${periodTime.format("mm")}m`;
    }

    const proposalVotesFor = proposal.totalForVotes
      ? parseFloat(proposal.totalForVotes) / 10 ** 18
      : 0;
    const proposalVotesAgainst = proposal.totalAgainstVotes
      ? parseFloat(proposal.totalAgainstVotes) / 10 ** 18
      : 0;

    const votesForText = proposalVotesFor.toLocaleString(undefined, {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });
    const votesAgainstText = proposalVotesAgainst.toLocaleString(undefined, {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });
    const votesForPercentage = (
      (proposalVotesFor / (proposalVotesFor + proposalVotesAgainst)) *
      100
    ).toFixed(2);
    const votesAgainstPercentage = (
      (proposalVotesAgainst / (proposalVotesFor + proposalVotesAgainst)) *
      100
    ).toFixed(2);

    return (
      <div className={classes.root}>
        <div className={classes.indexerContainer}>
          <div className={classes.indexerValue}>
            <Typography variant={"h3"} className={classes.proposalId}>
              {proposal.id}
            </Typography>
          </div>
          <div className={classes.indexerTime}>
            <Typography
              variant={"h5"}
              className={
                proposalTimeStamp === "Ended"
                  ? classes.proposalTimeEnded
                  : classes.proposalTimeNormal
              }
            >
              {proposalTimeStamp}
            </Typography>
          </div>
        </div>
        <div className={classes.titleProperContainer}>
          <div className={classes.proposalTitleContainer}>
            <Typography variant={"h4"} className={classes.proposalTitle}>
              {title}
            </Typography>
          </div>
          <div className={classes.proposalAddressContainer}>
            <Typography variant={"h5"} className={classes.proposalAddress}>
              Prosposer {proposerAddress}
            </Typography>
          </div>
        </div>
        <div className={classes.voteRatioContainer}>
          <div className={classes.voteValueContainer}>
            <div className={classes.voteAgreeContainer}>
              <img
                className={classes.voteUpIcon}
                src={require("../../assets/thumbs-up.svg")}
                alt="thumb-up"
              />
              {votesForText}
            </div>
            <div className={classes.voteAgainstContainer}>
              {votesAgainstText}
              <img
                className={classes.voteDownIcon}
                src={require("../../assets/thumbs-down.svg")}
                alt="thumb-down"
              />
            </div>
          </div>
          <div className={classes.voteValueLineContainer}>
            <div
              className={classes.voteGreenLine}
              style={{ width: `${votesForPercentage}%` }}
            />
            <div
              className={classes.voteRedLine}
              style={{ width: `${votesAgainstPercentage}%` }}
            />
            <div
              className={classes.voteIndicator}
              style={{ right: `${votesAgainstPercentage}%` }}
            >
              <Typography className={classes.voteIndicatorText}>
                {votesForPercentage}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    );
  }

  copyAddressToClipboard = (event, address) => {
    event.stopPropagation();
    navigator.clipboard.writeText(address).then(() => {
      this.showAddressCopiedSnack();
    });
  };

  showAddressCopiedSnack = () => {
    this.props.showSnackbar("Address Copied to Clipboard", "Success");
  };

  onVoteFor = () => {
    const { proposal, startLoading } = this.props;

    this.setState({ loading: true });
    startLoading();
    dispatcher.dispatch({ type: VOTE_FOR, content: { proposal: proposal } });
  };

  onVoteAgainst = () => {
    const { proposal, startLoading } = this.props;

    this.setState({ loading: true });
    startLoading();
    dispatcher.dispatch({
      type: VOTE_AGAINST,
      content: { proposal: proposal },
    });
  };
}

export default withNamespaces()(
  withRouter(withStyles(styles, { withTheme: true })(Proposal))
);
