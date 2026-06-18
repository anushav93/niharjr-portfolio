'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = useCallback(() => {
        setIsVisible(window.pageYOffset > 500);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, [toggleVisibility]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{
                        opacity: { duration: 0.25, ease: 'easeOut' },
                        scale: { duration: 0.25, ease: 'easeOut' },
                        y: {
                            type: 'spring',
                            stiffness: 380,
                            damping: 14,
                            mass: 0.55,
                        },
                    }}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="fixed bottom-16 right-5 z-50 border border-stone-500 bg-[#d7cbc1] p-2 hover:border-primary-400"
                    onClick={scrollToTop}
                    aria-label="Back to top"
                >
                    <ChevronUpIcon className="text-primary-500" width={35} height={35} />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
