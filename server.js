const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const os = require('os');
const app = express();
app.use(express.static('.'));
app.use(express.json());

app.get('/stats', (req, res) => {
  try {
    const inputData = fs.existsSync('input.txt') ? fs.readFileSync('input.txt', 'utf-8') : '';
    const foundData = fs.existsSync('found.txt') ? fs.readFileSync('found.txt', 'utf-8') : '';
    const statusData = fs.existsSync('status_updates.txt') ? fs.readFileSync('status_updates.txt', 'utf-8') : '';
    
    const totalCases = inputData.trim() ? inputData.trim().split('\n').length : 0;
    const foundCases = foundData.trim() ? foundData.trim().split('\n').length : 0;
    const activeCases = Math.max(0, totalCases - foundCases);
    
    res.json({
      total: totalCases,
      found: foundCases,
      active: activeCases
    });
  } catch (error) {
    console.error('Error reading stats:', error);
    res.json({ total: 0, found: 0, active: 0 });
  }
});

app.post('/report', (req, res) => {
  const p = req.body;
  const line = `${p.name},${p.age},${p.gender},${p.lastSeen},${p.aadhar},${p.phone},${p.address},${p.complainant}\n`;
  fs.appendFileSync('input.txt', line);
  res.sendStatus(200);
});

app.post('/search', (req, res) => {
  fs.writeFileSync('search.txt', req.body.name);
  let binary = os.platform() === 'win32' ? 'app.exe' : './app';
  exec(binary, (err) => {
    if (err) return res.send('Error executing search binary');
    const output = fs.readFileSync('output.txt', 'utf-8');
    res.send(output);
  });
});

app.post('/found', (req, res) => {
  try {
    const data = req.body;
    const line = `${data.personName},${data.currentLocation},${data.finderPhone},${data.additionalInfo},${data.dateFound}\n`;
    fs.appendFileSync('found.txt', line);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error recording found person:', error);
    res.sendStatus(500);
  }
});

app.post('/status', (req, res) => {
  try {
    const data = req.body;
    const line = `${data.personName},${data.newStatus},${data.reason},${data.dateUpdated}\n`;
    fs.appendFileSync('status_updates.txt', line);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error updating status:', error);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
