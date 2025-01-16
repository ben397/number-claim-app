import { fetchClaimedNumbers, claimNumber, checkExistingClaim } from './database';
import { generateClientId, showNotification, updateNumbersGrid } from './utils';

const totalNumbers = 6;
let availableNumbers = [];
let takenNumbers = new Set();

async function initializeApp() {
  try {
    createNumbersGrid();
    await updateAvailableNumbers();
    setupEventListeners();
  } catch (error) {
    showNotification('Error initializing app. Please refresh.', 'error');
  }
}

function createNumbersGrid() {
  const numbersGrid = document.getElementById('numbersGrid');
  for (let i = 1; i <= totalNumbers; i++) {
    const numberBox = document.createElement('div');
    numberBox.className = 'number-box available';
    numberBox.textContent = i;
    numbersGrid.appendChild(numberBox);
  }
}

async function updateAvailableNumbers() {
  try {
    const claimedNumbers = await fetchClaimedNumbers();
    availableNumbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);
    takenNumbers = new Set(claimedNumbers.map(row => row.number));
    availableNumbers = availableNumbers.filter(n => !takenNumbers.has(n));
    updateNumbersGrid(availableNumbers, takenNumbers);
  } catch (error) {
    showNotification('Error updating numbers. Please refresh.', 'error');
  }
}

async function handleClaim() {
  const nameInput = document.getElementById('nameInput');
  const claimButton = document.getElementById('claimButton');
  const name = nameInput.value.trim();
  
  if (!name) {
    showNotification('Please enter your name.', 'error');
    return;
  }

  try {
    claimButton.disabled = true;
    const clientId = await generateClientId();
    
    if (!clientId) {
      throw new Error('Could not generate client ID');
    }

    const existingClaim = await checkExistingClaim(clientId);
    if (existingClaim) {
      showNotification('You have already claimed a number.', 'error');
      return;
    }

    if (availableNumbers.length === 0) {
      showNotification('No numbers available to claim.', 'error');
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const selectedNumber = availableNumbers[randomIndex];

    await claimNumber(name, selectedNumber, clientId);
    await updateAvailableNumbers();
    
    showNotification(`Successfully claimed number ${selectedNumber}!`, 'success');
    nameInput.value = '';
  } catch (error) {
    showNotification('Error claiming number. Please try again.', 'error');
  } finally {
    claimButton.disabled = false;
  }
}

function setupEventListeners() {
  const claimButton = document.getElementById('claimButton');
  const nameInput = document.getElementById('nameInput');

  claimButton.addEventListener('click', handleClaim);
  nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleClaim();
    }
  });
}

document.addEventListener('DOMContentLoaded', initializeApp);