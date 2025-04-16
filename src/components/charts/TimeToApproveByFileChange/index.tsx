import { colors } from '@/src/constants/colors';
import { roundDigit } from '@/src/helpers/number';
import {
  CartesianGrid,
  Legend,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Props = {
  data: {
    repo: string;
    records: { approveTime: number; fileChange: number }[];
  }[];
};

export const TimeToApproveByFileChange = ({ data }: Props) => {
  console.log(data);
  return (
    <ScatterChart
      width={1200}
      height={800}
      margin={{
        top: 20,
        right: 20,
        bottom: 10,
        left: 10,
      }}
    >
      <CartesianGrid />
      <XAxis dataKey="x" type="number" name="Approveまでの時間" unit="時間" />
      <YAxis dataKey="y" type="number" name="変更ファイル数" unit="個" />
      <Tooltip />
      <Legend />
      {data.map((d, i) => (
        <Scatter
          key={i}
          name={d.repo}
          data={d.records
            // 外れ値
            // .filter((r) => r.approveTime < 85)
            // .filter((r) => r.fileChange < 50)
            .map((record) => ({
              x: roundDigit(record.approveTime, 4) * 24,
              y: record.fileChange,
            }))}
          fill={colors[i]}
        />
      ))}
    </ScatterChart>
  );
};
