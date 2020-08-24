import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import {
  Tabs,
  Tab,
  Typography
} from '@material-ui/core';
import { withRouter } from "react-router-dom";
import { colors } from '../../theme'

const styles = theme => ({
  root: {
    verticalAlign: 'top',
    width: '100%',
    display: 'flex',
  },
  stake: {
    flex: '1',
    height: '75px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: colors.pink,
    '&:hover': {
      backgroundColor: "#f9fafb",
      '& .title': {
        color: colors.pink
      },
      '& .titleActive': {
        color: colors.pink,
        borderBottom: '4px solid '+colors.pink,
        padding: '10px 0px'
      },
      '& .icon': {
        color: colors.pink
      }
    },
    '& .title': {
      color: colors.white
    },
    '& .titleActive': {
      color: colors.white,
      borderBottom: '4px solid white',
      padding: '10px 0px'
    },
    '& .icon': {
      color: colors.white
    },
  },
  vote: {
    flex: '1',
    height: '75px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: colors.lightBlue,
    '&:hover': {
      backgroundColor: "#f9fafb",
      '& .title': {
        color: colors.lightBlue,
      },
      '& .titleActive': {
        color: colors.lightBlue,
        borderBottom: '4px solid '+colors.lightBlue,
        padding: '10px 0px'
      },
      '& .icon': {
        color: colors.lightBlue
      }
    },
    '& .title': {
      color: colors.white
    },
    '& .titleActive': {
      color: colors.white,
      borderBottom: '4px solid white',
      padding: '10px 0px'
    },
    '& .icon': {
      color: colors.white
    },
  },
  lock: {
    flex: '1',
    height: '75px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: colors.tomato,
    '&:hover': {
      backgroundColor: "#f9fafb",
      '& .title': {
        color: colors.tomato
      },
      '& .titleActive': {
        color: colors.tomato,
        borderBottom: '4px solid '+colors.tomato,
        padding: '10px 0px'
      },
      '& .icon': {
        color: colors.tomato
      }
    },
    '& .title': {
      color: colors.white
    },
    '& .titleActive': {
      color: colors.white,
      borderBottom: '4px solid white',
      padding: '10px 0px'
    },
    '& .icon': {
      color: colors.white
    }
  },
});

function Header(props) {
  const {
    classes,
    setHeaderValue,
    headerValue,
    location
  } = props;

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setHeaderValue(newValue)
  };

  const nav = (screen) => {
    props.history.push('/'+screen)
  }

  return (
    <div className={ classes.root }>
      <div className={ `${classes.stake}` } onClick={ () => { nav('staking') } }>
        <Typography variant={'h3'} className={ headerValue===0?`titleActive`:`title` }>Stake</Typography>
      </div>
      <div className={ `${classes.vote}` } onClick={ () => { nav('vote') } }>
        <Typography variant={'h3'} className={ headerValue===1?`titleActive`:`title` }>Vote</Typography>
      </div>
      {/*<div className={ `${classes.lock}` } onClick={ () => { nav('lock') } }>
        <Typography variant={'h3'} className={ headerValue===2?`titleActive`:`title` }>Lock</Typography>
      </div>*/}
    </div>
  )
}

export default withRouter(withStyles(styles)(Header));
