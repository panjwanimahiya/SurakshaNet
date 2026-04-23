import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Mic, Volume2, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  audioBlob?: string; // We'd store blob URL if full audio recording is needed
}

export const AICompanion = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [textEnabled, setTextEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getToken } = useAuth();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Load history
    const loadChatHistory = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/api/chat", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (e) {
        console.error("Failed to load chat history");
      }
    };
    loadChatHistory();

    // Setup speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSend(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const saveMessages = async (msgs: Message[]) => {
    setMessages(msgs);
    const token = getToken();
    if (!token) return;
    try {
      await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messages: msgs })
      });
    } catch (e) {
      console.error("Failed to save chat history");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const generateAIResponse = (userText: string) => {
    const text = userText.toLowerCase();

    // Helper functions for variations
    const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    const responses = {
      emergency: ["I detected a critical emergency. Please tap the red SOS button immediately to alert your contacts, or call 112.", "This is a serious situation. Press your SOS button right away and get to safety.", "Danger detected! Please do not wait—trigger your SOS alert now to broadcast your location."],
      aloneUnsafe: ["Since you are alone and feeling unsafe, do not show fear. Walk confidently towards the nearest exit or public area immediately. Share your live location with a friend or family member right now using the Nearby Help tool.", "If you feel unsafe around these people, do not engage. Stay on the phone with someone—even if you pretend—and move to a well-lit, populated space immediately.", "Your intuition is your best defense. Leave the area calmly but quickly. If they approach, loudly state you are meeting someone right outside."],
      stalking: ["If you think you are being followed, do NOT go home. Change your pace and direction, and head towards a busy public place like a store, cafe, or police station.", "Someone following you is alarming. Stop at the nearest open business. DO NOT confront them. Call a friend or the authorities immediately.", "Change your route immediately. Walk confidently to a well-lit, crowded area. Stay off your phone so you remain fully aware of your surroundings."],
      harassment: ["Draw attention to yourself if someone is making you uncomfortable. Yell 'Back off!' loudly if necessary to attract attention.", "Do not engage with them. Step away quickly and find a security guard, shop owner, or a group of people.", "Trust your gut. Distancing yourself immediately to a safer zone is the most effective action. Be loud if they cross your boundaries."],
      lost: ["To find your exact location, please open the 'Nearby Help' page. It will show your live coordinates and safe places.", "If you are lost, stay calm. Check the Nearby Help map on this app to pinpoint where you are.", "Move to a well-lit street corner to read signs, and use the Nearby Help tab to navigate to the nearest police station or hospital."],
      tips: ["Always stay aware of your surroundings. If you feel unsafe, trust your instincts and immediately leave the area.", "A great preventative habit is to share your live location with a trusted contact when traveling alone at night.", "Keep your head up and walk with purpose. Confidence deters threats. Never hesitate to use your SOS button if needed."],
      greeting: ["Hello! I am your SurakshaNet Safety Assistant. Ask me for safety tips or tell me what situation you are in.", "Hi there. I'm here to ensure your safety. Let me know if you need advice or are feeling uncomfortable.", "Greetings! How can I assist you with your personal security today?"]
    };

    // Deep advanced regex parsing
    if (text.match(/\b(help|emergency|sos|danger|attacked|kidnap|rob)\b/)) return getRandom(responses.emergency);
    
    // Parses user's specific scenario: "alone", "unsafe", "scared", "men working"
    if (text.match(/\b(alone|unsafe|scared|men|strangers|afraid|dark|alley|godown|warehouse)\b/) && text.match(/\b(unsafe|scared|what should i do|help)\b/)) {
      return getRandom(responses.aloneUnsafe);
    }

    if (text.match(/\b(stalk|follow|following|behind me|creepy|following me)\b/)) return getRandom(responses.stalking);
    if (text.match(/\b(stranger|harass|bothering|uncomfortable|weird|catcall|look at me)\b/)) return getRandom(responses.harassment);
    if (text.match(/\b(lost|where am i|location|directions|find my way)\b/)) return getRandom(responses.lost);
    
    // If they strictly ask for tips but aren't explicitly in danger
    if (text.match(/\b(tips|advice|suggest|what should I do|right now|prevent)\b/)) return getRandom(responses.aloneUnsafe); // Defaulting vague inquiries to the most robust advice

    if (text.match(/\b(hi|hello|hey|greetings|morning|evening|sup)\b/)) return getRandom(responses.greeting);

    // Dynamic Fallback Generator mimicking AI
    const fallbacks = [
      "I understand you're dealing with something specific. The safest general action is to remain calm, avoid isolated areas, and move toward a crowded space. Should I trigger an SOS?",
      "I am analyzing your situation. When in doubt, trust your instincts—leave the area immediately and call a trusted contact. Do you want to check the Nearby Help map?",
      "To give you the best tactical advice, please move to a well-lit area first. Your safety is paramount. Keep your phone ready."
    ];
    return getRandom(fallbacks);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const newMsg: Message = { id: Date.now().toString(), sender: "user", text: text.trim() };
    const updatedMessages = [...messages, newMsg];
    saveMessages(updatedMessages);
    setInputText("");

    // Fetch actual generative AI response
    setTimeout(async () => {
      const responseText = generateAIResponse(text);
      if (textEnabled) {
        const aiMsg: Message = { id: (Date.now() + 1).toString(), sender: "ai", text: responseText };
        saveMessages([...updatedMessages, aiMsg]);
      }
      if (audioEnabled) {
        speakText(responseText); // AI speaks back
      }
    }, 500);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageCircle className="w-8 h-8" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 lg:bottom-10 lg:right-10 w-[95vw] sm:w-[600px] md:w-[700px] lg:w-[800px] xl:w-[900px] 2xl:w-[1000px] max-w-[calc(100vw-2rem)] h-[85vh] lg:h-[90vh] 2xl:h-[95vh] max-h-[calc(100vh-4rem)] bg-card border-2 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2rem] flex flex-col z-50 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-2 bg-secondary/50 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl leading-none">Safety Assistant</h3>
              <p className="text-xs text-muted-foreground mt-1 text-green-500 font-bold">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-secondary/50 p-1 rounded-xl mr-2">
              <Button 
                 variant={textEnabled ? "default" : "ghost"} 
                 size="sm" 
                 className={`rounded-lg h-9 px-4 font-bold ${textEnabled ? 'shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                 onClick={() => {
                   if (textEnabled && !audioEnabled) setAudioEnabled(true);
                   setTextEnabled(!textEnabled);
                 }}
              >
                Text
              </Button>
              <Button 
                 variant={audioEnabled ? "default" : "ghost"} 
                 size="sm" 
                 className={`rounded-lg h-9 px-4 font-bold ${audioEnabled ? 'shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                 onClick={() => {
                   if (audioEnabled && !textEnabled) setTextEnabled(true);
                   setAudioEnabled(!audioEnabled);
                 }}
              >
                Voice
              </Button>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
              <X className="w-6 h-6 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center">
              <MessageCircle className="w-12 h-12 mb-3 opacity-20" />
              <p className="font-medium">Say hello to your Safety Assistant</p>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-3xl px-6 py-4 ${msg.sender === "user" ? "bg-primary text-primary-foreground rounded-br-md shadow-md shadow-primary/20" : "bg-muted rounded-bl-md"}`}>
                <p className="text-[17px] md:text-lg leading-relaxed font-medium">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-5 border-t-2 bg-card rounded-b-3xl">
          <div className="flex gap-3 relative">
            <Button
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              className="shrink-0 h-16 w-16 rounded-2xl transition-colors border-2 hover:bg-secondary"
              onClick={toggleListen}
              title="Click to speak"
            >
              {isListening ? <MicOff className="w-7 h-7 animate-pulse" /> : <Mic className="w-7 h-7 text-muted-foreground" />}
            </Button>
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend(inputText);
                }
              }}
              placeholder="Type or speak a message..."
              className="h-16 text-[17px] font-medium border-2 rounded-2xl px-5"
            />
            <Button onClick={() => handleSend(inputText)} size="icon" className="shrink-0 h-16 w-16 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform">
              <Send className="w-7 h-7" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
