const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Simple kill switch
let globalKillSwitch = false;

app.get('/', (req, res) => {
  res.send('🚀 Kill Switch Server is running');
});

// Kill switch status route (used by your app)
app.get('/api/kill-switch-status', (req, res) => {
  if (globalKillSwitch) {
    return res.json({ status: 'global_disabled' });
  }
  res.json({ status: 'enabled' });
});

// Admin route to toggle kill switch
app.post('/admin/kill-switch', (req, res) => {
  const key = req.headers['x-admin-key'];
  if (key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  globalKillSwitch = !!req.body.value;
  res.json({ message: `Global kill switch set to ${globalKillSwitch}` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
