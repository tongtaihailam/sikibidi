// pages/api/hello.js

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name } = req.body;
    res.status(200).json({ message: `Xin chào, ${name}!` });
  } else {
    res.status(405).json({ message: 'Method không hỗ trợ' });
  }
}
