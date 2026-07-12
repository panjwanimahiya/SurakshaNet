import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function AnimatedSplash({ children }: { children: React.ReactNode }) {
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        // Hide splash screen after 2.5 seconds
        const timer = setTimeout(() => setShowSplash(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <AnimatePresence>
                {showSplash && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="flex flex-col items-center"
                        >
                            <div className="relative flex justify-center items-center">
                                <motion.img
                                    src="/favicon.png"
                                    alt="SurakshaNet Logo"
                                    className="relative w-48 h-48 md:w-64 md:h-64 object-contain"
                                    animate={{
                                        y: [0, -15, 0],
                                        scale: [1, 1.05, 1]
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            </div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                                className="mt-8 font-display font-extrabold text-5xl md:text-6xl text-foreground text-center"
                            >
                                Suraksha<span className="text-primary">Net</span>
                                <p className="text-xl md:text-2xl text-muted-foreground mt-3 font-body font-light tracking-[0.2em] uppercase">One Signal. Help. Anywhere.</p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className={showSplash ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}>
                {children}
            </div>
        </>
    );
}
