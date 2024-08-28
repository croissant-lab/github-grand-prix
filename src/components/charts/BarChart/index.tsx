import {
  Bar,
  CartesianGrid,
  Legend,
  BarChart as LibBarChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Props = {
  data: {
    name: string;
    count: number;
  }[];
};

export const BarChart = ({ data }: Props) => {
  if (!data.length) {
    return null;
  }

  const all = false;
  const yAxisUnit = '';

  const customData = all
    ? data.filter((_) => true)
    : data.filter(({ name }, i) => i < 4 && name !== 'yn1323');

  return (
    <LibBarChart
      width={all ? 1600 : 600}
      height={400}
      data={customData}
      barSize={60}
      style={{
        marginTop: 100,
        marginLeft: 100,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="name"
        style={{
          fontSize: '0.8rem',
        }}
      />
      <YAxis unit={yAxisUnit} fontSize={10} />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" label="PR数" fill="#8884d8" />
    </LibBarChart>
  );
};
