import { useEffect, useState } from 'react';

export function useTimer(initialTime) {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    // Сбрасываем таймер при изменении initialTime
    setTime(initialTime);

    if (!initialTime || initialTime === '00:00:00') return;

    const timer = setInterval(() => {
      setTime(prev => {
        const [hh, mm, ss] = prev.split(':').map(Number);

        let newSS = ss + 1;
        let newMM = mm;
        let newHH = hh;

        if (newSS >= 60) {
          newSS = 0;
          newMM += 1;
        }
        if (newMM >= 60) {
          newMM = 0;
          newHH += 1;
        }
        if (newHH >= 24) {
          newHH = 0;
        }

        return `${String(newHH).padStart(2, '0')}:${String(newMM).padStart(2, '0')}:${String(newSS).padStart(2, '0')}`;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialTime]);

  return time;
}