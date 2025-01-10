import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.css";
import HabitAnalytics from "./components/HabitAnalytics";

// Icons for habit (you can replace these with your own icons)
const icons = [
  "🏋️",
  "🏃",
  "📚",
  "🍎",
  "💤",
  "🧘",
  "💧",
  "🍽️",
  "📝",
  "🎨",
  "💰",
  "🏥",
  "🍏",
  "👥",
];

function App() {
  const [habits, setHabits] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [showAddHabitModal, setShowAddHabitModal] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    streakGoal: "none",
    category: "fitness",
    completionsPerDay: 1,
    icon: "🏋️",
    color: "#6366f1",
  });

  useEffect(() => {
    const storedHabits = JSON.parse(localStorage.getItem("habits"));
    if (storedHabits) {
      setHabits(storedHabits);
    }
  }, []);

  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem("habits", JSON.stringify(habits));
    }
  }, [habits]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleAddHabit = () => {
    if (newHabit.name.trim()) {
      const habit = {
        id: Date.now(),
        ...newHabit,
        completed: Array(365).fill(false),
      };
      setHabits([...habits, habit]);
      setShowAddHabitModal(false);
      setNewHabit({
        name: "",
        description: "",
        streakGoal: "none",
        category: "fitness",
        completionsPerDay: 1,
        icon: "🏋️",
        color: "#6366f1",
      });
    }
  };

  const toggleDay = (habitId, dayIndex) => {
    setHabits(
      habits.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              completed: habit.completed.map((val, i) =>
                i === dayIndex ? !val : val
              ),
            }
          : habit
      )
    );
  };

  const deleteHabit = (habitId) => {
    setHabits(habits.filter((habit) => habit.id !== habitId));
  };

  const clearCompletedDays = (habitId) => {
    setHabits(
      habits.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              completed: Array(365).fill(false),
            }
          : habit
      )
    );
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(habits);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setHabits(items);
  };

  const getCurrentDayIndex = () => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Habit Tracker</h1>
        <button onClick={() => setShowAnalyticsModal(true)}>
          Analytics
        </button>
        <button onClick={toggleDarkMode} className="dark-mode-toggle">
          <svg
            className="fill-violet-700"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
          >
            <path
              className="sun"
              style={{ display: isDarkMode ? "none" : "block" }}
              d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
            ></path>
            <path
              className="moon"
              style={{ display: isDarkMode ? "block" : "none" }}
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>

      <button
        onClick={() => setShowAddHabitModal(true)}
        className="add-habit-button"
      >
        + Add Habit
      </button>

      {showAddHabitModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Add New Habit</h2>

            {/* Habit Name */}
            <label htmlFor="habit-name">Habit Name</label>
            <input
              id="habit-name"
              type="text"
              placeholder="Enter habit name"
              value={newHabit.name}
              onChange={(e) =>
                setNewHabit({ ...newHabit, name: e.target.value })
              }
            />

            {/* Description */}
            <label htmlFor="habit-description">Description</label>
            <textarea
              id="habit-description"
              placeholder="Enter habit description"
              value={newHabit.description}
              onChange={(e) =>
                setNewHabit({ ...newHabit, description: e.target.value })
              }
            />

            {/* Streak Goal */}
            <label htmlFor="streak-goal">Streak Goal</label>
            <select
              id="streak-goal"
              value={newHabit.streakGoal}
              onChange={(e) =>
                setNewHabit({ ...newHabit, streakGoal: e.target.value })
              }
            >
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>

            {/* Category */}
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={newHabit.category}
              onChange={(e) =>
                setNewHabit({ ...newHabit, category: e.target.value })
              }
            >
              <option value="fitness">Fitness</option>
              <option value="health">Health</option>
              <option value="nutrition">Nutrition</option>
              <option value="art">Art</option>
              <option value="finances">Finances</option>
              <option value="social">Social</option>
            </select>

            {/* Completions Per Day */}
            <label htmlFor="completions-per-day">Completions Per Day</label>
            <input
              id="completions-per-day"
              type="number"
              placeholder="Enter completions per day"
              value={newHabit.completionsPerDay}
              onChange={(e) =>
                setNewHabit({ ...newHabit, completionsPerDay: e.target.value })
              }
            />

            {/* Icon Picker */}
            <label>Icon</label>
            <div className="icon-picker">
              {icons.map((icon) => (
                <button
                  key={icon}
                  className={`icon-option ${
                    newHabit.icon === icon ? "selected" : ""
                  }`}
                  onClick={() => setNewHabit({ ...newHabit, icon })}
                >
                  {icon}
                </button>
              ))}
            </div>

            {/* Color Picker */}
            <label>Color</label>
            <div className="color-picker-options">
              {["#6366f1", "#10b981", "#ef4444", "#f59e0b", "#3b82f6"].map(
                (color) => (
                  <button
                    key={color}
                    className="color-option"
                    style={{ backgroundColor: color }}
                    onClick={() => setNewHabit({ ...newHabit, color })}
                  ></button>
                )
              )}
            </div>

            {/* Save and Cancel Buttons */}
            <div className="modal-actions">
              <button onClick={handleAddHabit}>Save</button>
              <button onClick={() => setShowAddHabitModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showAnalyticsModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Habit Analytics</h2>
            <label htmlFor="habit-select">Select Habit</label>
            <select
              id="habit-select"
              value={selectedHabit ? selectedHabit.id : ""}
              onChange={(e) => {
                const habitId = Number(e.target.value);
                setSelectedHabit(habits.find((h) => h.id === habitId));
              }}
            >
              <option value="">Select a habit</option>
              {habits.map((habit) => (
                <option key={habit.id} value={habit.id}>
                  {habit.name}
                </option>
              ))}
            </select>
            {selectedHabit && <HabitAnalytics habit={selectedHabit} />}
            <div className="modal-actions">
              <button onClick={() => setShowAnalyticsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="habits">
          {(provided) => (
            <div
              className="habits-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {habits.map((habit, index) => (
                <Draggable
                  key={habit.id}
                  draggableId={habit.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className="habit"
                      style={{ borderColor: habit.color }}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <div className="habit-header">
                        <h2>
                          {habit.icon} {habit.name}
                        </h2>
                        <div className="habit-actions">
                          <button
                            onClick={() => toggleDay(habit.id, getCurrentDayIndex())}
                            className="complete-button"
                          >
                            ✅
                          </button>
                          <button
                            onClick={() => deleteHabit(habit.id)}
                            className="delete-button"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <p>{habit.description}</p>
                      <div className="grid">
                        {habit.completed.map((completed, dayIndex) => {
                          const isToday = dayIndex === getCurrentDayIndex();
                          return (
                            <div
                              key={dayIndex}
                              className={`day ${completed ? "completed" : ""} ${
                                isToday ? "current-day" : ""
                              }`}
                              onClick={() => toggleDay(habit.id, dayIndex)}
                              style={{
                                backgroundColor: completed
                                  ? habit.color
                                  : isDarkMode
                                  ? "#6b7280"
                                  : "#e2e8f0",
                              }}
                            />
                          );
                        })}
                      </div>
                      <button
                        onClick={() => clearCompletedDays(habit.id)}
                        className="clear-button"
                      >
                        Clear Completed Days
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;
