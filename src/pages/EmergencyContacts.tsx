import { useState, useEffect } from "react";
import { Plus, Trash2, Users, ArrowLeft, Phone } from "lucide-react";

const GENERAL_CONTACTS = [
  { name: 'National Emergency', phone: '112', icon: '🚨' },
  { name: 'Police', phone: '100', icon: '🚓' },
  { name: 'Fire', phone: '101', icon: '🚒' },
  { name: 'Ambulance', phone: '102', icon: '🚑' },
  { name: 'Women Helpline', phone: '1091', icon: '🛡️' },
  { name: 'Cyber Crime', phone: '1930', icon: '💻' },
  { name: 'Disaster Management', phone: '1078', icon: '🌪️' },
];
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");
  const { toast } = useToast();
  const { getToken } = useAuth();

  useEffect(() => {
    const loadContacts = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/api/contacts", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setContacts(data);
        }
      } catch (e) {
        console.error("Failed to fetch contacts", e);
      }
    };
    loadContacts();
  }, [getToken]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast({ title: "Invalid Name", description: "Name must be at least 2 characters.", variant: "destructive" });
      return;
    }
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!/^\+?[0-9]{10,15}$/.test(cleanPhone)) {
      toast({ title: "Invalid Phone", description: "Please enter a valid phone number (10-15 digits).", variant: "destructive" });
      return;
    }

    const token = getToken();
    if (!token) {
      toast({ title: "Error", description: "Please log in to add contacts.", variant: "destructive" });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: name.trim(), phone: cleanPhone, relation: relation.trim() })
      });
      if (res.ok) {
        const newContact = await res.json();
        setContacts([...contacts, newContact]);
        setName(""); setPhone(""); setRelation("");
        toast({ title: "Contact Added", description: `${newContact.name} has been added as an emergency contact.` });
      }
    } catch (e) {
      toast({ title: "Server Error", description: "Failed to connect to backend", variant: "destructive" });
    }
  };

  const remove = async (id: string) => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/contacts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setContacts(contacts.filter((c) => c.id !== id));
        toast({ title: "Contact Removed" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 lg:px-12 pt-36 pb-24 max-w-[1400px]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 mb-16">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center shrink-0 shadow-inner">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-foreground tracking-tight mb-4">Emergency Contacts</h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">These contacts will be alerted when you press SOS</p>
          </div>
        </div>

        <form onSubmit={add} className="bg-card border-2 rounded-[2rem] p-8 md:p-14 shadow-[var(--shadow-card)] mb-16 space-y-8">
          <h2 className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-foreground">Add New Contact</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <Label className="text-lg md:text-xl font-semibold">Name</Label>
              <Input placeholder="Contact name" value={name} onChange={(e) => setName(e.target.value)} required className="h-16 text-xl rounded-xl" />
            </div>
            <div className="space-y-4">
              <Label className="text-lg md:text-xl font-semibold">Phone (with country code)</Label>
              <Input placeholder="+91XXXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} required className="h-16 text-xl rounded-xl" />
            </div>
            <div className="space-y-4">
              <Label className="text-lg md:text-xl font-semibold">Relation</Label>
              <Input placeholder="e.g. Mom, Friend" value={relation} onChange={(e) => setRelation(e.target.value)} className="h-16 text-xl rounded-xl" />
            </div>
          </div>
          <Button type="submit" size="lg" className="h-16 px-10 text-xl md:text-2xl font-bold gap-3 rounded-xl shadow-[0_0_20px_rgba(255,0,0,0.2)] mt-6 cursor-pointer">
            <Plus className="w-8 h-8" /> Add Contact
          </Button>
        </form>

        <div className="mb-16">
          <h2 className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">General Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GENERAL_CONTACTS.map((c, i) => (
              <div key={i} className="flex items-center gap-4 bg-card border-2 rounded-3xl p-6 md:p-8 shadow-[var(--shadow-card)] hover:shadow-[0_0_30px_rgba(255,0,0,0.1)] transition-all">
                <div className="text-4xl">{c.icon}</div>
                <div>
                  <p className="text-xl md:text-2xl font-display font-black text-foreground mb-1">{c.name}</p>
                  <p className="text-lg md:text-xl text-primary font-bold tracking-wider">{c.phone}</p>
                </div>
                <a href={`tel:${c.phone}`} className="ml-auto text-muted-foreground hover:text-sos flex items-center justify-center transition-colors p-3 hover:bg-sos/10 rounded-full shrink-0">
                  <Phone className="w-6 h-6 md:w-8 md:h-8" />
                </a>
              </div>
            ))}
          </div>
        </div>

        <h2 className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-foreground mb-8">Personal Contacts</h2>
        {contacts.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground border-4 border-dashed border-muted rounded-[2rem] bg-secondary/20">
            <Users className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-8 opacity-30" />
            <p className="text-2xl md:text-4xl font-display font-bold">No emergency contacts yet.</p>
            <p className="text-xl md:text-2xl mt-4 opacity-80 font-medium">Add one above to ensure you're protected.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {contacts.map((c) => (
              <div key={c.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-card border-2 rounded-3xl p-8 md:p-10 shadow-[var(--shadow-card)] hover:shadow-[0_0_30px_rgba(255,0,0,0.1)] transition-all">
                <div>
                  <p className="text-3xl md:text-4xl font-display font-black text-foreground mb-3">{c.name}</p>
                  <p className="text-xl md:text-2xl text-muted-foreground font-medium">{c.phone} {c.relation && <span className="text-primary before:content-['·'] before:mx-3 before:text-muted-foreground">{c.relation}</span>}</p>
                </div>
                <button onClick={() => remove(c.id)} className="text-muted-foreground hover:text-sos flex items-center justify-center transition-colors p-4 hover:bg-sos/10 rounded-full cursor-pointer shrink-0">
                  <Trash2 className="w-8 h-8 md:w-10 md:h-10" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyContacts;
