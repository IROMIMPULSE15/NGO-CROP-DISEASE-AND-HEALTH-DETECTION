"use client"

import Link from "next/link"
import { Leaf, Mail, Phone, MapPin, Github, Twitter, Linkedin, Heart } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-gradient-from to-gradient-to p-2.5 rounded-xl shadow-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl gradient-text">CropCare AI</span>
                <span className="text-xs text-muted-foreground font-medium tracking-wide">Smart Agriculture</span>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              Empowering farmers with cutting-edge AI technology for crop disease detection and treatment
              recommendations. Building a sustainable future for agriculture.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-surface rounded-lg"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-surface rounded-lg"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-surface rounded-lg"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6 text-foreground">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "Predict", href: "/predict" },
                { name: "Learn", href: "/learn" },
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 transform duration-200 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6 text-foreground">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-muted-foreground">
                <div className="bg-surface p-2 rounded-lg">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-sm">support@cropcare.ai</span>
              </li>
              <li className="flex items-center space-x-3 text-muted-foreground">
                <div className="bg-surface p-2 rounded-lg">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3 text-muted-foreground">
                <div className="bg-surface p-2 rounded-lg">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm">New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm flex items-center">
            &copy; {currentYear} CropCare AI. Made with <Heart className="h-4 w-4 mx-1 text-red-500 fill-current" />
            for farmers worldwide.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
