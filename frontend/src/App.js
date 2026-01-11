import React, { useState } from 'react';
import './App.css';
import LightBulb from './components/LightBulb';

function App() {
	const [isOn, setIsOn] = useState(false);

	return (
		<div className="app">
			<header className="site-header">
				<h1>SMART HOME</h1>
			</header>

			<div className="card">
				<h2>Nhấn vào bóng để bật / tắt</h2>

				<LightBulb initialOn={isOn} onToggle={setIsOn} />

				{/* hiển thị trạng thái tổng quan */}
				<p style={{ marginTop: 8, color: '#6b8f6b' }}>
					Trạng thái: <strong style={{ color: isOn ? '#2e7d32' : '#666' }}>{isOn ? 'Đang bật' : 'Đang tắt'}</strong>
				</p>
			</div>
		</div>
	);
}

export default App;