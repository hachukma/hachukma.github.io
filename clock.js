const unicodeNumbers = {
  0: '\uE000',
  1: '\uE001',
  2: '\uE002',
  3: '\uE003',
  4: '\uE004',
  5: '\uE005',
  6: '\uE006',
  7: '\uE007',
  8: '\uE008',
  9: '\uE009',
};

const amPmIndicators = {
  am: 'AM',
  pm: 'PM'
};

function numberToUnicode(number) {
  if (number < 10) {
    return unicodeNumbers[number];
  }

  const tens = Math.floor(number / 10);
  const units = number % 10;

  return unicodeNumbers[tens] + unicodeNumbers[units];
}

function formatTimeWithUnicode(time) {
  return time < 10 ? unicodeNumbers[0] + unicodeNumbers[time] : numberToUnicode(time);
}

function formatMsWithUnicode(ms) {
  const hundreds = Math.floor(ms / 100);
  const tens = Math.floor((ms % 100) / 10);
  const units = ms % 10;
  return unicodeNumbers[hundreds] + unicodeNumbers[tens] + unicodeNumbers[units];
}

function updateClock() {
  // Get current time in Kolkata, India (Tripura timezone)
  const now = new Date();
  const options = { 
    timeZone: 'Asia/Kolkata', 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  
  // Use formatter to get the localized time parts
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(now);
  
  let hours24, minutes, seconds;
  parts.forEach(part => {
    if (part.type === 'hour') hours24 = parseInt(part.value);
    if (part.type === 'minute') minutes = parseInt(part.value);
    if (part.type === 'second') seconds = parseInt(part.value);
  });

  const milliseconds = now.getMilliseconds();

  // Convert to 12-hour format
  const isPm = hours24 >= 12;
  const hours12 = hours24 % 12 || 12;

  const unicodeHours = formatTimeWithUnicode(hours12);
  const unicodeMinutes = formatTimeWithUnicode(minutes);
  const unicodeSeconds = formatTimeWithUnicode(seconds);
  const unicodeMs = formatMsWithUnicode(milliseconds);
  const amPmUnicode = isPm ? amPmIndicators.pm : amPmIndicators.am;

  const hourEl = document.querySelector('.clock-hour');
  const minuteEl = document.querySelector('.clock-minute');
  const secondEl = document.querySelector('.clock-second');
  const msEl = document.querySelector('.clock-ms');
  const ampmEl = document.querySelector('.clock-ampm');

  if (hourEl) hourEl.textContent = unicodeHours;
  if (minuteEl) minuteEl.textContent = unicodeMinutes;
  if (secondEl) secondEl.textContent = unicodeSeconds;
  if (msEl) msEl.textContent = unicodeMs;
  if (ampmEl) ampmEl.textContent = amPmUnicode;
}

function initClock() {
  updateClock();
  // Update every 40ms for smooth millisecond display (approx 25fps)
  setInterval(updateClock, 40);
  console.log('hachukma Unicode Clock initialized with milliseconds');
}

document.addEventListener('DOMContentLoaded', initClock);
