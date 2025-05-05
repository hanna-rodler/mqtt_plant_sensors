import React, {useState} from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import '../App.css';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

const now = dayjs();

const HistoryChart = ({ title, data, dataKey }) => {
    const [range, setRange] = useState('today'); // 'today' | 'thisWeek' | 'lastWeek'

    const filterData = useMemo(() => {
        return data.filter(entry => {
            const time = dayjs(entry.timestamp);

            if (range === 'today') {
                return time.isSame(now, 'day');
            }
            if (range === 'thisWeek') {
                return time.isSame(now, 'isoWeek');
            }
            if (range === 'lastWeek') {
                return time.isSame(now.subtract(1, 'week'), 'isoWeek');
            }
            return true;
        });
    }, [data, range]);


    const filteredData = filterData;

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

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredData}>
                    <CartesianGrid stroke="#ccc" />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={(value) => {
                            const date = new Date(value);

                            if (range === 'today') {
                                return date.toLocaleTimeString('de-DE', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                });
                            } else {
                                return date.toLocaleString('de-DE', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                });
                            }
                        }}
                    />

                    <YAxis />
                    <Tooltip
                        labelFormatter={(value) => {
                            const date = new Date(value);

                            if (range === 'today') {
                                return date.toLocaleTimeString('de-DE', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                });
                            } else {
                                return date.toLocaleString('de-DE', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                });
                            }
                        }}
                    />


                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        stroke="#93B756"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HistoryChart;
