import { StyleSheet, TouchableOpacity, Text, } from 'react-native';

interface Props {
    onPress: () => void
    display: string
}

export function CircularButton(props: Props) {

  return (
    <TouchableOpacity
        style={styles.circularButton}
        onPress={() => props.onPress()}
        activeOpacity={0.8}>
        <Text style={styles.circularButtonText}>{props.display}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  circularButton: {
    backgroundColor: '#6f8584',
    borderRadius: 100,
    minHeight: 70,
    minWidth: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularButtonText: {
    fontSize: 30,
  }
});
