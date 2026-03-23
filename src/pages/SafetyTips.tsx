import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Moon, Car, Smartphone, Users, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const tips = [
  {
    icon: MapPin,
    title: "Share Your Location",
    items: [
      "Always share live location with a trusted person when traveling alone.",
      "Use Google Maps timeline so someone can track your movements.",
      "Avoid sharing your location publicly on social media.",
    ],
  },
  {
    icon: Moon,
    title: "Night Safety",
    items: [
      "Avoid poorly lit and isolated areas after dark.",
      "Keep your phone charged and easily accessible.",
      "Walk confidently and stay alert — avoid headphones.",
    ],
  },
  {
    icon: Car,
    title: "Commute Safety",
    items: [
      "Share cab details (number plate, driver name) with someone.",
      "Prefer verified ride services over unregistered cabs.",
      "Sit in the back seat and keep windows slightly open.",
    ],
  },
  {
    icon: Smartphone,
    title: "Digital Safety",
    items: [
      "Don't share personal information with strangers online.",
      "Use strong, unique passwords and enable 2FA.",
      "Be cautious of unsolicited messages and links.",
    ],
  },
  {
    icon: Users,
    title: "Social Situations",
    items: [
      "Trust your instincts — if something feels wrong, leave.",
      "Never leave your drink unattended at parties.",
      "Have a code word with friends to signal for help.",
    ],
  },
  {
    icon: Shield,
    title: "Self Defense",
    items: [
      "Learn basic self-defense moves — elbow strikes and knee kicks.",
      "Carry a personal safety alarm or pepper spray where legal.",
      "Shout loudly and make noise to attract attention if threatened.",
    ],
  },
];

const SafetyTips = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      <h1 className="text-3xl font-display font-bold text-foreground mb-2">Safety Tips & Guides</h1>
      <p className="text-muted-foreground mb-10">Practical advice to help you stay safe in every situation.</p>

      <div className="grid md:grid-cols-2 gap-6">
        {tips.map((tip, i) => (
          <motion.div
            key={tip.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card border rounded-xl p-6 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <tip.icon className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-display font-semibold text-foreground">{tip.title}</h2>
            </div>
            <ul className="space-y-2">
              {tip.items.map((item) => (
                <li key={item} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default SafetyTips;
