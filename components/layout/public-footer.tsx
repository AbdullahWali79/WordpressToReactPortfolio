"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Heart,
} from "lucide-react";

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/about#team" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  services: [
    { label: "Web Development", href: "/services" },
    { label: "App Development", href: "/services" },
    { label: "SEO Services", href: "/services" },
    { label: "Training Programs", href: "/services" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Daily Inspiration", href: "/daily" },
    { label: "FAQ", href: "/faq" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300">
      {/* Main Footer Content */}
      <div className="container-main py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-2 text-2xl font-bold text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="text-xl font-bold">P</span>
                </div>
                <span>Portfolio</span>
              </div>
            </Link>
            <p className="max-w-sm text-slate-400 leading-relaxed">
              Building modern, SEO-friendly websites and applications with cutting-edge 
              technology. Transform your digital presence with our expert team.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:hello@example.com"
                className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors"
              >
                <Mail className="h-5 w-5 text-primary" />
                <span>hello@example.com</span>
              </a>
              <a
                href="tel:+923000000000"
                className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors"
              >
                <Phone className="h-5 w-5 text-primary" />
                <span>+92 300 0000000</span>
              </a>
              <div className="flex items-start gap-3 text-slate-400">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>123 Business District, Karachi, Pakistan</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-slate-400 hover:bg-primary hover:text-white transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-4 w-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-4 w-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-4 w-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-12 border-t border-slate-800">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Subscribe to our newsletter
              </h3>
              <p className="text-slate-400 text-sm">
                Get the latest updates, tips, and special offers delivered to your inbox.
              </p>
            </div>
            <form className="flex w-full lg:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-64 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container-main py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 flex items-center gap-1">
              © {currentYear} Portfolio. Made with <Heart className="h-4 w-4 text-destructive fill-destructive" /> in Pakistan
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              {footerLinks.legal.map((link, index) => (
                <span key={link.href} className="flex items-center gap-6">
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                  {index < footerLinks.legal.length - 1 && (
                    <span className="hidden md:inline">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
