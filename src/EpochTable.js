import React, { Component } from 'react';
import './App.css';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import moment from 'moment';
import { timeFormat } from './TimeUtils'


class EpochTable extends Component {

  genForZeroes(bottom, numZeroes, numEntries) {
      const interval = 10 ** numZeroes;
      const stripped = bottom - (bottom % interval);
      const ans = [];
      for(let i = 1; i <= (numEntries || 100); i++) {
          const candidate = stripped + interval * i;
          if (candidate % (interval * 10) !== 0) { // prevent dupes w/ next greater magnitude
              ans.push(stripped + interval * i);
          } else if (!numEntries) { // exit for the unbounded examples
              break;
          }
      }
      return ans;
  }

  googleCalendarLink(epochTime) {
      const start = moment.unix(epochTime).toISOString().replace('000', '').replace(/[^0-9ZT]/g, '');
      const end = moment.unix(epochTime + 1).toISOString().replace('000', '').replace(/[^0-9ZT]/g, '');
      return <a style={{textDecoration: 'none'}} href={
          `https://www.google.com/calendar/render?action=TEMPLATE&text=Celebrate+${epochTime}&dates=${start}/${end}&&sf=true&output=xml`
      }>
          <span role="img" aria-label="link">🔗</span>
      </a>
  }

  render() {
      const {currentTime, specials} = this.props;
      const currentTimeEpoch = Math.round(currentTime.valueOf() / 1000);
      const zeroInterestings = [
          this.genForZeroes(currentTimeEpoch, 7),
          this.genForZeroes(currentTimeEpoch, 8),
          this.genForZeroes(currentTimeEpoch, 9, 3),
      ].flat();
      const allInterestings = zeroInterestings.concat(specials || []).sort((a,b) => a - b);
      return (
          <div>
              <ReactTable
                  showPagination={false}
                  pageSize={allInterestings.length}
                  data={allInterestings.map(n => {
                      const momentDatetime = moment.unix(n);
                      return {
                          e: n,
                          iso: timeFormat(momentDatetime),
                          distance: <span onDoubleClick={() => window.location.href=`https://www.epochconverter.com/countdown?q=${n}`}>
                              {Math.round(momentDatetime.diff() / (1000 * 60 * 60 * 24))}</span>,
                          day_of_week: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][momentDatetime.weekday()],
                          calendar_link: this.googleCalendarLink(n)
                  }})}
                  columns={
                      [
                          { Header: 'Epoch', accessor: 'e', minWidth: 120 },
                          { Header: 'UTC', accessor: 'iso', minWidth: 180},
                          { Header: 'Days Until', accessor: 'distance'},
                          { Header: 'Day Of Week', accessor: 'day_of_week', maxWidth: 200},
                          { Header: <img src={'./google_logo.png'} width={20} height={20} alt="Google Calendar"/>,
                              accessor: 'calendar_link', maxWidth: 50, filterable: false, sortable: false}
                      ]
                  }
                  filterable
                  defaultFilterMethod={({ id, value }, row) => // case insensitive
                      row[id] ? ('' + row[id]).toLowerCase().includes(value.toLowerCase()) : true}
              />
          </div>
      );
  }
}

export default EpochTable;