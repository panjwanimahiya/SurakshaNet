import { useState, useEffect } from "react";
import { Plus, Trash2, Users, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

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

  useEffect(() => {
    const saved = localStorage.getItem("emergency_contacts");
    if (saved) setContacts(JSON.parse(saved));
  }, []);

  const save = (list: Contact[]) => {
    setContacts(list);
    localStorage.setItem("emergency_contacts", JSON.stringify(list));
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    const newContact: Contact = { id: Date.now().toString(), name, phone, relation };
    save([...contacts, newContact]);
    setName(""); setPhone(""); setRelation("");
    toast({ title: "Contact Added", description: `${name} has been added as an emergency contact.` });
  };

  const remove = (id: string) => {
    save(contacts.filter((c) => c.id !== id));
    toast({ title: "Contact Removed" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-2xl">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Emergency Contacts</h1>
            <p className="text-sm text-muted-foreground">These contacts will be alerted when you press SOS</p>
          </div>
        </div>

        <form onSubmit={add} className="bg-card border rounded-xl p-5 shadow-[var(--shadow-card)] mb-8 space-y-4">
          <h2 className="font-display font-semibold text-foreground">Add New Contact</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input placeholder="Contact name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label>Phone (with country code)</Label>
              <Input placeholder="+91XXXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label>Relation</Label>
              <Input placeholder="e.g. Mom, Friend" value={relation} onChange={(e) => setRelation(e.target.value)} />
            </div>
          </div>
          <Button type="submit" size="sm" className="gap-1">
            <Plus className="w-4 h-4" /> Add Contact
          </Button>
        </form>

        {contacts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No emergency contacts yet. Add one above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map((c) => (
              <div key={c.id} className="flex items-center justify-between bg-card border rounded-lg p-4 shadow-sm">
                <div>
                  <p className="font-medium text-foreground">{c.name}</p>
                  <p className="text-sm text-muted-foreground">{c.phone} {c.relation && `· ${c.relation}`}</p>
                </div>
                <button onClick={() => remove(c.id)} className="text-muted-foreground hover:text-sos transition-colors">
                  <Trash2 className="w-4 h-4" />
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
