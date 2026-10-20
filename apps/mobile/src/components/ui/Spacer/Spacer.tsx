import {ThemedView} from "@/src/components/themed-view";

type Props = {
  vertical?: number;
  horizontal?: number;
}
export default function Spacer(props: Props) { return <ThemedView style={{ marginBottom: props.horizontal, marginLeft: props.vertical}} />; }
