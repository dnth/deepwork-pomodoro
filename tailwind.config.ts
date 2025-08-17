import type { Config } from "tailwindcss";

// all in fixtures is set to tailwind v3 as interims solutions

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
  	extend: {
  		spacing: {
  			'1': '4px',    // 4px base unit
  			'2': '8px',    // 8px
  			'3': '12px',   // 12px
  			'4': '16px',   // 16px
  			'6': '24px',   // 24px
  			'8': '32px',   // 32px
  			'12': '48px',  // 48px
  			'16': '64px',  // 64px
  			// Extended spacing for larger gaps
  			'20': '80px',  // 80px
  			'24': '96px',  // 96px
  			'32': '128px', // 128px
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			theme: {
  				'background-from': 'hsl(var(--theme-background-from))',
  				'background-via': 'hsl(var(--theme-background-via))',
  				'background-to': 'hsl(var(--theme-background-to))',
  				'card-bg': 'hsl(var(--theme-card-bg))',
  				'card-border': 'hsl(var(--theme-card-border))',
  				'text-primary': 'hsl(var(--theme-text-primary))',
  				'text-secondary': 'hsl(var(--theme-text-secondary))',
  				'text-muted': 'hsl(var(--theme-text-muted))',
  				'accent': 'hsl(var(--theme-accent))',
  				'accent-hover': 'hsl(var(--theme-accent-hover))',
  				'progress': 'hsl(var(--theme-progress))',
  				'progress-bg': 'hsl(var(--theme-progress-bg))',
  				'input-bg': 'hsl(var(--theme-input-bg))',
  				'input-border': 'hsl(var(--theme-input-border))',
  				'task-accent': 'hsl(var(--theme-task-accent))',
  				'task-bg': 'hsl(var(--theme-task-bg))',
  				'task-border': 'hsl(var(--theme-task-border))',
  				'task-text': 'hsl(var(--theme-task-text))'
  			}
  		},
  		fontSize: {
  			// Typographic scale based on 1.25 ratio
  			'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em' }],      // 12px - Small caps
  			'sm': ['0.9375rem', { lineHeight: '1.5' }],                             // 15px - Body text
  			'base': ['1.125rem', { lineHeight: '1.5' }],                            // 18px - Large body text
  			'lg': ['1.5rem', { lineHeight: '1.4' }],                                // 24px - UI elements
  			'xl': ['1.875rem', { lineHeight: '1.2' }],                              // 30px - Subheadings
  			'2xl': ['2.3125rem', { lineHeight: '1.2' }],                            // 37px - Headings
  			'3xl': ['2.875rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],   // 46px - Large headings
  		},
  		fontWeight: {
  			'light': '300',
  			'normal': '400',
  			'semibold': '600',
  			'bold': '700',
  		},
  		lineHeight: {
  			'tight': '1.25',
  			'normal': '1.5',
  			'relaxed': '1.625',
  		},
  		minHeight: {
  			'touch': '2.75rem', /* 44px WCAG minimum */
  		},
  		minWidth: {
  			'touch': '2.75rem', /* 44px WCAG minimum */
  		},
  		borderRadius: {
  			'xs': '2px',   // 2px - extra small radius
  			'sm': '4px',   // 4px - small radius
  			'DEFAULT': '8px',  // 8px - default radius
  			'md': '8px',   // 8px - medium radius (same as default)
  			'lg': '12px',  // 12px - large radius
  			'xl': '16px',  // 16px - extra large radius
  			// Keep original variable-based values for legacy compatibility
  			'legacy-lg': 'var(--radius)',
  			'legacy-md': 'calc(var(--radius) - 2px)',
  			'legacy-sm': 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
