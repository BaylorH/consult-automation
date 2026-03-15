"use client";

import { motion } from "framer-motion";

function HandWrittenTitle({
    title = "Hand Written",
    subtitle = "",
}) {
    const draw = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { duration: 2.5, ease: [0.43, 0.13, 0.23, 0.96] },
                opacity: { duration: 0.5 },
            },
        },
    };

    return (
        <div className="relative inline-flex items-center px-[15px] py-[15px]">
            <div className="absolute inset-[-15px]">
                <motion.svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 200 80"
                    initial="hidden"
                    animate="visible"
                    className="w-full h-full"
                    preserveAspectRatio="none"
                >
                    <title>Proposals</title>
                    <motion.path
                        d="M 180 15
                           C 200 40, 190 65, 100 70
                           C 30 70, 10 55, 10 40
                           C 10 20, 40 10, 100 10
                           C 160 10, 180 25, 180 25"
                        fill="none"
                        strokeWidth="2"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={draw}
                        className="text-[#4a9380] opacity-90"
                    />
                </motion.svg>
            </div>
            <motion.p
                className="relative z-10 text-[18px] text-[#161616] font-['Avenir:Heavy',sans-serif]"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                {title}
            </motion.p>
            {subtitle && (
                <motion.span
                    className="relative z-10 text-[14px] text-[#666] font-['Avenir:Roman',sans-serif] ml-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                >
                    {subtitle}
                </motion.span>
            )}
        </div>
    );
}

export { HandWrittenTitle };
