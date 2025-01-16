import Fingerprint2 from 'fingerprintjs2';

export async function generateClientId() {
  try {
    const components = await Fingerprint2.getPromise();
    const values = components.map(component => component.value);
    return Fingerprint2.x64hash128(values.join(''), 31);
  } catch (error) {
    console.error('Error generating client ID:', error);
    return null;
  }
}

export function showNotification(message, type, duration = 3000) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type} fade-in`;
  notification.style.display = 'block';

  setTimeout(() => {
    notification.style.display = 'none';
  }, duration);
}

export function updateNumbersGrid(availableNumbers, takenNumbers) {
  const numbersGrid = document.getElementById('numbersGrid');
  const numberBoxes = numbersGrid.getElementsByClassName('number-box');

  for (let i = 0; i < numberBoxes.length; i++) {
    const number = i + 1;
    const box = numberBoxes[i];
    
    if (takenNumbers.has(number)) {
      box.className = 'number-box taken';
    } else {
      box.className = 'number-box available';
    }
  }
}