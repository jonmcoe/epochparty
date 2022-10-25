import React, { Component } from "react";
import moment from 'moment';
import EpochTable from "./EpochTable";
import { timeFormat } from './TimeUtils'
import {TextField} from "material-ui";
import Typography from "material-ui/Typography";


class App extends Component {

  state = {
    userSpecified: []
  };

  render() {
    const now = moment.utc();
    const nowEpoch = Math.round(now.valueOf() / 1000);
    return <div>
        <Typography align="center" variant="headline">Loaded at {nowEpoch} ({timeFormat(now)})</Typography>
        <EpochTable currentTime={now} specials={
            [0, 1000000000, 1234567890, 1577777777, 1666666666, 2222222222].concat(this.state.userSpecified)} />
        <Typography variant={'subheading'}>Add your own below:</Typography>
        <TextField onKeyUp={e => {
            if (e.keyCode === 13 && !isNaN(Number(e.target.value))) {
                this.setState({userSpecified: this.state.userSpecified.concat([Number(e.target.value)])});
            }
        }}
        />
        <Typography variant={'body2'} align="right">
            <a href="https://github.com/jonmcoe/epochparty">Source Code</a>
        </Typography>
    </div>;
  }
}

export default App;