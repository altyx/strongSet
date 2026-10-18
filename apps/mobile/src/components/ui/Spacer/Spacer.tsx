import {ThemedView} from "@/src/components/themed-view";
import {StyleSheet} from "react-native";

type Props = {
  vertical?: number;
  horizontal?: number;
}
export default function Spacer(props: Props) { return <ThemedView style={{ marginBottom: props.horizontal, marginLeft: props.vertical}} />; }

const styles = StyleSheet.create({
  vertical: {
    height: 10,
  },
  horizontal: {
    marginBottom: 10,
  },
})
