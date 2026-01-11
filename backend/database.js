import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Khởi tạo database
const db = new Database(join(__dirname, 'sensor_data.db'));

// Tạo bảng nếu chưa tồn tại
db.exec(`
  CREATE TABLE IF NOT EXISTS sensor_readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    temperature REAL,
    humidity REAL,
    gas INTEGER
  )
`);

// Tạo index cho timestamp để query nhanh hơn
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_timestamp ON sensor_readings(timestamp)
`);

// Hàm lưu dữ liệu sensor
export const saveSensorData = (temp, humi, gas) => {
  const stmt = db.prepare(`
    INSERT INTO sensor_readings (temperature, humidity, gas)
    VALUES (?, ?, ?)
  `);
  
  try {
    stmt.run(temp, humi, gas);
  } catch (error) {
    console.error('Error saving sensor data:', error);
  }
};

// Lấy dữ liệu theo khoảng thời gian
export const getSensorData = (hours = 24) => {
  const stmt = db.prepare(`
    SELECT 
      id,
      datetime(timestamp, 'localtime') as timestamp,
      temperature,
      humidity,
      gas
    FROM sensor_readings
    WHERE timestamp >= datetime('now', '-' || ? || ' hours')
    ORDER BY timestamp DESC
    LIMIT 1000
  `);
  
  try {
    return stmt.all(hours);
  } catch (error) {
    console.error('Error getting sensor data:', error);
    return [];
  }
};

// Lấy dữ liệu theo giờ (trung bình mỗi giờ)
export const getHourlyData = (hours = 24) => {
  const stmt = db.prepare(`
    SELECT 
      strftime('%H:00', timestamp, 'localtime') as hour,
      ROUND(AVG(temperature), 1) as avgTemp,
      ROUND(MAX(temperature), 1) as maxTemp,
      ROUND(MIN(temperature), 1) as minTemp,
      COUNT(*) as count
    FROM sensor_readings
    WHERE timestamp >= datetime('now', '-' || ? || ' hours')
    GROUP BY strftime('%H', timestamp)
    ORDER BY timestamp DESC
  `);
  
  try {
    return stmt.all(hours);
  } catch (error) {
    console.error('Error getting hourly data:', error);
    return [];
  }
};

// Lấy dữ liệu theo ngày (7 ngày gần nhất)
export const getDailyData = () => {
  const stmt = db.prepare(`
    SELECT 
      strftime('%Y-%m-%d', timestamp, 'localtime') as date,
      strftime('%w', timestamp, 'localtime') as dayOfWeek,
      ROUND(AVG(temperature), 1) as avgTemp,
      ROUND(MAX(temperature), 1) as maxTemp,
      ROUND(MIN(temperature), 1) as minTemp,
      COUNT(*) as count
    FROM sensor_readings
    WHERE timestamp >= datetime('now', '-7 days')
    GROUP BY strftime('%Y-%m-%d', timestamp)
    ORDER BY date DESC
  `);
  
  try {
    return stmt.all();
  } catch (error) {
    console.error('Error getting daily data:', error);
    return [];
  }
};

// Xóa dữ liệu cũ hơn 30 ngày (chạy định kỳ để giảm kích thước DB)
export const cleanOldData = () => {
  const stmt = db.prepare(`
    DELETE FROM sensor_readings
    WHERE timestamp < datetime('now', '-30 days')
  `);
  
  try {
    const info = stmt.run();
    console.log(`Cleaned ${info.changes} old records`);
  } catch (error) {
    console.error('Error cleaning old data:', error);
  }
};

// Cleanup khi shutdown
process.on('exit', () => db.close());
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});

export default db;
