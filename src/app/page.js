"use client";
import Image from "next/image";
import styles from "./page.module.css";
import loadinglogo from "../../public/images/logoAI2.gif";
import userLogo from "../../public/images/avatar.png";
import AILogo from "../../public/images/AI.png";
import { FaArrowUp, FaRegEdit } from "react-icons/fa";
import { React, useRef, useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [message, setMessage] = useState("");
  const [displayRegions, setDisplayRegions] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    scroll();
  }, [chatHistory]);

  /* When the button is pressed, it first goes to the API. 
  Transmits the message and history to Gemini Ai via API. Then it returns the response.*/
  const handleChat = async () => {
    if (message.trim() !== "") {
      setMessage("");
      setDisplayRegions(true);
      setLoading(true);
      try {
        const response = await axios.post(
          "https://geminiaichatbot-1-u85x.onrender.com",
          {
            history: chatHistory,
            message: message,
          }
        );
        const data = response.data;
        const userMessage = {
          role: "user",
          parts: [{ text: message }],
        };

        const modelResponse = {
          role: "model",
          parts: [{ text: data }],
        };
        /* We add new messages to our existing message history.*/
        setChatHistory((oldChatHistory) => [
          ...oldChatHistory,
          userMessage,
          modelResponse,
        ]);
      } catch (error) {
        setLoading(false);
        setError(true);
        console.error("Hata:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  /*As the user reaches the end of the chat screen with their messages,
   it automatically scrolls to the end. */
  const scroll = () => {
    const chatContainer = document.querySelector(".page_chatScreen__tkFK3");
    if (chatContainer) {
      const { offsetHeight, scrollHeight, scrollTop } = chatContainer;
      if (scrollHeight >= scrollTop + offsetHeight) {
        console.log("tt");
        chatContainer.scrollTo(0, scrollHeight + 200);
      }
    }
  };
  /* Clear everything for new chat.(chathistory, input..)*/
  const handleNewChat = () => {
    setMessage("");
    setChatHistory([]);
    setLoading(false);
    setDisplayRegions(false);
  };

  return (
    <div className={styles.main}>
      <button className={styles.newChatButton} onClick={handleNewChat}>
        <FaRegEdit className={styles.newChatIcon} />
        <span>New Chat</span>
      </button>
      {displayRegions ? (
        <div className={styles.chatScreen}>
          <ul>
            {chatHistory.map((input, _index) => (
              <li key={_index}>
                {input.role === "user" ? (
                  <>
                    <Image
                      src={userLogo}
                      alt="chatLogo"
                      className={styles.chatLogo}
                    />
                    <div className={styles.chat}>
                      <p className={styles.role}>You</p>
                      <p>{input.parts[0].text}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Image
                      src={AILogo}
                      alt="chatLogo"
                      className={styles.chatLogo}
                    />
                    <div className={styles.chat}>
                      <p className={styles.role}>AI</p>
                      <p>{input.parts[0].text}</p>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
          {loading && (
            <div className={styles.loading}>
              <Image
                src={loadinglogo}
                alt="chatLogo"
                className={styles.chatLogo}
              />
              <div className={styles.typingAnimation}>
                I'm thinking. It'll only take a few seconds....
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className={styles.logo}></div>
          <div className={styles.description}>
            <p className={styles.title}>
              Hello there, human! How can I assist you?
            </p>
            <p className={styles.information}>
              I'm here to help you. Just ask me anything, and I'll do my best to
              give you a helpful answer.
            </p>
          </div>
        </>
      )}
      <div className={styles.inputContainer}>
        <textarea
          variant="flat"
          type="text"
          className={styles.input}
          placeholder="Type..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className={
            message.trim()
              ? styles.enterButtonActive
              : styles.enterButtonDisabled
          }
          onClick={handleChat}
          disabled={!message.trim()}
        >
          <FaArrowUp className={styles.icon} />
        </button>
      </div>
    </div>
  );
}
