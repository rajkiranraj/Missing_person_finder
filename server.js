const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const os = require('os');
const app = express();
app.use(express.static('.'));
app.use(express.json());

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

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
