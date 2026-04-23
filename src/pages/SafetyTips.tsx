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
    <div className="container mx-auto px-4 lg:px-12 pt-36 pb-24 max-w-[1400px]">
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-foreground mb-6 tracking-tight">Safety Tips & Guides</h1>
      <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-16 font-medium max-w-4xl">Practical advice to help you stay safe in every situation.</p>

      <div className="grid lg:grid-cols-2 gap-10 md:gap-12">
        {tips.map((tip, i) => (
          <motion.div
            key={tip.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card border-2 rounded-3xl p-10 md:p-14 shadow-[var(--shadow-card)] hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center">
                <tip.icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <h2 className="font-display font-black text-3xl md:text-4xl text-foreground">{tip.title}</h2>
            </div>
            <ul className="space-y-6">
              {tip.items.map((item) => (
                <li key={item} className="text-xl lg:text-2xl text-muted-foreground flex gap-4 leading-relaxed font-medium">
                  <span className="text-primary mt-1 text-2xl">•</span>
                  <span>{item}</span>
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
