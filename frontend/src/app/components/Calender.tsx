"use client";

import { useMemo, useState } from "react";
// import styles from "./Calendar.module.sass";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function Calendar() {
  const [selectedData, setSelectedData] = useState(new Date());
  const [month, setMonth] = useState(new Date());

  const weeks = useMemo(() => {
    const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const firstDay = firstOfMonth.getDay();
    const lastDate = lastOfMonth.getDate();

    let runningDay = 1;

    const weeks = new Array(6).fill(0).map(() => new Array(7).fill(0));

    const firstWeek = weeks[0];
    for (let i = firstDay; i < 7; i++) {
      firstWeek[i] = runningDay++;
    }

    for (let i = 1; i < 5; i++) {
      for (let j = 0; j < 7 && runningDay <= lastDate; j++) {
        weeks[i][j] = runningDay++;
      }
    }

    if (runningDay <= lastDate) {
      for (let j = 0; j < 7 && runningDay <= lastDate; j++) {
        weeks[5][j] = runningDay++;
      }
    }

    return weeks;
  }, [month]);

  const isCurrentMonthDisplayed = useMemo(() => {
    const today = new Date();

    return (
      month.getMonth() === today.getMonth() &&
      month.getFullYear() === today.getFullYear()
    );
  }, [month]);

  const onNext = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));
  };
  const onPrev = () => {
    const today = new Date();
    if (
      today.getFullYear() < month.getFullYear() ||
      today.getMonth() < month.getMonth()
    )
      setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  };

  const todayDay = new Date().getDate();

  const isSelectedMonth =
    month.getMonth() === selectedData.getMonth() &&
    month.getFullYear() === selectedData.getFullYear();

  return (
    <div className="calendar">
      <div className="cal-header">
        <h4>
          {months[month.getMonth()]} {month.getFullYear()}
          <input
            name="date"
            type="text"
            readOnly
            hidden
            value={selectedData.toLocaleString()}
          />
        </h4>
        <div>
          <button type="button" onClick={onPrev}>
            <svg
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.65685 1.00001L1 6.65686L6.65685 12.3137"
                stroke="#333333"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button type="button" onClick={onNext}>
            <svg
              width="9"
              height="14"
              viewBox="0 0 9 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.9701 1.00001L7.62695 6.65686L1.9701 12.3137"
                stroke="#333333"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <div>
        <div className="day_labels">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
        {weeks.map((week, i) => (
          <div className="week" key={i}>
            {week.map((val, i) =>
              val ? (
                isCurrentMonthDisplayed && val < todayDay ? (
                  <span className="day disabled" key={i}>
                    {val}
                  </span>
                ) : (
                  <button
                    type="button"
                    className={`day ${
                      isSelectedMonth && selectedData.getDate() === val
                        ? "selected"
                        : ""
                    }`}
                    key={i}
                    onClick={() => {
                      const newDate = new Date(month);
                      newDate.setDate(val);
                      setSelectedData(newDate);
                    }}
                  >
                    {val}
                  </button>
                )
              ) : (
                <span className="day" key={i} />
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
