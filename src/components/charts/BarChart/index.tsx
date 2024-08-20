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

  const customData = data.filter(({ name }, i) => i < 3 && name !== 'yn1323');

  return (
    <LibBarChart width={600} height={400} data={customData} barSize={60}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="name"
        interval={0}
        style={{
          fontSize: '0.8rem',
        }}
      />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#8884d8" />
    </LibBarChart>
  );
};
