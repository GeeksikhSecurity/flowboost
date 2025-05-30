import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

export function FeedbackButton() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await fetch('/api/user/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback })
      });
      
      setIsSubmitted(true);
      setFeedback('');
      
      // Auto close after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => setIsSubmitted(false), 300);
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-primary-600 text-white p-3 rounded-full shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageSquare size={24} />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Share Your Feedback</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <h4 className="text-xl font-medium text-primary-600 mb-2">Thank You!</h4>
                  <p className="text-gray-600">Your feedback helps us improve FlowBoost AI.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <p className="text-gray-600 mb-4">
                    We'd love to hear your thoughts on how we can make FlowBoost AI better for you.
                  </p>
                  
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="input-field min-h-[120px]"
                    placeholder="What's working well? What could be improved?"
                    required
                  />
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={!feedback.trim() || isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Feedback'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}