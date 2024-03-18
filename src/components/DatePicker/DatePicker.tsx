import React, { useState } from 'react';

const DatePicker: React.FC<{ onSelectDate: (date: string) => void }> = ({ onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSelectDate(selectedDate);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="date" value={selectedDate} onChange={handleDateChange} />
      <button type="submit">Select Date</button>
    </form>
  );
};

export default DatePicker;