const bot = './assets/bot.svg';
const user = './assets/user.svg';
/*import bot from '../assets/bot.svg';
import user from '../assets/user.svg'; */

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
  element.textContent = '';
  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);  
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;  
}

function chatStripe(isAi, value, uniqueId) {
  return `
    <div class="wrapper ${isAi ? 'ai' : ''}">
      <div class="chat">
        <div class="profile">
          <img 
            src="${isAi ? bot : user}" 
            alt="${isAi ? 'bot' : 'user'}" 
          />
        </div>
        <div class="message" id="${uniqueId}">${value}</div>
      </div>
    </div>
  `;
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  const prompt = data.get('prompt');
chatContainer.innerHTML += chatStripe(false, prompt);
form.reset();

 /* chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();*/

  
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, ' ', uniqueId);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  try {
  const response = await fetch('http://localhost:5000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: prompt  // or just { prompt }
    })
  });  
    

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';

    if (response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim();  
      typeText(messageDiv, parsedData);
    } else {
      const err = await response.text();
      messageDiv.innerHTML = "Something went wrong";
      alert(err);
    }
  } catch (err) {
    clearInterval(loadInterval);
    messageDiv.innerHTML = 'Server Error';
    alert(err.message);
  }
};

form.addEventListener('submit', handleSubmit);
form.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSubmit(e);
  }
});

/*form.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {  
    handleSubmit(e);
  }
});*/
