import { motion } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SOSButton from "@/components/SOSButton";
import FeaturesSection from "@/components/FeaturesSection";
import FakeCallButton from "@/components/FakeCallButton";
import SafetyTimerWidget from "@/components/SafetyTimerWidget";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Your Safety Companion
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-5">
                Stay Safe,{" "}
                <span className="text-primary">Stay Connected</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
                SafeHer empowers you with instant SOS alerts, live location sharing, and smart safety tools — because your safety matters most.
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Link to="/signup">
                  <Button size="lg" className="gap-2 font-semibold">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/safety-tips">
                  <Button size="lg" variant="outline" className="font-semibold">
                    Safety Tips
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center gap-8"
            >
              <SOSButton />
              <div className="flex flex-wrap gap-4 justify-center items-start">
                <FakeCallButton />
                <SafetyTimerWidget />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <FeaturesSection />

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-primary rounded-2xl p-10 md:p-14"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
              Set Up Your Emergency Contacts
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
              Add your trusted contacts so they're instantly notified when you press SOS.
            </p>
            <Link to="/emergency-contacts">
              <Button size="lg" variant="secondary" className="font-semibold gap-2">
                Manage Contacts <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-foreground">SafeHer</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 SafeHer. Stay safe, stay empowered.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
