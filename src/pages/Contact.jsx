import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from "react-hot-toast"

// Simple email regex for basic validation
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Contact(){
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    description: false,
  });

 //LIVE VALIDATION — RUNS ON EVERY KEYSTROKE
  useEffect(() => {
    const newErrors = {};

    if (touched.fullName) {
      if (!fullName.trim()) {
        newErrors.fullName = "Full name is required";
      } else if (fullName.trim().length < 3) {
        newErrors.fullName = "Full name must be at least 3 characters";
      } else if (!/^[a-zA-Z\s]+$/.test(fullName)) {
        newErrors.fullName = "Full name can only contain letters";
      }
    }

    if (touched.email) {
      if (!email.trim()) {
        newErrors.email = "Email is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
      ) {
        newErrors.email = "Invalid email address";
      }
    }

    if (touched.description) {
      if (!description.trim()) {
        newErrors.description = "Description is required";
      } else if (description.trim().length < 10) {
        newErrors.description = "At least 10 characters required";
      }
    }

    setErrors(newErrors);
  }, [fullName, email, description, touched]);


   const onSubmit = (e) => {
    e.preventDefault();

    setTouched({
      fullName: true,
      email: true,
      description: true,
    });

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors first");
      return;
    }

    // ✅ FAKE SEND (UI ONLY)
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success("Message sent!");

      setTimeout(() => {
        onClear();
        setSubmitted(false);
      }, 3000);

    }, 2000); // 2 seconds delay
  };


  // SUBMIT HANDLER (ONLY CHECKS IF ERRORS STILL EXIST)
  
  // ✅ CLEAR FORM
  const onClear = () => {
    setFullName("");
    setEmail("");
    setDescription("");
    setErrors({});
  };

  

  // Contact details (editable)
  const contactEmail = 'acnwa1234@gmail.com'
  const phoneNumber = '+1249165587681' // international format required for tel/whatsapp
  const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g,'')}?text=${encodeURIComponent('Hello Anayo!')}`

  return (
    <section id="contact" className="py-16">
      <h2 className="text-2xl font-bold text-white mb-6">Contact</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-panel p-6 rounded-xl neon-glow"
        >
          <label className="block text-sm text-gray-300 mb-2">Full Name</label>
          <input
            value={fullName}
            onChange={(e) => {
               setFullName(e.target.value)
               setTouched((prev) => ({ ...prev, fullName: true }));
            }}
            className="w-full p-3 rounded bg-gray-900 text-gray-200 mb-2 input-glow"
            placeholder="Your full name"
          />
          {errors.fullName && (
            <p className="text-xs text-rose-400 mb-2">{errors.fullName}</p>
          )}

          <label className="block text-sm text-gray-300 mb-2">Email</label>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setTouched((prev) => ({ ...prev, email: true }));
            }}
            className="w-full p-3 rounded bg-gray-900 text-gray-200 mb-2 input-glow"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-xs text-rose-400 mb-2">{errors.email}</p>
          )}

          <label className="block text-sm text-gray-300 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              setTouched((prev) => ({ ...prev, description: true }));
            }}
            className="w-full p-3 rounded bg-gray-900 text-gray-200 mb-3 input-glow"
            rows={6}
            placeholder="Tell me about your project or inquiry"
          />
          {errors.description && (
            <p className="text-xs text-rose-400 mb-2">{errors.description}</p>
          )}

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-neon-cyan text-black rounded font-semibold"
            >
              {isSubmitting ? "Sending..." : submitted ? "Sent ✓" : "Send Message"}
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              onClick={onClear}
              className="px-4 py-2 border border-gray-700 text-gray-200 rounded"
            >
              Clear
            </motion.button>
          </div>
        </motion.form>


        <div className="flex flex-col gap-4 justify-center">
          <div className="bg-panel p-6 rounded-xl">
            <h4 className="text-sm font-medium text-gray-100 mb-2">Get in touch</h4>
            <p className="text-gray-300 text-sm mb-3">Email: <a className="text-neon-cyan hover:underline" href={`mailto:${contactEmail}`}>{contactEmail}</a></p>
            <p className="text-gray-300 text-sm mb-3">Phone: <a className="text-neon-cyan hover:underline" href={`tel:${phoneNumber}`}>{phoneNumber}</a></p>
            <div className="flex gap-3 mt-2">
              <a className="px-3 py-2 bg-gray-800 rounded text-gray-200" href={`mailto:${contactEmail}`}>Email</a>
              <a className="px-3 py-2 bg-gray-800 rounded text-gray-200" href={whatsappLink} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a className="px-3 py-2 bg-gray-800 rounded text-gray-200" href="https://github.com/anayolico" target="_blank" rel="noopener noreferrer">GitHub</a>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
