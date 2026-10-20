import { useEffect, useRef, useState } from "react";
import API_URL from "../services/api";
import "../css/home.css";

export function Home() {
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [users, setUsers] = useState([]);

    // Initialisiere recipientId direkt sicher aus dem localStorage
    const [recipientId, setRecipientId] = useState(() => {
        const saved = localStorage.getItem("lastRecipientId");
        return saved ? Number(saved) : null;
    });

    const [isConnected, setIsConnected] = useState(false);

    const recipientIdRef = useRef(recipientId);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = storedUser ? storedUser.id : null;

    // Automatisches Scrollen
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Ref aktuell halten & im localStorage sichern
    useEffect(() => {
        recipientIdRef.current = recipientId;
        if (recipientId) {
            localStorage.setItem("lastRecipientId", recipientId);
        }
    }, [recipientId]);

    // 1. User-Liste laden
    useEffect(() => {
        if (!currentUserId) return;

        fetch(`${API_URL}/User`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const otherUsers = data.filter(u => u.id !== Number(currentUserId));
                    setUsers(otherUsers);

                    // Nur wenn gar kein recipientId da ist (auch nicht im Storage), nimm den ersten
                    if (otherUsers.length > 0 && !recipientId) {
                        const saved = localStorage.getItem("lastRecipientId");
                        setRecipientId(saved ? Number(saved) : otherUsers[0].id);
                    }
                } else {
                    setUsers([]);
                }
            })
            .catch(err => console.error("Fehler beim Laden der User:", err));
    }, [currentUserId]);

    // 2. Chatverlauf abrufen (Strenger Schutz vor ungültigen IDs)
    useEffect(() => {
        const myIdNum = Number(currentUserId);
        const recIdNum = Number(recipientId);

        if (!myIdNum || !recIdNum || isNaN(myIdNum) || isNaN(recIdNum)) return;

        fetch(`${API_URL}/message/chat/${myIdNum}/${recIdNum}`)
            .then(response => response.json())
            .then(data => {
                setMessages(Array.isArray(data) ? data : []);
            })
            .catch(error => {
                console.error("Chatverlauf konnte nicht geladen werden:", error);
                setMessages([]);
            });
    }, [currentUserId, recipientId]);

    // 3. WebSocket aufbauen
    useEffect(() => {
        if (!currentUserId) return;

        const wsUrl = API_URL.replace("http", "ws") + `/message/websocket/${currentUserId}`;
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => setIsConnected(true);

        socket.onmessage = event => {
            try {
                const receivedData = JSON.parse(event.data);
                const newItems = Array.isArray(receivedData) ? receivedData : [receivedData];

                const activeRecipient = recipientIdRef.current;
                const relevantItems = newItems.filter(m => {
                    const transmitterId = Number(m.transmitter?.id);
                    const recipientIdInMsg = Number(m.recipient?.id);
                    return transmitterId === Number(activeRecipient) || recipientIdInMsg === Number(activeRecipient);
                });

                if (relevantItems.length === 0) return;

                setMessages(previousMessages => {
                    const existingIds = new Set(previousMessages.map(m => m.id).filter(id => id != null));
                    const uniqueNewItems = relevantItems.filter(m => !m.id || !existingIds.has(m.id));

                    if (uniqueNewItems.length === 0) return previousMessages;
                    return [...previousMessages, ...uniqueNewItems];
                });
            } catch (e) {
                console.error("Fehler beim Verarbeiten der Nachricht:", e);
            }
        };

        socket.onclose = () => setIsConnected(false);

        return () => {
            socket.close();
        };
    }, [currentUserId]);

    // 4. Nachricht senden
    function sendMessage(event) {
        event.preventDefault();

        if (!text.trim() || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            return;
        }

        const message = {
            transmitter: { id: Number(currentUserId) },
            recipient: { id: Number(recipientId) },
            chat: {
                user1: { id: Number(currentUserId) },
                user2: { id: Number(recipientId) }
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
        setMessages(previousMessages => [...previousMessages, message]);
        setText("");
    }

    return (
        <div className="chat-layout">
            <aside className="sidebar">
                <h3>Chats</h3>
                <span className="user-info">Eingeloggt: {storedUser?.firstname}</span>
                <ul className="user-list">
                    {users.map(user => (
                        <li
                            key={user.id}
                            className={`user-item ${user.id === recipientId ? "active" : ""}`}
                            onClick={() => setRecipientId(user.id)}
                        >
                            {user.firstname} {user.lastname}
                        </li>
                    ))}
                </ul>
            </aside>

            <main className="chat-main">
                <div className="messages">
                    {messages.map((message, index) => {
                        const isOwnMessage = Number(message.transmitter?.id) === Number(currentUserId);
                        return (
                            <div
                                key={message.id ? `msg-${message.id}` : `index-${index}`}
                                className={`message ${isOwnMessage ? "mine" : ""}`}
                            >
                                {message.messageParts?.map((part, partIndex) => (
                                    <span key={part.id ? `part-${part.id}` : `part-index-${partIndex}`}>
                                        {part.text}
                                    </span>
                                ))}
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chat-form" onSubmit={sendMessage}>
                    <input
                        type="text"
                        placeholder="Nachricht schreiben..."
                        value={text}
                        onChange={event => setText(event.target.value)}
                    />
                    <button type="submit" disabled={!isConnected}>
                        {isConnected ? "Senden" : "..."}
                    </button>
                </form>
            </main>
        </div>
    );
}