import React, { useState, useEffect } from "react";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

const RemainTime = ({ matchDate }: { matchDate: Date }) => {
  //   const matchDate = new Date('2024-09-05T16:00:00Z'); // Example match date

  const [timeRemaining, setTimeRemaining] = useState(
    calculateTimeRemaining(matchDate)
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(matchDate));
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [matchDate]);

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hours
        </Label>
        <div
          className={cn(
            "w-[48px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none"
          )}
        >
          {timeRemaining.hours}
        </div>
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutes
        </Label>
        <div
          className={cn(
            "w-[48px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none"
          )}
        >
          {timeRemaining.minutes}
        </div>
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="seconds" className="text-xs">
          Seconds
        </Label>
        <div
          className={cn(
            "w-[48px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none"
          )}
        >
          {timeRemaining.seconds}
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate time remaining
const calculateTimeRemaining = (targetDate: Date) => {
  const now = new Date();
  const difference = new Date(targetDate).getTime() - now.getTime();

  let timeRemaining = {
    // days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };

  // If the match date has passed, reset to 0
  if (difference < 0) {
    timeRemaining = {
      //   days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return timeRemaining;
};

export default RemainTime;
