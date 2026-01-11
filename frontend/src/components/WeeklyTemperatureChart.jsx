import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect, useRef } from 'react';

const WeeklyTemperatureChart = ({ tempValue }) => {
  // Khởi tạo 7 ngày - chỉ chạy một lần, khôi phục từ localStorage nếu có
  const [weeklyData, setWeeklyData] = useState(() => {
    const saved = localStorage.getItem('weeklyChartData');
    if (saved) {
      return JSON.parse(saved);
    }
    const days = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
    return days.map(day => ({
      day,
      avgTemp: null,
      maxTemp: null,
      minTemp: null,
      count: 0,
      tempValues: []
    }));
  });
  
  const lastValueRef = useRef(null);

  useEffect(() => {
    if (tempValue === '--') return;
    
    const temp = parseFloat(tempValue);
    if (isNaN(temp) || temp <= 0) return;
    
    // Chỉ update nếu giá trị thay đổi
    if (temp === lastValueRef.current) return;
    
    lastValueRef.current = temp;
    
    const today = new Date();
    const dayOfWeek = today.getDay();
    const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    setWeeklyData(prevData => {
      const newData = [...prevData];
      const currentDay = newData[dayIndex];
      
      // Giới hạn lưu tối đa 50 giá trị để giảm tính toán
      if (currentDay.tempValues.length >= 50) {
        currentDay.tempValues = currentDay.tempValues.slice(-49);
      }
      currentDay.tempValues.push(temp);
      
      currentDay.count = currentDay.tempValues.length;
      currentDay.avgTemp = Math.round(
        currentDay.tempValues.reduce((a, b) => a + b, 0) / currentDay.tempValues.length
      );
      currentDay.maxTemp = Math.max(...currentDay.tempValues);
      currentDay.minTemp = Math.min(...currentDay.tempValues);
      
      // Lưu vào localStorage
      localStorage.setItem('weeklyChartData', JSON.stringify(newData));
      
      return newData;
    });
  }, [tempValue]);

  return (
    <div className="chart-container">
      <h3>Biến động nhiệt độ theo tuần</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={weeklyData} isAnimationActive={false}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis 
            label={{ value: 'Nhiệt độ (°C)', angle: -90, position: 'insideLeft' }}
            domain={[10, 30]}
            ticks={[10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]}
          />
          <Tooltip 
            formatter={(value) => value > 0 ? `${value}°C` : 'Chưa có dữ liệu'}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
          />
          <Legend />
          <Bar 
            dataKey="maxTemp" 
            fill="#ff4444" 
            name="Nhiệt độ cao nhất"
            isAnimationActive={false}
          />
          <Bar 
            dataKey="avgTemp" 
            fill="#ffaa00" 
            name="Nhiệt độ trung bình"
            isAnimationActive={false}
          />
          <Bar 
            dataKey="minTemp" 
            fill="#4444ff" 
            name="Nhiệt độ thấp nhất"
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyTemperatureChart;
