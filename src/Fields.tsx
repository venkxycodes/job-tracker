import { useState } from "react";
import * as Select from "@radix-ui/react-select";
import * as Popover from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

const Chevron = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
    <path
      d="m5 7.5 5 5 5-5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const Calendar = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
    <rect
      x="2.5"
      y="4.5"
      width="15"
      height="13"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M6 2.5v4M14 2.5v4M2.5 8.5h15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
const Check = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
    <path
      d="m4.5 10 3.5 3.5 7.5-8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function ChoiceSelect({
  value,
  onChange,
  options,
  label,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  label: string;
  disabled?: boolean;
}) {
  return (
    <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
      <Select.Trigger
        className="choice-trigger"
        aria-label={label}
        type="button"
      >
        <Select.Value />
        <Select.Icon>
          <Chevron />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className="choice-menu"
          position="popper"
          sideOffset={6}
          collisionPadding={12}
        >
          <Select.Viewport className="choice-viewport">
            {options.map((option) => (
              <Select.Item className="choice-item" key={option} value={option}>
                <Select.ItemText>{option}</Select.ItemText>
                <Select.ItemIndicator className="choice-check">
                  <Check />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

const toLocalDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const displayDate = (value: string) =>
  new Date(`${value}T12:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
const hours = Array.from({ length: 24 }, (_, hour) =>
  String(hour).padStart(2, "0"),
);
const minutes = Array.from({ length: 12 }, (_, minute) =>
  String(minute * 5).padStart(2, "0"),
);

export function DateField({
  value,
  onChange,
  label,
  withTime = false,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  withTime?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date>(
    () => new Date(`${value.slice(0, 10) || toLocalDate(new Date())}T12:00:00`),
  );
  const datePart = value.slice(0, 10);
  const timePart = value.includes("T") ? value.slice(11, 16) : "";
  const minuteOptions =
    timePart && !minutes.includes(timePart.slice(3, 5))
      ? [...minutes, timePart.slice(3, 5)].sort()
      : minutes;
  const selected = datePart ? new Date(`${datePart}T12:00:00`) : undefined;
  const setDate = (day: Date | undefined) => {
    if (!day) return;
    const date = toLocalDate(day);
    onChange(withTime ? `${date}T${timePart || "09:00"}` : date);
    if (!withTime) setOpen(false);
  };
  const setTime = (hoursOrMinutes: string, part: "hour" | "minute") => {
    const [hour = "09", minute = "00"] = timePart.split(":");
    onChange(
      `${datePart || toLocalDate(month)}T${part === "hour" ? hoursOrMinutes : hour}:${part === "minute" ? hoursOrMinutes : minute}`,
    );
  };
  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        if (next && datePart) setMonth(new Date(`${datePart}T12:00:00`));
        setOpen(next);
      }}
    >
      <Popover.Trigger
        type="button"
        className="date-trigger"
        aria-label={label}
      >
        <Calendar />
        <span>
          {datePart
            ? displayDate(datePart)
            : withTime
              ? "Schedule date and time"
              : "Choose a date"}
          {withTime && timePart ? ` · ${timePart}` : ""}
        </span>
        <Chevron />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="date-popover"
          sideOffset={8}
          align="start"
          collisionPadding={12}
        >
          <div className="date-popover-heading">
            <strong>
              {withTime ? "Schedule interview" : "Application date"}
            </strong>
            <span>
              {withTime ? "Pick a day and time" : "Choose when you applied"}
            </span>
          </div>
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={setDate}
            month={month}
            onMonthChange={setMonth}
            showOutsideDays
            fixedWeeks
          />
          {withTime && datePart && (
            <div className="time-picker">
              <span>Time</span>
              <div>
                <ChoiceSelect
                  label="Hour"
                  value={timePart.slice(0, 2) || "09"}
                  onChange={(hour) => setTime(hour, "hour")}
                  options={hours}
                />
                <span className="time-separator">:</span>
                <ChoiceSelect
                  label="Minute"
                  value={timePart.slice(3, 5) || "00"}
                  onChange={(minute) => setTime(minute, "minute")}
                  options={minuteOptions}
                />
              </div>
            </div>
          )}
          <div className="date-popover-actions">
            {withTime && value && (
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
              >
                Clear
              </button>
            )}
            <button
              type="button"
              className="secondary-button"
              onClick={() => setOpen(false)}
            >
              Done
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
