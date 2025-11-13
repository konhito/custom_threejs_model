"use client";
import { useState } from "react";
import QRCodeAccessGate from "../../components/QRCodeAccessGate";
import { Mail, MessageCircle, Send, Heart, BookOpen, Sparkles } from "lucide-react";

export default function ContactAuthorPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'question' // question, feedback, criticism, idea
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Create mailto link with form data
      const subject = encodeURIComponent(
        formData.subject || 
        `Contact from QR Code Access - ${formData.type === 'question' ? 'Question' : formData.type === 'feedback' ? 'Feedback' : formData.type === 'criticism' ? 'Criticism' : 'Idea'}`
      );
      const body = encodeURIComponent(
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Type: ${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}\n\n` +
        `Message:\n${formData.message}`
      );
      
      // Open email client
      window.location.href = `mailto:partnerships@asociacionnahiara.org?subject=${subject}&body=${body}`;
      
      // Show success message
      setSubmitStatus('success');
      setTimeout(() => {
        setSubmitStatus(null);
        setFormData({ name: '', email: '', subject: '', message: '', type: 'question' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <QRCodeAccessGate>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
        </div>

        <main className="relative pt-8 px-4 lg:px-8 pb-16">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <header className="text-center mb-12">
              <div className="inline-block mb-4">
                <MessageCircle className="w-16 h-16 text-green-600 mx-auto" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4 leading-tight" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Contact the Author
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Crimson Text, serif' }}>
                A direct channel to share your thoughts, questions, and feedback about the Nahiara Universe
              </p>
            </header>

            {/* Introduction Card */}
            <div className="bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/50 mb-8">
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed" style={{ fontFamily: 'Crimson Text, serif' }}>
                <p className="text-xl font-semibold text-gray-800">
                  Thank you for scanning the QR code and reaching out directly.
                </p>
                <p>
                  This space is reserved for those who have received my business card and wish to engage in a meaningful dialogue about the Nahiara Universe.
                </p>
                <p>
                  Whether you have a <span className="font-semibold text-green-700">question</span>, <span className="font-semibold text-emerald-700">feedback</span>, <span className="font-semibold text-teal-700">constructive criticism</span>, or an <span className="font-semibold text-cyan-700">idea</span> to share, your voice is welcome here.
                </p>
                <p className="italic text-gray-600 pt-4 border-t border-gray-200">
                  Every authentic conversation helps Nahiara bloom.
                </p>
                <p className="text-right text-lg font-bold text-gray-900 pt-2">
                  – Matías González
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/50">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Send className="w-6 h-6 text-green-600" />
                Send Your Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Message Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                    What would you like to share?
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900"
                  >
                    <option value="question" className="text-gray-900">A Question</option>
                    <option value="feedback" className="text-gray-900">Feedback</option>
                    <option value="criticism" className="text-gray-900">Constructive Criticism</option>
                    <option value="idea" className="text-gray-900">An Idea</option>
                  </select>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900 placeholder:text-gray-400"
                    placeholder="Enter your name"
                    aria-required="true"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900 placeholder:text-gray-400"
                    placeholder="your@email.com"
                    aria-required="true"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject (Optional)
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900 placeholder:text-gray-400"
                    placeholder="Brief subject line"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={8}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none text-gray-900 placeholder:text-gray-400"
                    placeholder="Share your thoughts, questions, or feedback about the Nahiara Universe..."
                    aria-required="true"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.name.trim() || !formData.email.trim() || !formData.message.trim()}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg flex items-center justify-center gap-3"
                  aria-label="Send your message to the author"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                      <span>Opening Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" aria-hidden="true" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-center gap-3">
                    <Heart className="w-5 h-5 text-green-600" />
                    <span>Your email client should now be open. Thank you for reaching out!</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl">
                    <span>There was an error. Please try again or email directly at partnerships@asociacionnahiara.org</span>
                  </div>
                )}
              </form>
            </div>

            {/* Additional Info */}
            <div className="mt-8 bg-green-50/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200">
              <div className="flex items-start gap-4">
                <Sparkles className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">About This Channel</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    This contact form is exclusively available to those who have received a business card with a QR code. 
                    Your messages will be read personally, and I will respond to each one. Thank you for taking the time to engage with the Nahiara Universe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </QRCodeAccessGate>
  );
}



