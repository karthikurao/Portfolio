// src/components/ContactSection.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from "sonner"
import { Github, Linkedin, Instagram, Twitter, Send, Loader2 } from 'lucide-react'
import { useCursor } from '@/context/CursorContext'; // <-- ENSURE IMPORT IS PRESENT

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
})

export default function ContactSection() {
  const { setVariant } = useCursor(); // <-- GET setVariant
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', message: '' },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const response = await fetch('https://formspree.io/f/mpwdgonl', { // Replace with your Formspree URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        toast.success("Message Sent! 🚀", {
            description: "Thank you for reaching out. I'll get back to you soon.",
        });
        form.reset()
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Uh oh! Something went wrong.", {
        description: "There was a problem sending your message. Please try again.",
      })
    } finally {
        setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 px-4 bg-slate-900 text-white">
      <div className="container mx-auto max-w-2xl">
        <motion.h2 /* ...title... */ > Get In Touch </motion.h2>
        <motion.p /* ...subtitle... */ > Have a question or want to work together? Leave a message! </motion.p>

        <motion.form
          onSubmit={form.handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-6"
        >
          {/* ... form fields (name, email, message) ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">Name</Label>
              <Input id="name" {...form.register('name')} className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500" placeholder="Your Name" suppressHydrationWarning={true}/>
              {form.formState.errors.name && <p className="text-red-400 text-sm pt-1">{form.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input id="email" type="email" {...form.register('email')} className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500" placeholder="your.email@example.com" suppressHydrationWarning={true}/>
              {form.formState.errors.email && <p className="text-red-400 text-sm pt-1">{form.formState.errors.email.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-slate-300">Message</Label>
            <Textarea id="message" {...form.register('message')} className="bg-slate-800 border-slate-700 text-white min-h-[150px] placeholder:text-slate-500 focus:border-purple-500" placeholder="Your message here..." suppressHydrationWarning={true}/>
            {form.formState.errors.message && <p className="text-red-400 text-sm pt-1">{form.formState.errors.message.message}</p>}
          </div>
          <div className="text-center pt-2">
            <Button 
                type="submit" 
                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-base rounded-lg transition-transform transform hover:scale-105" 
                disabled={isSubmitting}
                onMouseEnter={() => setVariant('link-hover')} // <-- ADDED
                onMouseLeave={() => setVariant('default')}   // <-- ADDED
            >
                {isSubmitting ? ( <Loader2 className="mr-2 h-5 w-5 animate-spin" /> ) : ( <Send className="mr-2 h-5 w-5" /> )}
              Send Message
            </Button>
          </div>
        </motion.form>
        
        <div className="mt-16 flex justify-center gap-8">
            <motion.a 
                href="https://www.linkedin.com/in/karthik-u-rao" target="_blank" rel="noopener noreferrer" 
                className="text-slate-400 hover:text-purple-400 transition-colors"
                whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setVariant('link-hover')} // <-- ADDED
                onMouseLeave={() => setVariant('default')}   // <-- ADDED
                aria-label="LinkedIn Profile"
            ><Linkedin size={32} /></motion.a>
            <motion.a 
                href="https://github.com/your-username" target="_blank" rel="noopener noreferrer" 
                className="text-slate-400 hover:text-purple-400 transition-colors"
                whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setVariant('link-hover')} // <-- ADDED
                onMouseLeave={() => setVariant('default')}   // <-- ADDED
                aria-label="GitHub Profile"
            ><Github size={32} /></motion.a>
            <motion.a 
                href="https://instagram.com/your-instagram-username" target="_blank" rel="noopener noreferrer" 
                className="text-slate-400 hover:text-purple-400 transition-colors"
                whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setVariant('link-hover')} // <-- ADDED
                onMouseLeave={() => setVariant('default')}   // <-- ADDED
                aria-label="Instagram Profile"
            ><Instagram size={32} /></motion.a>
            <motion.a 
                href="https://x.com/your-twitter-username" target="_blank" rel="noopener noreferrer" 
                className="text-slate-400 hover:text-purple-400 transition-colors"
                whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setVariant('link-hover')} // <-- ADDED
                onMouseLeave={() => setVariant('default')}   // <-- ADDED
                aria-label="Twitter Profile"
            ><Twitter size={32} /></motion.a>
        </div>
      </div>
    </section>
  )
}