import React, { useState, useEffect } from 'react';
import DatePicker from './components/DatePicker/DatePicker';
import TrendDisplay from './components/TrendDisplay/TrendDisplay';

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [productionDate, setProductionDate] = useState<string>('');
  const [trends, setTrends] = useState<any[]>([]);
  const [message, setMessage] = useState<string>('Select a date to view price trends');
  const url = 'https://test-backend.i.datapred.com/without-auth/flows/1/runs'

  useEffect(() => {
    const fetchProductionDate = async () => {
      try {
        const response = await fetch(url);
        const runs = await response.json();
        setProductionDate(new Date(runs.results[0].production_date).toLocaleDateString());
      } catch (error) {
        console.error(error);
      }
    };
    fetchProductionDate();
  }, []);

  useEffect(() => {
    const fetchPriceTrends = async (formattedDate: string) => {
      setLoading(true);
      try {
        const date = new Date(selectedDate);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}T00:00:00Z`;

        // Case 1: No run available for this date
        const response = await fetch(`${url}?production_date=${formattedDate}`);
        if (!response.ok) {
          setTrends([]);
          setMessage('No run available for this date');
          return;
        }

        const runs = await response.json();

        // Case 2: No complete run available for this date
        if (runs.results.length === 0 || !runs.results[0].complete) {
          setMessage('No complete run available for this date');
          setTrends([]);
          return;
        }

        // Case 3: Complete run available for this date
        const runId = runs.results[0].id;
        const outputsResponse = await fetch(`${url}/${runId}/outputs`);
        const outputs = await outputsResponse.json();
        const outputId = outputs.results[0].id;
        const trendsResponse = await fetch(`${url}/${runId}/outputs/${outputId}/trends`);

        // Case 4: Temporary solution for backend bug : 05/10/2021
        if (!trendsResponse.ok) {
          setTrends([]);
          setMessage('No run available for this date');
          return;
        }

        const trendsData = await trendsResponse.json();
        setTrends(trendsData.results);
        setMessage('');
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate) {
      fetchPriceTrends(selectedDate);
    }
  }, [selectedDate]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <h1>Frontend hiring test</h1>
      <h2>Price Trends Prediction</h2>
      <p><u>Production Date</u>: {productionDate}</p>
      <DatePicker onSelectDate={handleDateSelect} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        message ? (
          <div>{message}</div>
        ) : (
          <TrendDisplay trends={trends} />
        )
      )}
    </div>
  );
};

export default App;