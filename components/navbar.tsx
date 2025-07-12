"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Leaf, Sun, Moon, User, LogOut, Sparkles } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const { language, setLanguage } = useLanguage()

  const navigation = [
    { name: language === "en" ? "Home" : "होम", href: "/" },
    { name: language === "en" ? "Predict" : "पहचान", href: "/predict" },
    { name: language === "en" ? "Learn" : "सीखें", href: "/learn" },
    { name: language === "en" ? "About" : "हमारे बारे में", href: "/about" },
    { name: language === "en" ? "Contact" : "संपर्क", href: "/contact" },
  ]

  if (user) {
    navigation.push({ name: language === "en" ? "My Scans" : "मेरे स्कैन", href: "/my-scans" })
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 mr-8">
          <div className="relative">
            <div className="bg-gradient-to-br from-gradient-from to-gradient-to p-2.5 rounded-xl shadow-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="h-3 w-3 text-gradient-from animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xl gradient-text">CropCare AI</span>
            <span className="text-xs text-muted-foreground font-medium tracking-wide">Smart Agriculture</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1 flex-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-surface-hover",
                pathname === item.href
                  ? "text-primary bg-surface shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.name}
              {pathname === item.href && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 p-0 hover:bg-surface-hover transition-all duration-200"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4 transition-transform duration-200" />
            ) : (
              <Sun className="h-4 w-4 transition-transform duration-200" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Language Toggle */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
            className="h-9 px-2 text-sm bg-transparent border border-border rounded-md hover:bg-surface-hover transition-colors"
          >
            <option value="en">EN</option>
            <option value="hi">हिं</option>
          </select>

          {/* Auth Section */}
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-surface rounded-lg">
                <div className="w-6 h-6 bg-gradient-to-br from-gradient-from to-gradient-to rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-medium text-foreground">{user.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="h-9 px-3 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild className="hover:bg-surface-hover">
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild className="btn-hover-lift bg-gradient-to-r from-gradient-from to-gradient-to">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden h-9 w-9 p-0">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] glass">
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary py-3 px-2 rounded-lg",
                      pathname === item.href ? "text-primary bg-surface" : "text-muted-foreground",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}

                {!user && (
                  <div className="flex flex-col space-y-3 pt-6 border-t border-border">
                    <Button variant="outline" asChild>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button asChild className="bg-gradient-to-r from-gradient-from to-gradient-to">
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
