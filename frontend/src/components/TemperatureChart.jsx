import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect, useRef } from 'react';

const TemperatureChart = ({ tempValue }) => {
  // Khởi tạo 24 giờ với null - chỉ chạy một lần, khôi phục từ localStorage nếu có
  const [hourlyData, setHourlyData] = useState(() => {
    const saved = localStorage.getItem('hourlyChartData');
    if (saved) {
      return JSON.parse(saved);
    }
    const hours = [];
    for (let i = 0; i < 24; i++) {
      const hour = String(i).padStart(2, '0') + ':00';
      hours.push({ hour, temp: null });
    }
    return hours;
  });
  
  const lastValueRef = useRef(null);

  useEffect(() => {
    if (tempValue === '--') return;
    
    const tempNum = parseFloat(tempValue);
    if (isNaN(tempNum) || tempNum <= 0) return;
    
    // Chỉ update nếu giá trị thay đổi
    if (tempNum === lastValueRef.current) return;
    
    lastValueRef.current = tempNum;
    const currentHour = new Date().getHours();
    const hourString = String(currentHour).padStart(2, '0') + ':00';
    
    setHourlyData(prevData => {
      const newData = [...prevData];
      const hourIndex = currentHour;
      
      if (newData[hourIndex].temp !== tempNum) {
        newData[hourIndex].temp = tempNum;
        // Lưu vào localStorage
        localStorage.setItem('hourlyChartData', JSON.stringify(newData));
        return newData;
      }
      
      return prevData;
    });
  }, [tempValue]);

  return (
    <div className="chart-container">
      <h3>Biến động nhiệt độ trong ngày</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={hourlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="hour" 
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            label={{ value: 'Nhiệt độ (°C)', angle: -90, position: 'insideLeft' }}
            domain={[10, 30]}
            ticks={[10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]}
          />
          <Tooltip 
            formatter={(value) => value !== null ? `${value}°C` : 'Không có dữ liệu'}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="temp" 
            stroke="#ff7300" 
            dot={false}
            name="Nhiệt độ"
            strokeWidth={2}
            connectNulls={true}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;
