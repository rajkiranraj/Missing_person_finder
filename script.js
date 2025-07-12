// Configuration - Render backend URL
const API_BASE_URL = 'https://missing-person-identifier.onrender.com';

// Load stats on page load
document.addEventListener('DOMContentLoaded', function() {
  loadStats();
  initDarkMode();
});

// Dark Mode Functions
function initDarkMode() {
  const isDark = localStorage.getItem('darkMode') === 'true';
  if (isDark) {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    updateToggleUI(true);
  }
}

function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark');
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', isDark);
  updateToggleUI(isDark);
  
  // Add a subtle pulse effect to the page during transition
  document.body.style.transform = 'scale(0.99)';
  setTimeout(() => {
    document.body.style.transform = 'scale(1)';
  }, 150);
}

function updateToggleUI(isDark) {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const toggleIcon = document.getElementById('toggleIcon');
  
  // Add a subtle scale effect during transition
  toggleSwitch.style.transform = 'scale(0.95)';
  setTimeout(() => {
    toggleSwitch.style.transform = 'scale(1)';
  }, 150);
  
  if (isDark) {
    toggleSwitch.classList.add('active');
    toggleIcon.textContent = '☀️';
    // Add a glow effect when switching to dark mode
    toggleSwitch.style.boxShadow = '0 0 20px rgba(0, 122, 255, 0.6)';
    setTimeout(() => {
      toggleSwitch.style.boxShadow = '';
    }, 600);
  } else {
    toggleSwitch.classList.remove('active');
    toggleIcon.textContent = '🌙';
    // Add a glow effect when switching to light mode
    toggleSwitch.style.boxShadow = '0 0 20px rgba(255, 193, 7, 0.6)';
    setTimeout(() => {
      toggleSwitch.style.boxShadow = '';
    }, 600);
  }
}

async function loadStats() {
  try {
    const res = await fetch(`${API_BASE_URL}/stats`);
    const stats = await res.json();
    document.getElementById('totalCases').textContent = stats.total;
    document.getElementById('foundCases').textContent = stats.found;
    document.getElementById('activeCases').textContent = stats.active;
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

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
    status: document.getElementById('status').value,
    dateMissing: document.getElementById('dateMissing').value,
  };
  
  try {
    await fetch('/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    // Show success message with Apple-style notification
    showNotification(`Report submitted successfully for ${data.name}`, 'success');
    this.reset();
    loadStats(); // Refresh stats
  } catch (error) {
    showNotification('Error submitting report. Please try again.', 'error');
  }
});

function showNotification(message, type) {
  const notification = document.createElement('div');
  const isDark = document.documentElement.classList.contains('dark');
  
  const lightColors = type === 'success' 
    ? 'bg-green-50/90 border border-green-200/50 text-green-800' 
    : 'bg-red-50/90 border border-red-200/50 text-red-800';
    
  const darkColors = type === 'success'
    ? 'bg-green-900/90 border border-green-700/50 text-green-200'
    : 'bg-red-900/90 border border-red-700/50 text-red-200';
  
  notification.className = `fixed top-8 right-8 p-6 rounded-2xl z-50 shadow-2xl backdrop-blur-2xl transition-all duration-500 transform translate-x-full opacity-0 ${isDark ? darkColors : lightColors}`;
  notification.style.minWidth = '320px';
  notification.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="text-2xl">${type === 'success' ? '✅' : '❌'}</div>
      <div class="flex-1">
        <div class="font-semibold text-sm mb-1">${type === 'success' ? 'Success' : 'Error'}</div>
        <div class="text-sm opacity-90">${message}</div>
      </div>
    </div>
  `;
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.classList.remove('translate-x-full', 'opacity-0');
  }, 100);
  
  // Animate out
  setTimeout(() => {
    notification.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => notification.remove(), 500);
  }, 4000);
}

document.getElementById('searchForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const name = document.getElementById('searchName').value;
  const res = await fetch('/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const resultText = await res.text();
  
  // Display formatted results with Apple-style presentation
  const resultDiv = document.getElementById('searchResult');
  if (resultText.includes('Person not found')) {
    resultDiv.innerHTML = `
      <div class="text-center py-12">
        <div class="text-6xl mb-4 opacity-30">❌</div>
        <div class="text-xl font-semibold text-gray-900 mb-2">No Results Found</div>
        <p class="text-secondary">${resultText}</p>
      </div>
    `;
    document.getElementById('foundPersonActions').style.display = 'none';
  } else {
    // Format the search results with Apple-style design
    const formattedResult = formatSearchResult(resultText);
    resultDiv.innerHTML = formattedResult;
    document.getElementById('foundPersonActions').style.display = 'block';
    document.getElementById('foundPersonName').value = name;
  }
  
  // Refresh stats after search
  loadStats();
});

// Format search results for Apple-style display
function formatSearchResult(resultText) {
  const lines = resultText.split('\n');
  let html = '';
  let currentPerson = '';
  
  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('Found')) {
      html += `<div class="text-green-600 font-semibold mb-8 text-center text-xl bg-green-50/80 backdrop-blur-sm p-6 rounded-2xl border border-green-200/50">${line}</div>`;
    } else if (line.includes('----')) {
      if (currentPerson) {
        html += '</div>';
      }
      html += '<div class="apple-card p-6 mb-6">';
      currentPerson = 'started';
    } else if (line.includes(':')) {
      const [label, value] = line.split(':');
      const cleanLabel = label.trim();
      const cleanValue = value.trim();
      
      if (cleanLabel === 'Status') {
        const statusClass = getStatusClass(cleanValue);
        html += `<div class="mb-4 flex items-center justify-between"><span class="font-medium text-gray-700">${cleanLabel}:</span> <span class="status-badge px-3 py-1 ${statusClass}">${getStatusIcon(cleanValue)} ${cleanValue}</span></div>`;
      } else if (cleanLabel === 'Last Seen') {
        html += `<div class="mb-4 flex items-start justify-between"><span class="font-medium text-gray-700">${cleanLabel}:</span> <span class="text-red-600 bg-red-50 px-3 py-1 rounded-lg text-sm font-medium max-w-xs text-right">${cleanValue}</span></div>`;
      } else if (cleanLabel === 'Phone') {
        html += `<div class="mb-4 flex items-center justify-between"><span class="font-medium text-gray-700">${cleanLabel}:</span> <span class="text-blue-600 bg-blue-50 px-3 py-1 rounded-lg text-sm font-medium">${cleanValue}</span></div>`;
      } else if (cleanLabel === 'Name') {
        html += `<div class="mb-6 pb-4 border-b border-gray-100"><span class="text-gray-600 text-sm">${cleanLabel}</span><div class="text-2xl font-bold text-gray-900 mt-1">${cleanValue}</div></div>`;
      } else {
        html += `<div class="mb-4 flex items-start justify-between"><span class="font-medium text-gray-700">${cleanLabel}:</span> <span class="text-gray-900 text-right max-w-xs">${cleanValue}</span></div>`;
      }
    }
  }
  
  if (currentPerson) {
    html += '<div class="mt-6 pt-4 border-t border-gray-100">';
    html += '<button onclick="openStatusModal()" class="apple-btn-primary w-full py-3 text-sm font-semibold">Update Status</button>';
    html += '</div>';
    html += '</div>';
  }
  
  return html;
}

function getStatusClass(status) {
  switch (status) {
    case 'Found': return 'status-found';
    case 'Active': return 'status-active';
    case 'Closed': return 'status-closed';
    default: return 'status-active';
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'Found': return '✅';
    case 'Active': return '🔍';
    case 'Closed': return '❌';
    default: return '🔍';
  }
}

function openStatusModal() {
  document.getElementById('statusModal').classList.remove('hidden');
  document.getElementById('statusModal').classList.add('flex');
}

// Status modal handlers
document.getElementById('cancelStatus').addEventListener('click', function() {
  document.getElementById('statusModal').classList.add('hidden');
  document.getElementById('statusModal').classList.remove('flex');
});

document.getElementById('statusUpdateForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const data = {
    personName: document.getElementById('foundPersonName').value,
    newStatus: document.getElementById('newStatus').value,
    reason: document.getElementById('statusReason').value,
    dateUpdated: new Date().toLocaleString()
  };
  
  try {
    await fetch('/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    showNotification(`Status updated successfully for ${data.personName}`, 'success');
    document.getElementById('statusModal').classList.add('hidden');
    document.getElementById('statusModal').classList.remove('flex');
    this.reset();
    loadStats();
  } catch (error) {
    showNotification('Error updating status. Please try again.', 'error');
  }
});

// Handle "Found This Person" button
document.getElementById('reportFoundBtn').addEventListener('click', function() {
  document.getElementById('foundSection').style.display = 'block';
  document.getElementById('foundSection').scrollIntoView({ behavior: 'smooth' });
});

// Handle cancel found person form
document.getElementById('cancelFound').addEventListener('click', function() {
  document.getElementById('foundSection').style.display = 'none';
  document.getElementById('foundForm').reset();
});

// Handle found person form submission
document.getElementById('foundForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const data = {
    personName: document.getElementById('foundPersonName').value,
    currentLocation: document.getElementById('currentLocation').value,
    finderPhone: document.getElementById('finderPhone').value,
    additionalInfo: document.getElementById('additionalInfo').value,
    dateFound: new Date().toLocaleString()
  };
  
  const res = await fetch('/found', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (res.ok) {
    showNotification('Found person information recorded successfully. The complainant will be contacted.', 'success');
    document.getElementById('foundSection').style.display = 'none';
    this.reset();
  } else {
    showNotification('Error recording found person information. Please try again.', 'error');
  }
});
