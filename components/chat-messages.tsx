"use client";

import { Character } from "@prisma/client";
import { ChatMessage, ChatMessageProps } from "./chat-message";
import { ComponentRef, useEffect, useRef, useState } from "react";

interface ChatMessagesProps {
    messages: ChatMessageProps[];
    isLoading: boolean;
    character: Character;
}

export const ChatMessages = ({
    messages = [],
    isLoading,
    character
}: ChatMessagesProps) => {
    const scrollRef = useRef<ComponentRef<"div">>(null);
    const [fakeLoading, setFakeLoading] = useState(messages.length === 0 ? true : false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFakeLoading(false);
        }, 1000);

        return () => {
            clearTimeout(timeout);
        }
    }, []);

    useEffect(() => {
        scrollRef?.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages.length]);

    return(
        <div className="flex-1 overflow-y-auto pr-4">
            <ChatMessage isLoading={fakeLoading} src={character.src} role="system" content={`Hello, I am ${character.name}, ${character.description}`}/>
            {messages.map((message) => (
                <ChatMessage key={message.content} role={message.role} content={message.content} src={character.src} />
            ))}
            {isLoading && (
                <ChatMessage role="system" src={character.src} isLoading />
            )}
            <div ref={scrollRef} />
        </div>
        
    )
}