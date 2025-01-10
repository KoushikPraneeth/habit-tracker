import React from 'react';

function HabitAnalytics({ habit }) {
  const completedDays = habit.completed.filter(Boolean).length;
  const maxDays = habit.completed.length;
  const percentage = (completedDays / maxDays) * 100;

  return (
    <div className="habit-analytics">
      <h3>{habit.name} Analytics</h3>
      <p>Completed Days: {completedDays}</p>
      <div className="bar-chart">
        <div
          className="bar"
          style={{ width: `${percentage}%`, backgroundColor: habit.color }}
        ></div>
      </div>
    </div>
  );
}

export default HabitAnalytics;