import { GoogleGenerativeAI } from "@google/generative-ai";
import md from "markdown-it";

// Initialize the model
const genAI = new GoogleGenerativeAI(`${import.meta.env.VITE_API_KEY}`);

const model = genAI.getGenerativeModel({
    model: "gemini-pro"
});

let history = [
];

async function getResponse(prompt) {
    const chat = await model.startChat({ history: history });
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    console.log(text);
    return text;
}

export const userDiv = (data) => {
    return `
    <div class="flex items-center gap-2 justify-start">
    <img src="user.jpg" alt="user icon" class="w-10 h-10 rounded-full" />
    <p class="bg-gemDeep text-white p-1 rounded-md shadow-md ">
    ${data}
    </p>
  </div>
    `
}

export const aiDiv = (data) => {
    return `
    <div class="flex gap-2 justify-end">
          <pre class="bg-gemRegular/40 text-gemDeep p-1 rounded-md shadow-md whitespace-pre-wrap">
            ${data}
          </pre>
          <img src="chat-bot.jpg" alt="user icon" class="w-10 h-10 rounded-full" />
        </div>
    `
}

async function handleSubmit(event) {
    event.preventDefault();

    let userMessage = document.getElementById("prompt");
    const chatArea = document.getElementById("chat-container")

    var prompt = userMessage.value.trim();
    if (prompt === "") {
        return;
    }

    chatArea.innerHTML += userDiv(prompt);
    userMessage.value = "";

    const aiResponse = await getResponse(prompt);
    let md_text = md().render(aiResponse);
    chatArea.innerHTML += aiDiv(md_text);

    let newUserRole = {
        role: "user",
        parts: prompt,
    };
    let newAIRole = {
        role: "model",
        parts: aiResponse,
    };

    history.push(newUserRole);
    history.push(newAIRole);

    console.log(history);
}

const chatForm = document.getElementById("chat-form");
chatForm.addEventListener("submit", handleSubmit);

chatForm.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) handleSubmit(event);
});