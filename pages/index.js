// pages/index.js

import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/hello', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    const data = await res.json();
    setResponse(data.message);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Chào mừng đến với Website có API!</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nhập tên bạn"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Gửi</button>
      </form>
      <p>{response}</p>
    </div>
  );
}
