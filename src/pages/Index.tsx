import { motion } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SOSButton from "@/components/SOSButton";
import FeaturesSection from "@/components/FeaturesSection";
import FakeCallButton from "@/components/FakeCallButton";
import SafetyTimerWidget from "@/components/SafetyTimerWidget";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { isLoggedIn, userName } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-36 pb-16 md:pt-40 md:pb-24 relative overflow-hidden min-h-[calc(100vh-112px)] flex flex-col justify-center">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-primary/10 blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="container mx-auto px-4 relative mt-12 md:mt-0">
          {isLoggedIn ? (
            /* Logged-in view: SOS focused */
            <div className="flex flex-col items-center gap-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4">
                  Welcome back, <span className="text-primary">{userName}</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground">You are protected. Help is just one signal away.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <SOSButton />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-4 justify-center items-start"
              >
                <FakeCallButton />
                <SafetyTimerWidget />
              </motion.div>
            </div>
          ) : (
            /* Guest view: marketing hero */
            <div className="flex flex-col justify-center items-center text-center w-full max-w-6xl mx-auto py-10 lg:py-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 text-primary border border-primary/20 text-lg md:text-xl font-bold mb-10 w-fit uppercase tracking-widest shadow-[0_0_20px_rgba(255,0,0,0.1)]">
                  <Shield className="w-6 h-6" />
                  Your Safety Companion
                </div>

                <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[130px] font-display font-extrabold text-foreground leading-[1] mb-10 tracking-tight drop-shadow-lg">
                  One Signal. <br className="hidden lg:block" />
                  Help. <br className="hidden lg:block" />
                  <span className="text-primary mt-2 block">Anywhere.</span>
                </h1>

                <p className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground mb-16 max-w-4xl leading-relaxed font-light">
                  SurakshaNet empowers you with instant SOS alerts, live location sharing, and smart safety tools — ensuring protection whenever you need it.
                </p>

                <div className="flex flex-wrap gap-6 justify-center">
                  <Link to="/signup">
                    <Button size="lg" className="h-20 px-12 text-2xl font-bold gap-3 shadow-[0_0_30px_rgba(255,0,0,0.3)] hover:shadow-[0_0_40px_rgba(255,0,0,0.5)] transition-all rounded-2xl">
                      Get Protected <ArrowRight className="w-7 h-7" />
                    </Button>
                  </Link>
                  <Link to="/safety-tips">
                    <Button size="lg" variant="outline" className="h-20 px-12 text-2xl font-bold border-4 rounded-2xl hover:bg-secondary">
                      Safety Tips
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      <FeaturesSection />

      {/* CTA Section - only for guests */}
      {!isLoggedIn && (
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
      )}

      {/* Footer */}
      <footer className="border-t-2 py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <img src="/favicon.png" alt="SurakshaNet Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-xl" />
            <span className="font-display font-extrabold text-3xl md:text-4xl text-foreground tracking-tight">
              Suraksha<span className="text-red-600">Net</span>
            </span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-muted-foreground text-center md:text-right">© 2026 SurakshaNet. Stay safe, stay empowered.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
