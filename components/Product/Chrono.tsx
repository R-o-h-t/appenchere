import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

interface Props {
  begin: DateTime;
  end: DateTime;
  styles?: any;
  format?: string;
}
export const Chrono: React.FC<Props> = ({ begin, end, styles, format }) => {
  if (!format) format = "dd 'd' hh 'h' mm 'm 'ss 's'";
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

  const diff =
    begin > now
      ? end.diff(DateTime.fromSeconds(timerCount))
      : begin.diff(DateTime.fromSeconds(timerCount));
  if (now > end) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Terminée</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{diff.toFormat(format)}</Text>
    </View>
  );
};
