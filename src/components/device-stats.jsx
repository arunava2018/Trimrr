/* eslint-disable react/prop-types */
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LabelList } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function DeviceStats({ stats }) {
  const deviceCount = stats.reduce((acc, item) => {
    if (!acc[item.device]) {
      acc[item.device] = 0;
    }
    acc[item.device]++;
    return acc;
  }, {});

  const result = Object.keys(deviceCount).map((device) => ({
    device,
    count: deviceCount[device],
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={result}
            cx="50%"
            cy="50%"
            outerRadius="80%"
            dataKey="count"
            isAnimationActive={true}
            nameKey="device"   // ✅ tells Legend & Tooltip to use device name
          >
            {result.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}

            {/* Labels inside */}
            <LabelList
              dataKey="device"
              position="inside"
              formatter={(value, entry) =>
                `${value}: ${((entry.value / stats.length) * 100).toFixed(0)}%`
              }
              style={{ fill: "white", fontSize: "12px", fontWeight: "bold" }}
            />
          </Pie>

          {/* ✅ Legend now shows device names */}
          <Legend
            formatter={(value, entry) => {
              const device = result.find((d) => d.device === value);
              return `${value} (${device?.count})`;
            }}
          />
          <Tooltip
            formatter={(value, name, props) => [
              `${value} clicks`,
              props.payload.device,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
