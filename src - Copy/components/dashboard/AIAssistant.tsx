import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const suggestions = [
  "Why is cardiac risk rising?",
  "Top 3 wards needing attention",
  "Forecast ICU load next 7 days",
];

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-white shadow-elevated"
        aria-label="AI Assistant"
      >
        {open ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glass-card fixed bottom-24 right-6 z-40 w-[340px] rounded-2xl p-4 shadow-elevated"
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">VitaAI Assistant</div>
                <div className="text-[10px] text-muted-foreground">Ask anything about your data</div>
              </div>
            </div>
            <div className="mb-3 rounded-xl bg-muted/40 p-3 text-xs">
              <p className="font-medium">Smart insight</p>
              <p className="mt-1 text-muted-foreground">
                Cardiac ward risk increased by <span className="text-destructive font-semibold">18%</span> this week.
                Consider reviewing staffing in Cardiology.
              </p>
            </div>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button key={s} className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] hover:bg-accent">
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Ask VitaAI…" className="h-9" />
              <Button size="icon" className="h-9 w-9 gradient-primary"><Send className="h-4 w-4" /></Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
