document.getElementById('reportForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const data = {
    name: document.getElementById('name').value,
    age: document.getElementById('age').value,
    gender: document.getElementById('gender').value,
    lastSeen: document.getElementById('lastSeen').value,
    aadhar: document.getElementById('aadhar').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    complainant: document.getElementById('complainant').value,
  };
  await fetch('/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  alert('Report submitted successfully!');
  this.reset();
});
document.getElementById('searchForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const name = document.getElementById('searchName').value;
  const res = await fetch('/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const resultText = await res.text();
  document.getElementById('searchResult').textContent = resultText;
});
