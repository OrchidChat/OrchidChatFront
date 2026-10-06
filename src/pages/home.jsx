import {useEffect, useRef, useState} from "react";

export function Home() {
    const socketRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        fetch("/api/message/chat/1/2")
            .then(response => response.json())
            .then(data => {
                console.log("Chatverlauf geladen:", data);
                setMessages(data);
            })
            .catch(error => {
                console.error("Chatverlauf konnte nicht geladen werden:", error);
            });
    }, []);

    useEffect(() => {
        const socket = new WebSocket(
            "/api/message/websocket/1"
        );

        socketRef.current = socket;

        socket.onopen = () => {
            console.log("User 1 ist verbunden");
        };

        socket.onmessage = event => {
            const receivedData = JSON.parse(event.data);

            console.log("Nachricht empfangen:", receivedData);

            if (Array.isArray(receivedData)) {
                setMessages(previousMessages => [
                    ...previousMessages,
                    ...receivedData
                ]);
            } else {
                setMessages(previousMessages => [
                    ...previousMessages,
                    receivedData
                ]);
            }
        };

        socket.onclose = () => {
            console.log("User 1 wurde getrennt");
        };

        return () => {
            socket.close();
        };
    }, []);

    function sendMessage(event) {
        event.preventDefault();

        if (!text.trim()) {
            return;
        }

        if (
            !socketRef.current ||
            socketRef.current.readyState !== WebSocket.OPEN
        ) {
            console.error("WebSocket ist nicht verbunden");
            return;
        }

        const message = {
            transmitter: {
                id: 1
            },
            recipient: {
                id: 2
            },
            chat: {
                user1: {
                    id: 1
                },
                user2: {
                    id: 2
                }
            },
            messageParts: [
                {
                    type: "text",
                    text: text.trim(),
                    file: null
                }
            ],
            recieved: false
        };

        socketRef.current.send(JSON.stringify(message));

        setMessages(previousMessages => [
            ...previousMessages,
            message
        ]);

        setText("");
    }

    return (
        <>
            <h1>Chat von User 1</h1>

            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={text}
                    onChange={event => setText(event.target.value)}
                />

                <button type="submit">
                    Senden
                </button>
            </form>

            <div className="history">
                <h2>Chatverlauf</h2>

                {messages.map((message, index) => (
                    <div key={message.id ?? index}>
                        <strong>
                            User {message.transmitter?.id ?? "?"}:
                        </strong>

                        {message.messageParts?.map((part, partIndex) => (
                            <span key={part.id ?? partIndex}>
                                {" "}{part.text}
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}