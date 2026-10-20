import { useEffect, useRef, useState } from "react";
import API_URL from "../services/api";

export function Home() {
    const socketRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");


    // 1. Den eingeloggten User aus dem localStorage holen
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = storedUser ? storedUser.id : null;
    // Wenn du User 1 bist, ist dein Partner User 2. Wenn du User 2 bist, ist dein Partner User 1.
    const recipientId = currentUserId === 1 ? 2 : 1;

    // Chatverlauf beim Laden der Komponente abrufen
    useEffect(() => {
        if (!currentUserId) return;

        fetch(`${API_URL}/message/chat/${currentUserId}/${recipientId}`)
            .then(response => response.json())
            .then(data => {
                console.log("Chatverlauf geladen:", data);
                // Nur ins Array schreiben, wenn die Antwort auch wirklich eine Liste ist!
                if (Array.isArray(data)) {
                    setMessages(data);
                } else {
                    console.error("Antwort war kein Array (möglicherweise 404 oder Fehler):", data);
                    setMessages([]); // Fallback: Leere Liste, damit .map nicht abstürzt
                }
            })
            .catch(error => {
                console.error("Chatverlauf konnte nicht geladen werden:", error);
                setMessages([]);
            });
    }, [currentUserId]);

    // 3. WebSocket-Verbindung für Live-Nachrichten aufbauen
    useEffect(() => {
        if (!currentUserId) return;

        // WebSocket-URL aus API_URL ableiten (http -> ws)
        const wsUrl = API_URL.replace("http", "ws") + `/message/websocket/${currentUserId}`;
        const socket = new WebSocket(wsUrl);

        socketRef.current = socket;

        socket.onopen = () => {
            console.log(`User ${currentUserId} ist mit dem WebSocket verbunden`);
        };

        socket.onmessage = event => {
            try {
                const receivedData = JSON.parse(event.data);
                console.log("Nachricht empfangen:", receivedData);

                setMessages(previousMessages => {
                    // Konvertiere empfangene Daten immer in ein Array zur einheitlichen Behandlung
                    const newItems = Array.isArray(receivedData) ? receivedData : [receivedData];

                    // Ein Set mit allen bereits vorhandenen IDs erstellen
                    const existingIds = new Set(previousMessages.map(m => m.id).filter(id => id != null));

                    // Nur Nachrichten hinzufügen, deren ID noch nicht im State ist
                    const uniqueNewItems = newItems.filter(m => !m.id || !existingIds.has(m.id));

                    if (uniqueNewItems.length === 0) {
                        return previousMessages; // Nichts Neues hinzuzufügen
                    }

                    return [...previousMessages, ...uniqueNewItems];
                });
            } catch (e) {
                console.error("Fehler beim Verarbeiten der WebSocket-Nachricht:", e);
            }
        };

        socket.onclose = () => {
            console.log("WebSocket Verbindung getrennt");
        };

        return () => {
            socket.close();
        };
    }, [currentUserId]);

    // 4. Nachricht senden
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
                id: Number(currentUserId) // Die eigene ID als Absender
            },
            recipient: {
                id: Number(recipientId)   // Die ID des Empfängers
            },
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

        setMessages(previousMessages => [
            ...previousMessages,
            message
        ]);

        setText("");
    }

    return (
        <div className="chat">
            <h1>Chat von {storedUser ? storedUser.firstname : "User"}</h1>

            <div className="messages">
                {messages.map((message, index) => (
                    <div
                        key={message.id ? `msg-${message.id}` : `index-${index}`} // <-- Eindeutiger Key
                        className={Number(message.transmitter?.id) === Number(currentUserId) ? "message mine" : "message"}
                    >
                        {message.messageParts?.map((part, partIndex) => (
                            <span key={part.id ? `part-${part.id}` : `part-index-${partIndex}`}>{part.text}</span>
                        ))}
                    </div>
                ))}
            </div>

            <form className="chat-form" onSubmit={sendMessage}>
                <input
                    type="text"
                    placeholder="Nachricht schreiben..."
                    value={text}
                    onChange={event => setText(event.target.value)}
                />

                <button type="submit">Senden</button>
            </form>
        </div>
    );
}