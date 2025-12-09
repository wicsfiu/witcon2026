import { useState, useEffect } from "react";
import Header from "../components/text/Header";
import Subtitle from "../components/text/Subtitle";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  const targetDate = new Date("March 27, 2026 09:00:00").getTime();

  const calculateTimeLeft = (): TimeLeft => {
    const now = Date.now();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      ),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="grid place-content-center gap-y-10 mx-auto px-4">
      <div className="flex gap-x-2 py-10 justify-center items-start">
        {/* Days */}
        <div className="flex flex-col items-center">
          <Header className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            {String(timeLeft.days).padStart(2, "0")}
          </Header>
          <Subtitle className="text-primary-yellow uppercase text-md mt-2 font-bold">
            DAYS
          </Subtitle>
        </div>

        {/* Separator */}
        <Header className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          :
        </Header>

        {/* Hours */}
        <div className="flex flex-col items-center">
          <Header className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            {String(timeLeft.hours).padStart(2, "0")}
          </Header>
          <Subtitle className="text-primary-yellow uppercase text-md mt-2 font-bold">
            HOURS
          </Subtitle>
        </div>

        {/* Separator */}
        <Header className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          :
        </Header>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <Header className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            {String(timeLeft.minutes).padStart(2, "0")}
          </Header>
          <Subtitle className="text-primary-yellow uppercase text-md mt-2 font-bold">
            MINUTES
          </Subtitle>
        </div>

        {/* Separator */}
        <Header className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          :
        </Header>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <Header className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            {String(timeLeft.seconds).padStart(2, "0")}
          </Header>
          <Subtitle className="text-primary-yellow uppercase text-md mt-2 font-bold">
            SECONDS
          </Subtitle>
        </div>
      </div>
    </section>
  );
}