import { useState } from 'react'
import Head from 'next/head';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import Navbar from '@/components/Navbar';
import { useUser } from '@supabase/auth-helpers-react';
import { toast } from 'react-hot-toast';
import { streamOpenAIResponse } from '@/utils/openai';

export default function Home() {
  
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const user = useUser();
  const [ userMessage, setUserMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "You are Jobot, a helpful AI developed by Jovian and powered by state-of-the-art machine learning models.",
    },
  ]);

  const sendRequest = async () => {
      if (!user) {  // comes from useUser();
        toast.error("Please log in to send a message!");
        return;
      }

      if (!userMessage) {
        alert("Please enter a message before you hit send");
      }

      const oldUserMessage = userMessage;
      const oldMessages = messages;

      const updatedMessages = [
        ...messages,
        {
          role: "user",
          content: userMessage,
        },
      ];

      setMessages(updatedMessages);
      setUserMessage("");

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: updatedMessages,
            stream: true,
          }),
        });

        if (response.status !== 200) {
          throw new Error(
            `OpenAI API returned an error. Please ensure you've provided the right API key. Check the "Console" or "Network" of your browser's developer tools for details.`
          );
        }

        streamOpenAIResponse(response, (newMessage) => {
          const updatedMessages2 = [
            ...updatedMessages,
            { role: "assistant", content: newMessage },
          ];

          setMessages(updatedMessages2);
        });
      } catch (error) {
        console.error("error", error);

        setUserMessage(oldUserMessage);
        setMessages(oldMessages);
        window.alert("Error:" + error.message);
      }
  };

  return (
    <>
      <Head>
        <title>Jobot- Your friendly neighborhood AI</title>
      </Head>
      <div className="flex flex-col h-screen">
        {/* Navbar */}
       <Navbar />

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