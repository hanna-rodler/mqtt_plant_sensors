import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import '../App.css';

const HistoryChart = ({ title, dataKey, endpointKey, deviceId }) => {
  const [range, setRange] = useState('today'); // 'today' | 'thisWeek' | 'lastWeek'
  const [historyData, setHistoryData] = useState([]);
  const [showDataPoints, setShowDataPoints] = useState([]);
  let endpoint = "";

  if (endpointKey === "scores"){
    endpoint = "plants";
  } else {
    endpoint = "sensors";
  }

  useEffect(() => {
    async function fetchHistoryData() {
      try {
        const url = `${process.env.REACT_APP_API_BASE_URL}/${endpoint}/${endpointKey}/${deviceId}/${range.toLowerCase()}`;
        console.log('Fetching data from:', url);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Fetch failed for ${endpointKey}`);
        const data = await response.json();
        console.log('Fetched data:', data);
        // check if all data avgs are null
        const allNull = data.every((item) => item.avg === null);
        // count how many items are not null
        const validCount = data.filter((item) => item.avg !== null).length;
        
        if(validCount > 2) {
            setShowDataPoints(false);
        } else {
            setShowDataPoints(true);
        }
        if(allNull) {
            setHistoryData([]);
        } else {
            setHistoryData(data);
        }
      } catch (error) {
        console.error('Error fetching history data:', error);
        setHistoryData([]);
      }
    }

    fetchHistoryData();
  }, [dataKey, range]);

  return (
    <div className="history-chart-container">
      <div className="history-chart-header">
        <h3 className="history-chart-title">{title}</h3>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="history-chart-select"
        >
          <option value="today">Today</option>
          <option value="thisWeek">This Week</option>
          <option value="lastWeek">Last Week</option>
        </select>
      </div>

      {historyData.length >= 1 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historyData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => {
                const date = new Date(value);
                console.log("Date:", date);
                return range === 'today'
                  ? date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
                  : `${date.getDate()}.${date.getMonth() + 1}`
              }}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(value) => {
                const date = new Date(value);
                return range === 'today'
                  ? date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
                  : `${date.getDate()}.${date.getMonth() + 1}`;
              }}
            />
            <Line
              type="monotone"
              dataKey={range === 'today' ? dataKey : 'avg'}
              stroke="#912038"
              strokeWidth={2}
              dot={showDataPoints}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>No data to display</p>
      )}
    </div>
  );
};

export default HistoryChart;
