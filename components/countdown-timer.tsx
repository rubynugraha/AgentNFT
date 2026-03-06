'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  endTime: number; // Unix timestamp in seconds
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ endTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      const difference = endTime - now;

      if (difference <= 0) {
        setIsComplete(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (24 * 60 * 60)),
        hours: Math.floor((difference / (60 * 60)) % 24),
        minutes: Math.floor((difference / 60) % 60),
        seconds: difference % 60,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (isComplete) {
    return (
      <div className="countdown-timer">
        <span className="text-destructive">Whitelist period ended</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4 md:gap-6">
      <div className="flex flex-col items-center animate-bounce" style={{ animationDelay: '0s' }}>
        <span className="countdown-timer text-2xl md:text-4xl animate-pulse">
          {String(timeLeft.days).padStart(2, '0')}
        </span>
        <span className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest mt-2">Days</span>
      </div>
      <div className="flex flex-col items-center animate-bounce" style={{ animationDelay: '0.1s' }}>
        <span className="countdown-timer text-2xl md:text-4xl animate-pulse">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest mt-2">Hours</span>
      </div>
      <div className="flex flex-col items-center animate-bounce" style={{ animationDelay: '0.2s' }}>
        <span className="countdown-timer text-2xl md:text-4xl animate-pulse">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest mt-2">Minutes</span>
      </div>
      <div className="flex flex-col items-center animate-bounce" style={{ animationDelay: '0.3s' }}>
        <span className="countdown-timer text-2xl md:text-4xl animate-pulse">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest mt-2">Seconds</span>
      </div>
    </div>
  );
}
