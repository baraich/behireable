"use client";

import { LightbulbIcon, CheckIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Navbar from "@/app/components/Navbar";

export default function Home() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="container py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Resume,{" "}
              <span className="text-primary">AI-Optimized</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto md:mx-0">
              Upload your resume and job description - our AI will tailor your
              resume to match the role perfectly. Download your optimized PDF in minutes.
            </p>
            <button className="btn-primary text-base px-8 py-4">Get started →</button>
          </div>
          <div className="relative order-first md:order-last">
            <div className="bg-primary/10 absolute inset-0 rounded-2xl -rotate-6"></div>
            <Image
              src="https://images.unsplash.com/photo-1602407294553-6ac9170b3ed0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Resume Preview"
              width={600}
              height={400}
              className="rounded-2xl shadow-xl relative"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-primary font-bold text-xl">{index + 1}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">What Our Users Say</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            See how our AI-powered resume optimization has helped job seekers land their dream roles
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all"
              >
                {/* Quote Icon */}
                <div className="mb-6">
                  <svg
                    className="w-8 h-8 text-primary/20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                
                {/* Testimonial Content */}
                <blockquote className="mb-6">
                  <p className="text-foreground mb-4 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </blockquote>
                
                {/* Author */}
                <div className="flex items-center gap-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.author}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Moved below testimonials */}
      <section id="pricing" className="py-24">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            Choose the plan that best fits your needs. No hidden fees.
          </p>
          
          {/* Monthly/Yearly Toggle */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <span className={`text-sm ${!isYearly ? 'text-primary font-medium' : 'text-muted-foreground'}`}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-7 bg-primary rounded-full transition-colors"
            >
              <div className={`absolute top-1 ${isYearly ? 'left-8' : 'left-1'} w-5 h-5 bg-white rounded-full transition-all`} />
            </button>
            <span className={`text-sm ${isYearly ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
              Yearly <span className="text-xs text-primary">(Save 57%)</span>
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="border rounded-2xl p-8 hover:shadow-lg transition-shadow bg-white">
              <h3 className="font-semibold text-xl mb-2">Free</h3>
              <p className="text-4xl font-bold mb-6">$0</p>
              <ul className="space-y-4 mb-8">
                {freePlanFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckIcon className="w-5 h-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
                <li className="flex items-center gap-3 text-muted-foreground">
                  <XIcon className="w-5 h-5" />
                  <span>Coming Soon Features</span>
                </li>
              </ul>
              <button className="btn-secondary w-full text-base">Start Free</button>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-primary rounded-2xl p-8 bg-primary text-white relative">
              <h3 className="font-semibold text-xl mb-2">Pro</h3>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                  <div className="text-lg line-through opacity-75">
                    ${isYearly ? '299' : '39'}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${isYearly ? '129' : '29'}</span>
                    <span className="text-lg opacity-75">/{isYearly ? 'year' : 'month'}</span>
                  </div>
                </div>
                {isYearly && (
                  <p className="text-sm opacity-75">Billed annually</p>
                )}
              </div>
              <ul className="space-y-4 mb-8">
                {proPlanFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckIcon className="w-5 h-5 text-white" />
                    <span>{feature}</span>
                  </li>
                ))}
                <li className="flex items-center gap-3">
                  <CheckIcon className="w-5 h-5 text-white" />
                  <span>Coming Soon Features</span>
                </li>
              </ul>
              <button className="bg-white text-primary w-full btn-secondary text-base font-semibold border-0 hover:bg-gray-100">
                Get Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* CTA in FAQ Section */}
          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground mb-4">
              Still have questions? We're here to help!
            </p>
            <button className="btn-primary text-base px-8 py-4">
              Get started for free →
            </button>
          </div>
        </div>
      </section>

      {/* Footer with dark background */}
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Logo and Description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <LightbulbIcon className="w-6 h-6 text-primary" />
                <span className="font-bold text-xl">BeHireable</span>
              </div>
              <p className="text-gray-400 max-w-md">
                AI-powered resume optimization to help you land your dream job. Get your resume tailored perfectly for each application.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4 text-lg">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-gray-400 hover:text-primary transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4 text-lg">Contact</h3>
              <ul className="space-y-3">
                {contactInfo.map((info, index) => (
                  <li key={index} className="text-gray-400">
                    {info}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} BeHireable. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const steps = [
  {
    title: "Upload Resume",
    description: "Upload your current resume in PDF or Word format"
  },
  {
    title: "Add Job Link",
    description: "Paste the LinkedIn job posting URL you want to apply for"
  },
  {
    title: "AI Optimization",
    description: "Our AI analyzes the job requirements and optimizes your resume"
  },
  {
    title: "Download PDF",
    description: "Get your perfectly tailored resume ready for submission"
  }
];

const freePlanFeatures = [
  "1 Resume Optimization",
  "PDF Download",
  "Basic Support",
];

const proPlanFeatures = [
  "Unlimited Optimizations",
  "PDF Download",
  "Priority Support",
];

const quickLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" }
];

const contactInfo = [
  "support@behireable.com",
  "Terms & Conditions",
  "Privacy Policy"
];

const testimonials = [
  {
    quote: "Within minutes of uploading my resume and job description, I received a perfectly optimized version. Landed an interview at a top tech company the following week!",
    author: "David Chen",
    role: "Software Engineer at TechCorp",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces&auto=format&q=60"
  },
  {
    quote: "The optimization was spot-on! The AI perfectly highlighted my relevant experience for each job application. Simple upload and download process saved me hours.",
    author: "Sarah Miller",
    role: "Product Manager",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces&auto=format&q=60"
  },
  {
    quote: "BeHireable transformed my basic resume into a professional document that actually matched the job requirements. Worth every penny!",
    author: "James Wilson",
    role: "Business Analyst",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces&auto=format&q=60"
  }
];

const faqs = [
  {
    question: "How does the AI resume optimization work?",
    answer: "Our AI analyzes both your resume and the job description to identify key requirements and skills. It then restructures and enhances your resume to better match the job requirements while maintaining authenticity and accuracy."
  },
  {
    question: "How long does the optimization process take?",
    answer: "The entire process typically takes just a few minutes. You'll receive your optimized resume ready for download immediately after processing."
  },
  {
    question: "Can I use the optimized resume for multiple job applications?",
    answer: "While you can, we recommend optimizing your resume for each specific job application. Each role has unique requirements, and tailoring your resume accordingly significantly increases your chances of success."
  },
  {
    question: "Is my resume data kept confidential?",
    answer: "Absolutely. We take data privacy seriously. Your resume data is encrypted, processed securely, and automatically deleted after optimization. We never store or share your personal information."
  },
  {
    question: "What makes BeHireable different from other resume tools?",
    answer: "BeHireable uses advanced AI to provide real-time, job-specific optimization. Unlike generic resume builders, we analyze the actual job requirements and company context to create truly tailored resumes."
  }
];
