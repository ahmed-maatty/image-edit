import { useEffect, useRef, useState } from "react";

const CounterItem = ({ end, label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef();
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = end > 500 ? end - 100 : 0;
          const duration = 1500; // total duration in ms
          const stepTime = Math.max(Math.floor(duration / (end - start)), 20);

          let current = start;
          const interval = setInterval(() => {
            current += 1;
            setCount(current);
            if (current >= end) {
              clearInterval(interval);
            }
          }, stepTime);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="counter" ref={ref}>
      <h1>+ {formatNumber(count)}</h1>
      <p>{label}</p>
    </div>
  );
};

function Counters({ data }) {
  if (!data) return null; // or a loading spinner
  return (
    <div className="box counters">
      <CounterItem
        end={data.fonts_no || 800}
        label="Fonts with full-text editing capabilities"
      />
      <CounterItem
        end={data.templates_no || 10000}
        label="Backgrounds and templates to start with it"
      />
      <CounterItem
        end={data.stickers_no || 15000}
        label="Elegant Stickers to add to your edits"
      />
      <CounterItem end={data.languages_no || 30} label="Different languages" />
    </div>
  );
}

export default Counters;
