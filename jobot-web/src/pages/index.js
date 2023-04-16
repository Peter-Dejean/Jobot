import { useState } from 'react'
import Head from 'next/head';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

export default function Home() {
  const [ apiKey, setApiKey ] = useState('');

  const API_URL = "https://api.openai.com/v1/chat/completions";

  const [ userMessage, setUserMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "You are Jobot, a helpful AI developed by Jovian and powered by state-of-the-art machine learning models.",
    },
  ]);

  async function sendRequest() {
    // update the message history
   
    const newMessageHistory = [...messages, {
      role: "user",
      content: userMessage
    }];

    setMessages(newMessageHistory);
    setUserMessage("");
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: newMessageHistory,
        }),
      });
      
      const respJson = await response.json();
      const updatedMessages = [...newMessageHistory, respJson.choices[0].message];
      setMessages(updatedMessages);
    } catch (error) {
      console.error(error);
      window.alert("Error:" + error.message);
    }  

  }

  return (
    <>
      <Head>
        <title>Jobot</title>
      </Head>
      <div className="flex flex-col h-screen">
        {/* Navbar */}
        <nav className="bg-white shadow w-full">
          <div className="px-4 h-14 flex justify-between items-center">
            <div className="text-xl font-bold">Jobot</div>
            <div>
              <input
                type="password"
                className="border rounded p-1"
                placeholder="Enter API key.."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          </div>
        </nav>

        {/* Message History */}
        <div className="flex-1 overflow-y-scroll">
          <div className="mx-auto w-full max-w-screen-md p-4 ">
            {messages
              .filter((msg) => msg.role !== "system")
              .map((msg, idx) => (
                <div key={idx} className="my-3">
                  <div className="font-bold">
                    {msg.role === "user" ? "Barber of Seville" : "Jobot"}
                  </div>
                  <div className="text-lg prose">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="mx-auto w-full max-w-screen-md px-4 pt-0 pb-2 flex">
          <textarea
            className="border rounded-md text-lg p-2 flex-1"
            rows={1}
            placeholder="Ask me anything..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
          />
          <button
            onClick={sendRequest}
            className="border rounded-md bg-blue-500 hover:bg-blue-600 text-white px-4 ml-2"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}