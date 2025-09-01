/* eslint-disable react/prop-types */
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function DeviceStats({ stats }) {
  const deviceCount = stats.reduce((acc, item) => {
    if (!acc[item.device]) {
      acc[item.device] = 0;
    }
    acc[item.device]++;
    return acc;
  }, {});

  const result = Object.keys(deviceCount).map((device, index) => ({
    device,
    count: deviceCount[device],
    percentage: ((deviceCount[device] / stats.length) * 100).toFixed(1),
    color: COLORS[index % COLORS.length]
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <span className="text-white font-semibold text-sm">{data.device}</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="text-gray-300">{data.count} clicks</div>
            <div className="text-gray-400">{data.percentage}% of total</div>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
      {payload.map((entry, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-3 py-2 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-colors"
        >
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-white text-sm font-medium">
            {entry.value}
          </span>
          <span className="text-gray-400 text-xs">
            ({result.find(d => d.device === entry.value)?.count})
          </span>
        </motion.div>
      ))}
    </div>
  );

  // Simplified label renderer for inside the donut
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6; // Position between inner and outer radius
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only show percentage if it's significant and there are multiple segments
    if (percent < 0.05 || result.length === 1) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize="14px"
        fontWeight="bold"
        style={{ 
          textShadow: "0 2px 4px rgba(0,0,0,0.8)",
          pointerEvents: "none"
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full"
      style={{ height: 400 }}
    >
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-transparent rounded-2xl" />
      
      {/* Title */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h3 className="text-lg font-bold text-white mb-1">Device Distribution</h3>
        <p className="text-gray-400 text-sm">Clicks by device type</p>
      </motion.div>

      <div className="relative" style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={result}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius="75%"
              innerRadius="45%"  // Larger inner radius for center content
              dataKey="count"
              isAnimationActive={true}
              animationDuration={800}
              nameKey="device"
              paddingAngle={result.length > 1 ? 2 : 0}
            >
              {result.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth={2}
                  style={{
                    filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4))'
                  }}
                />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center stats - positioned to not overlap */}
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'auto',
            height: 'auto'
          }}
        >
          <div className="text-center">
            <div className="text-3xl font-black text-white">{stats.length}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Clicks</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
