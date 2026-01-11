import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect, useRef } from 'react';

const MinuteTemperatureChart = ({ tempValue }) => {
  const [minuteData, setMinuteData] = useState(() => {
    // Khôi phục dữ liệu từ localStorage khi load
    const saved = localStorage.getItem('minuteChartData');
    return saved ? JSON.parse(saved) : [];
  });
  const dataRef = useRef(minuteData);
  const lastUpdateTimeRef = useRef(0);

  useEffect(() => {
    if (tempValue === '--') return;
    
    const tempNum = parseFloat(tempValue);
    if (isNaN(tempNum) || tempNum <= 0) return;
    
    const now = Date.now();
    
    // Chỉ cập nhật mỗi 10 giây
    if (now - lastUpdateTimeRef.current < 10000) return;
    
    lastUpdateTimeRef.current = now;
    
    const nowDate = new Date();
    const timeLabel = String(nowDate.getHours()).padStart(2, '0') + ':' + 
                      String(nowDate.getMinutes()).padStart(2, '0') + ':' +
                      String(nowDate.getSeconds()).padStart(2, '0');
    
    let currentData = [...dataRef.current];
    
    // Luôn thêm điểm mới (không kiểm tra trùng)
    currentData.push({ minute: timeLabel, temp: tempNum });
    
    // Giữ tối đa 60 điểm (10 phút với interval 10s)
    if (currentData.length > 60) {
      currentData = currentData.slice(-60);
    }
    
    dataRef.current = currentData;
    setMinuteData(currentData);
    
    // Lưu vào localStorage
    localStorage.setItem('minuteChartData', JSON.stringify(currentData));
  }, [tempValue]);

  return (
    <div className="chart-container">
      <h3>Biến động nhiệt độ (cập nhật mỗi 10 giây)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={minuteData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="minute" 
            angle={-45}
            textAnchor="end"
            height={80}
            interval={Math.max(0, Math.floor(minuteData.length / 12))}
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

export default MinuteTemperatureChart;
