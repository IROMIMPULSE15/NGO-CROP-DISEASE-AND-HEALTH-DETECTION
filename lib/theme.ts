export const themes = {
  light: {
    // Primary colors
    primary: "hsl(142, 76%, 36%)", // Emerald green
    primaryForeground: "hsl(0, 0%, 98%)",
    secondary: "hsl(210, 40%, 98%)",
    secondaryForeground: "hsl(222.2, 84%, 4.9%)",

    // Background colors
    background: "hsl(0, 0%, 100%)",
    foreground: "hsl(222.2, 84%, 4.9%)",

    // Card colors
    card: "hsl(0, 0%, 100%)",
    cardForeground: "hsl(222.2, 84%, 4.9%)",

    // Muted colors
    muted: "hsl(210, 40%, 96%)",
    mutedForeground: "hsl(215.4, 16.3%, 46.9%)",

    // Accent colors
    accent: "hsl(210, 40%, 96%)",
    accentForeground: "hsl(222.2, 84%, 4.9%)",

    // Border and input
    border: "hsl(214.3, 31.8%, 91.4%)",
    input: "hsl(214.3, 31.8%, 91.4%)",
    ring: "hsl(142, 76%, 36%)",

    // Status colors
    destructive: "hsl(0, 84.2%, 60.2%)",
    destructiveForeground: "hsl(210, 40%, 98%)",
    warning: "hsl(38, 92%, 50%)",
    warningForeground: "hsl(0, 0%, 98%)",
    success: "hsl(142, 76%, 36%)",
    successForeground: "hsl(0, 0%, 98%)",

    // Gradient colors
    gradientFrom: "hsl(142, 76%, 36%)",
    gradientTo: "hsl(158, 64%, 52%)",

    // Surface colors
    surface: "hsl(0, 0%, 98%)",
    surfaceHover: "hsl(210, 40%, 96%)",
  },
  dark: {
    // Primary colors
    primary: "hsl(142, 76%, 36%)",
    primaryForeground: "hsl(0, 0%, 98%)",
    secondary: "hsl(217.2, 32.6%, 17.5%)",
    secondaryForeground: "hsl(210, 40%, 98%)",

    // Background colors
    background: "hsl(222.2, 84%, 4.9%)",
    foreground: "hsl(210, 40%, 98%)",

    // Card colors
    card: "hsl(217.2, 32.6%, 17.5%)",
    cardForeground: "hsl(210, 40%, 98%)",

    // Muted colors
    muted: "hsl(217.2, 32.6%, 17.5%)",
    mutedForeground: "hsl(215, 20.2%, 65.1%)",

    // Accent colors
    accent: "hsl(217.2, 32.6%, 17.5%)",
    accentForeground: "hsl(210, 40%, 98%)",

    // Border and input
    border: "hsl(217.2, 32.6%, 17.5%)",
    input: "hsl(217.2, 32.6%, 17.5%)",
    ring: "hsl(142, 76%, 36%)",

    // Status colors
    destructive: "hsl(0, 62.8%, 30.6%)",
    destructiveForeground: "hsl(210, 40%, 98%)",
    warning: "hsl(38, 92%, 50%)",
    warningForeground: "hsl(222.2, 84%, 4.9%)",
    success: "hsl(142, 76%, 36%)",
    successForeground: "hsl(0, 0%, 98%)",

    // Gradient colors
    gradientFrom: "hsl(142, 76%, 36%)",
    gradientTo: "hsl(158, 64%, 52%)",

    // Surface colors
    surface: "hsl(217.2, 32.6%, 17.5%)",
    surfaceHover: "hsl(217.2, 32.6%, 20%)",
  },
}

export type Theme = "light" | "dark"
export type ThemeColors = typeof themes.light
