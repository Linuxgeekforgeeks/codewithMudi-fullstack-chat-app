import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../stores/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../stores/useAuthStore";
import { timeFromNow } from "../lib/moment";
import TypingSkeleton from "./skeletons/TypingSkeleton";

function ChatContainer() {
  const { authUser } = useAuthStore();
  const { messages, getMessages, isMessageLoading, selectedUser, subscribeToMessage, unsubscribeFromMessage } = useChatStore();
  const messageEndRef = useRef(null)
  const [isTyping,setIsTyping]=useState(true)

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);

      const { socket, connectSocket } = useAuthStore.getState();

      if (!socket) {
        console.warn("Socket is not initialized. Attempting to connect...");
        connectSocket(); // Ensure the socket is connected before subscribing
      }

      if (socket) {
        subscribeToMessage();
      }
    }

    return () => {
      unsubscribeFromMessage();
    };
  }, [selectedUser?._id, getMessages, subscribeToMessage, unsubscribeFromMessage]);
  useEffect(() => {
    if (messageEndRef.current && messages){

      messageEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])
  if (isMessageLoading)
    return (
      <div className="flex flex-col h-full">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex w-full flex-col h-full">
      <ChatHeader />
      {/* Scrollable messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            ref={messageEndRef}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={`${message.senderId === authUser._id
                      ? authUser.ProfilePic || "/avatar.png"
                      : selectedUser.ProfilePic || "/avatar.png"
                    }`}
                  alt="profilePic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">{timeFromNow(message.createdAt)}</time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        {isTyping?<TypingSkeleton/>:""}
      </div>
      <MessageInput />
    </div>
  );
}

export default ChatContainer;
