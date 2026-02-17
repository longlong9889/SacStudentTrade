import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import Navbar from "../layout/Navbar.jsx";
import {
  getMessagesForUser, getConversation,
  sendMessage as sendMessageAPI, markAllMessagesRead,
} from "../../services/client.js";
import { formatTime, formatDate, getInitials } from "../../services/utils.js";
import {
  SearchIcon, SendIcon, ArrowLeftIcon, TagIcon,
  DotsIcon, CheckCheckIcon,
} from "../shared/Icons.jsx";

export default function MessagesPage() {
  const { customer } = useAuth();
  const customerId = parseInt(customer?.id || localStorage.getItem("customerId") || "0");
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [input, setInput] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [mobileShowThread, setMobileShowThread] = useState(false);
  const [loading, setLoading] = useState(true);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch and group messages into conversations
  const fetchConversations = useCallback(async () => {
    if (!customerId) return;
    try {
      const res = await getMessagesForUser(customerId);
      const messages = res.data || [];

      // Group by other user
      const map = {};
      messages.forEach(msg => {
        const otherId = msg.senderId === customerId ? msg.receiverId : msg.senderId;
        const otherName = msg.senderId === customerId ? msg.receiverName : msg.senderName;
        if (!map[otherId]) {
          map[otherId] = {
            otherUser: { id: otherId, name: otherName, initials: getInitials(otherName) },
            itemTitle: msg.itemTitle || null,
            itemId: msg.itemId || null,
            messages: [],
            unread: 0,
          };
        }
        map[otherId].messages.push(msg);
        if (!msg.isRead && msg.senderId !== customerId) map[otherId].unread++;
      });

      // Sort each conversation's messages by time, then sort conversations by latest
      const convs = Object.values(map);
      convs.forEach(c => c.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
      convs.sort((a, b) => {
        const aLast = new Date(a.messages[a.messages.length - 1].createdAt);
        const bLast = new Date(b.messages[b.messages.length - 1].createdAt);
        return bLast - aLast;
      });

      setConversations(convs);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  // When selecting a conversation
  const selectConversation = async (otherId) => {
    setActiveConvId(otherId);
    setMobileShowThread(true);
    const conv = conversations.find(c => c.otherUser.id === otherId);
    if (conv) {
      setThreadMessages(conv.messages);
      // Mark as read
      if (conv.unread > 0) {
        try {
          await markAllMessagesRead(customerId, otherId);
          setConversations(prev => prev.map(c =>
            c.otherUser.id === otherId ? { ...c, unread: 0 } : c
          ));
        } catch {}
      }
    }
    setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }, 100);
  };

  // Send message
  const handleSend = async () => {
    if (!input.trim() || !activeConvId) return;
    const content = input.trim();
    setInput("");

    const conv = conversations.find(c => c.otherUser.id === activeConvId);

    // Optimistic add
    const tempMsg = {
      id: Date.now(),
      senderId: customerId,
      senderName: "You",
      receiverId: activeConvId,
      receiverName: conv?.otherUser.name || "",
      content,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setThreadMessages(prev => [...prev, tempMsg]);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    try {
      await sendMessageAPI(customerId, {
        receiverId: activeConvId,
        itemId: conv?.itemId || null,
        content,
      });
      fetchConversations(); // Refresh
    } catch (err) {
      console.error("Failed to send:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const activeConv = conversations.find(c => c.otherUser.id === activeConvId);
  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  const filtered = conversations.filter(c =>
    !searchFilter || c.otherUser.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Group thread messages by date
  const groupedMessages = [];
  let currentDate = null;
  threadMessages.forEach((msg, i) => {
    const date = formatDate(msg.createdAt);
    if (date !== currentDate) {
      groupedMessages.push({ type: "date", label: date });
      currentDate = date;
    }
    const next = threadMessages[i + 1];
    const showTail = !next || next.senderId !== msg.senderId;
    groupedMessages.push({ type: "msg", msg, isMe: msg.senderId === customerId, showTail });
  });

  return (
    <>
      <style>{`
        @media (max-width: 720px) {
          .msg-sidebar { width: 100% !important; border-right: none !important; }
          .msg-thread-wrap { position: fixed; inset: 0; z-index: 200; }
        }
      `}</style>

      <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg)" }}>
        {/* Top bar */}
        <nav style={{
          height: "52px", borderBottom: "1px solid var(--border-light)",
          backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)",
          display: "flex", alignItems: "center", padding: "0 20px",
          flexShrink: 0, justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "26px", height: "26px", borderRadius: "6px",
              backgroundColor: "var(--green-900)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--gold-500)", fontSize: "13px", fontWeight: 800,
              fontFamily: "var(--font-mono)", cursor: "pointer",
            }} onClick={() => window.location.href = "/marketplace"}>S</div>
            <span style={{
              fontSize: "14px", fontWeight: 700, color: "var(--text-primary)",
              fontFamily: "var(--font-sans)", letterSpacing: "-0.3px",
            }}>SacTrade</span>
            <span style={{
              fontSize: "12px", color: "var(--text-faint)",
              fontFamily: "var(--font-sans)", marginLeft: "4px",
            }}>/ Messages</span>
          </div>
          <button onClick={() => window.location.href = "/marketplace"} style={{
            padding: "5px 12px", borderRadius: "6px",
            border: "1px solid var(--border)", backgroundColor: "var(--surface)",
            fontSize: "12px", fontWeight: 500, color: "var(--text-secondary)",
            fontFamily: "var(--font-sans)", cursor: "pointer",
          }}>← Marketplace</button>
        </nav>

        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Sidebar */}
          <div className="msg-sidebar" style={{
            width: "340px", borderRight: "1px solid var(--border-light)",
            display: mobileShowThread ? "none" : "flex",
            flexDirection: "column", backgroundColor: "var(--surface)", flexShrink: 0,
          }}>
            <div style={{ padding: "14px 16px 10px", flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <h2 style={{ fontSize: "16px", fontWeight: 700, fontFamily: "var(--font-sans)" }}>Inbox</h2>
                  {totalUnread > 0 && (
                    <span style={{
                      backgroundColor: "var(--red-500)", color: "#fff",
                      fontSize: "10px", fontWeight: 700, padding: "1px 6px",
                      borderRadius: "8px", fontFamily: "var(--font-mono)",
                    }}>{totalUnread}</span>
                  )}
                </div>
              </div>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-placeholder)", display: "flex" }}>
                  <SearchIcon size={15} />
                </div>
                <input type="text" placeholder="Search conversations..."
                  value={searchFilter} onChange={e => setSearchFilter(e.target.value)}
                  style={{
                    width: "100%", padding: "8px 10px 8px 32px", borderRadius: "8px",
                    border: "1px solid var(--border-light)", fontSize: "12.5px",
                    backgroundColor: "#FDFCFA", fontFamily: "var(--font-sans)", outline: "none",
                  }}
                />
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
              {loading ? (
                <div style={{ padding: "32px", textAlign: "center" }}>
                  <div style={{
                    width: "24px", height: "24px", border: "2.5px solid var(--border)",
                    borderTopColor: "var(--green-900)", borderRadius: "50%",
                    animation: "spin 0.7s linear infinite", margin: "0 auto 8px",
                  }} />
                  <p style={{ fontSize: "12px", color: "var(--text-faint)", fontFamily: "var(--font-sans)" }}>Loading...</p>
                </div>
              ) : filtered.length > 0 ? filtered.map(conv => {
                const last = conv.messages[conv.messages.length - 1];
                const isActive = conv.otherUser.id === activeConvId;
                const isFromMe = last.senderId === customerId;
                return (
                  <button key={conv.otherUser.id}
                    onClick={() => selectConversation(conv.otherUser.id)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: "12px",
                      padding: "14px 16px", border: "none",
                      borderBottom: "1px solid #F0EBE3",
                      backgroundColor: isActive ? "var(--surface-active)" : "transparent",
                      cursor: "pointer", textAlign: "left",
                      transition: "background-color 0.1s",
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = "var(--bg)"; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    <div style={{
                      width: "42px", height: "42px", borderRadius: "50%",
                      backgroundColor: "var(--green-900)", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--gold-500)", fontSize: "13px", fontWeight: 700,
                      fontFamily: "var(--font-mono)", position: "relative",
                    }}>
                      {conv.otherUser.initials}
                      {conv.unread > 0 && (
                        <div style={{
                          position: "absolute", bottom: "-1px", right: "-1px",
                          width: "12px", height: "12px", borderRadius: "50%",
                          backgroundColor: "var(--red-500)", border: "2px solid #fff",
                        }} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                        <span style={{
                          fontSize: "13.5px", fontWeight: conv.unread > 0 ? 700 : 500,
                          color: "var(--text-primary)", fontFamily: "var(--font-sans)",
                        }}>{conv.otherUser.name}</span>
                        <span style={{
                          fontSize: "10px", color: conv.unread > 0 ? "var(--red-500)" : "var(--text-placeholder)",
                          fontFamily: "var(--font-mono)", fontWeight: conv.unread > 0 ? 600 : 400, flexShrink: 0,
                        }}>{formatDate(last.createdAt)}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        {isFromMe && <span style={{ flexShrink: 0, display: "flex" }}><CheckCheckIcon read={last.isRead} /></span>}
                        <p style={{
                          margin: 0, fontSize: "12.5px",
                          color: conv.unread > 0 ? "var(--text-secondary)" : "var(--text-faint)",
                          fontWeight: conv.unread > 0 ? 600 : 400, fontFamily: "var(--font-sans)",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>{last.content}</p>
                      </div>
                      {conv.itemTitle && (
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: "3px", marginTop: "4px",
                          fontSize: "10px", color: "var(--gold-600)", fontFamily: "var(--font-mono)", fontWeight: 600,
                        }}>
                          <TagIcon />{conv.itemTitle.length > 28 ? conv.itemTitle.slice(0, 28) + "…" : conv.itemTitle}
                        </div>
                      )}
                    </div>
                  </button>
                );
              }) : (
                <div style={{ padding: "40px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px", opacity: 0.3 }}>💬</div>
                  <p style={{ fontSize: "13px", color: "var(--text-faint)", fontFamily: "var(--font-sans)" }}>
                    {searchFilter ? "No conversations found" : "No messages yet"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Thread */}
          {activeConv ? (
            <div className={mobileShowThread ? "msg-thread-wrap" : ""} style={{
              flex: 1, display: "flex", flexDirection: "column",
              minWidth: 0, backgroundColor: "var(--bg)",
            }}>
              {/* Thread header */}
              <div style={{
                padding: "12px 16px", borderBottom: "1px solid var(--border-light)",
                backgroundColor: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", gap: "12px", flexShrink: 0,
              }}>
                <button className="mobile-only" onClick={() => setMobileShowThread(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex", padding: "4px" }}>
                  <ArrowLeftIcon />
                </button>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  backgroundColor: "var(--green-900)", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--gold-500)", fontSize: "12px", fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                }}>{activeConv.otherUser.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-sans)" }}>{activeConv.otherUser.name}</div>
                  {activeConv.itemTitle && (
                    <div style={{
                      display: "flex", alignItems: "center", gap: "4px",
                      fontSize: "11px", color: "var(--gold-600)", fontFamily: "var(--font-mono)", fontWeight: 600,
                    }}><TagIcon />{activeConv.itemTitle}</div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column" }}>
                {groupedMessages.map((entry, i) => {
                  if (entry.type === "date") {
                    return (
                      <div key={`d-${i}`} style={{ textAlign: "center", margin: "12px 0 8px" }}>
                        <span style={{
                          fontSize: "10px", fontWeight: 600, color: "var(--text-placeholder)",
                          fontFamily: "var(--font-mono)", textTransform: "uppercase",
                          letterSpacing: "0.5px", backgroundColor: "var(--surface-active)",
                          padding: "3px 10px", borderRadius: "10px",
                        }}>{entry.label}</span>
                      </div>
                    );
                  }
                  const { msg, isMe, showTail } = entry;
                  return (
                    <div key={msg.id} style={{
                      display: "flex", justifyContent: isMe ? "flex-end" : "flex-start",
                      marginBottom: showTail ? "10px" : "2px",
                      paddingLeft: isMe ? "48px" : 0, paddingRight: isMe ? 0 : "48px",
                    }}>
                      <div style={{
                        maxWidth: "340px", padding: "10px 14px",
                        borderRadius: isMe
                          ? (showTail ? "14px 14px 4px 14px" : "14px 4px 4px 14px")
                          : (showTail ? "14px 14px 14px 4px" : "4px 14px 14px 4px"),
                        backgroundColor: isMe ? "var(--green-900)" : "var(--surface)",
                        color: isMe ? "#E8E4DC" : "var(--text-primary)",
                        border: isMe ? "none" : "1px solid var(--border-light)",
                      }}>
                        <p style={{
                          margin: 0, fontSize: "13.5px", lineHeight: 1.55,
                          fontFamily: "var(--font-sans)",
                        }}>{msg.content}</p>
                        <div style={{
                          display: "flex", alignItems: "center", justifyContent: "flex-end",
                          gap: "4px", marginTop: "4px",
                        }}>
                          <span style={{
                            fontSize: "9.5px",
                            color: isMe ? "rgba(255,255,255,0.35)" : "var(--text-placeholder)",
                            fontFamily: "var(--font-mono)",
                          }}>{formatTime(msg.createdAt)}</span>
                          {isMe && <span style={{ display: "flex", opacity: 0.6 }}><CheckCheckIcon read={msg.isRead} /></span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>

              {/* Input */}
              <div style={{
                padding: "12px 16px", borderTop: "1px solid var(--border-light)",
                backgroundColor: "var(--surface)",
                display: "flex", alignItems: "flex-end", gap: "8px", flexShrink: 0,
              }}>
                <textarea ref={inputRef} placeholder="Type a message..."
                  value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown} rows={1}
                  style={{
                    flex: 1, padding: "10px 14px", borderRadius: "10px",
                    border: "1px solid var(--border)", fontSize: "13.5px",
                    fontFamily: "var(--font-sans)", color: "var(--text-primary)",
                    backgroundColor: "#FDFCFA", outline: "none", resize: "none",
                    minHeight: "40px", maxHeight: "100px", lineHeight: 1.45,
                  }}
                />
                <button onClick={handleSend} disabled={!input.trim()}
                  style={{
                    width: "40px", height: "40px", borderRadius: "10px",
                    backgroundColor: input.trim() ? "var(--green-900)" : "var(--border)",
                    color: input.trim() ? "var(--gold-500)" : "var(--text-placeholder)",
                    border: "none", cursor: input.trim() ? "pointer" : "default",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "background-color 0.15s",
                  }}
                ><SendIcon /></button>
              </div>
            </div>
          ) : (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              backgroundColor: "var(--bg)", padding: "40px",
            }}>
              <div style={{
                width: "64px", height: "64px", borderRadius: "16px",
                backgroundColor: "var(--surface-active)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "28px", marginBottom: "16px",
              }}>💬</div>
              <h3 style={{
                fontSize: "16px", fontWeight: 600, color: "var(--text-muted)",
                fontFamily: "var(--font-sans)", marginBottom: "4px",
              }}>Your messages</h3>
              <p style={{
                fontSize: "13px", color: "var(--text-placeholder)",
                fontFamily: "var(--font-sans)", textAlign: "center", lineHeight: 1.5,
              }}>Select a conversation to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
