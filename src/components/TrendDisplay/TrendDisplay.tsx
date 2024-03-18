import React from 'react';
import './TrendDisplay.css';

interface Trend {
  horizon_date: string;
  horizon_name: string;
  trend: number;
}

const TrendDisplay: React.FC<{ trends: Trend[] }> = ({ trends }) => {
  return (
    <div className='trend-display'>
      <table>
        <thead>
          <tr>
            <th>Horizon Date</th>
            <th>Horizon Name</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
        {trends.map((trend, index) => (
          <tr key={index}>
            <td>{new Date(trend.horizon_date).toLocaleDateString()}</td>
            <td>{trend.horizon_name}</td>
            <td className={trend.trend === 1 ? 'increasing' : 'decreasing'}>
              {trend.trend === 1 ? 'Increasing' : 'Decreasing'}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrendDisplay;