import { motion } from "framer-motion";
import { Shield, MapPin, Phone, Bell, Users, Clock } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Live Location Sharing",
    desc: "Instantly share your real-time GPS location with trusted contacts via WhatsApp.",
  },
  {
    icon: Bell,
    title: "Instant SOS Alerts",
    desc: "One-tap emergency alert sends your location and distress message immediately.",
  },
  {
    icon: Users,
    title: "Emergency Contacts",
    desc: "Save trusted contacts who receive alerts when you need help the most.",
  },
  {
    icon: Phone,
    title: "Fake Call",
    desc: "Trigger a fake incoming call to escape uncomfortable or dangerous situations.",
  },
  {
    icon: Clock,
    title: "Safety Timer",
    desc: "Set a timer that auto-alerts contacts if you don't check in on time.",
  },
  {
    icon: Shield,
    title: "Safety Tips",
    desc: "Access curated safety guides for travel, night outings, and daily life.",
  },
];

const FeaturesSection = () => (
  <section className="py-20 bg-secondary/50">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
          Your Safety, Our Priority
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Powerful features designed to keep you safe, alert, and connected — wherever you go.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow border"
          >
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <f.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
