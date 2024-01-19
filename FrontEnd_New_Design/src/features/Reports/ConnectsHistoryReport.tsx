import ConnectList from "../Connects/ConnectList";

interface Props {
  loading: (progress: number, value: boolean) => void;
}

export default function ConnectsHistoryReport({ loading }: Props) {
  return <ConnectList loading={loading} heading="Connects History Report" />;
}
