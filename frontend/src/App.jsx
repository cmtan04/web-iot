import { useEffect } from "react";
import { useState } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:3001");
const App = () => {
  const [temp, setTemp] = useState("--")
  const [humi, setHumi] = useState("--")
  const [gas, setGas] = useState("--")
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Lắng nghe kết nối
    const onConnect = () => setStatus("Đã kết nối");
    const onDisconnect = () => setStatus("Đang kết nối ...");

    // Lắng nghe dữ liệu
    const onMqttData = (data) => {
      const { topic, value } = data;
      if (topic === 'sensor/temp') setTemp(value);
      else if (topic === 'sensor/humi') setHumi(value);
      else if (topic === 'sensor/gas') setGas(value);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('mqttData', onMqttData);

    // HÀM CLEANUP:
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('mqttData', onMqttData);
    };
  }, []);

  const publishMessage = (topic, message) => {
    socket.emit('publish', { topic, message });
  };

  return (
    <div className="container">
      <h1>MQTT Smart Home Dashboard</h1>
      <p>
        Trạng thái:
        <span className={status === "Đã kết nối" ? "status-connected" : "status-connecting"}>
          {status}
        </span>
      </p>

      <div className="card">
        <h3>Cảm biến</h3>
        <p>Nhiệt độ: <span className="sensor-val">{temp}</span> °C</p>
        <p>Độ ẩm: <span className="sensor-val">{humi}</span> %</p>
        <p>Gas: <span className="sensor-val">{gas}</span></p>
      </div>

      <div className="card">
        <h3>Điều khiển Đèn</h3>
        <button className="btn-on" onClick={() => publishMessage('device/led', 'ON')}>BẬT</button>
        <button className="btn-off" onClick={() => publishMessage('device/led', 'OFF')}>TẮT</button>
      </div>

      <div className="card">
        <h3>Điều khiển Quạt</h3>
        <button className="btn-on" onClick={() => publishMessage('device/fan', 'ON')}>BẬT</button>
        <button className="btn-off" onClick={() => publishMessage('device/fan', 'OFF')}>TẮT</button>
      </div>
    </div>
  );
};

export default App;