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
        className="text-center mb-20"
      >
        <h2 className="text-3xl md:text-4xl font-display font-black text-foreground mb-4">
          Your Safety, Our Priority
        </h2>
        <p className="text-base md:text-lg font-medium text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Powerful features designed to keep you safe, alert, and connected — wherever you go.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-8 md:gap-12">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl p-6 md:p-8 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow border-2"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <f.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display font-black text-lg md:text-xl text-foreground mb-2 tracking-tight">{f.title}</h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
