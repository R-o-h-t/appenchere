import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

interface Props {
  begin: DateTime;
  end: DateTime;
  styles?: any;
}
export const Chrono: React.FC<Props> = ({ begin, end, styles }) => {
  const now = DateTime.now();
  const [timerCount, setTimer] = useState(now.toSeconds());

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount: number) => {
        lastTimerCount <= 1 && clearInterval(interval);
        return lastTimerCount + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (begin > now) {
    const diff = begin.diff(DateTime.fromSeconds(timerCount));
    return (
      <View style={styles.chrono}>
        <Text style={styles.chronoBegin}>
          {diff.toFormat("dd 'd' hh 'h' mm 'm 'ss 's'")}
        </Text>
      </View>
    );
  } else {
    const diff = end.diff(DateTime.fromSeconds(timerCount));
    return (
      <View style={styles.chrono}>
        <Text style={styles.chronoEnd}>
          {diff.toFormat("dd 'd' hh 'h' mm 'm 'ss 's'")}
        </Text>
      </View>
    );
  }
};
