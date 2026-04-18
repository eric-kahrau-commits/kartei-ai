import { Brain } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AiLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-600 flex items-center justify-center mb-6 shadow-2xl shadow-indigo-900/50"
      >
        <Brain size={28} className="text-white" />
      </motion.div>
      <h3 className="text-xl font-semibold text-white mb-2">KI analysiert deine Karten…</h3>
      <p className="text-slate-400 text-sm">Dies dauert einen Moment</p>
      <div className="flex gap-1.5 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            className="w-2 h-2 rounded-full bg-indigo-400"
          />
        ))}
      </div>
    </div>
  );
}
