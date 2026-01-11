import React, { useState } from 'react';
import '../App.css';

export default function LightBulb({ initialOn = false, onToggle }) {
	const [on, setOn] = useState(initialOn);

	const toggle = () => {
		const next = !on;
		setOn(next);
		if (onToggle) onToggle(next);
	};

	const handleKey = (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			toggle();
		}
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<button
				type="button"
				className={`light-bulb ${on ? 'on' : 'off'}`}
				onClick={toggle}
				onKeyDown={handleKey}
				aria-pressed={on}
				aria-label={on ? 'Tắt đèn' : 'Bật đèn'}
				title={on ? 'Tắt đèn' : 'Bật đèn'}
			>
				<svg className="bulb" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
					{on && <circle className="glow" cx="32" cy="24" r="22" />}
					<path className="glass" d="M32 2C20 2 10 12 10 24c0 7 4 13 10 16v6c0 2.2 1.8 4 4 4h12c2.2 0 4-1.8 4-4v-6c6-3 10-9 10-16 0-12-10-22-22-22z" />
					<rect className="base" x="24" y="46" width="16" height="8" rx="2" />
					<circle className="filament" cx="32" cy="24" r="4" />
				</svg>
			</button>
			<div className={`light-status ${on ? 'on' : ''}`}>{on ? 'BẬT' : 'TẮT'}</div>
		</div>
	);
}
