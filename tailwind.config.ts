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
  			},
  			prussian_blue: {
  				DEFAULT: '#012a4a',
  				100: '#00090f',
  				200: '#00111e',
  				300: '#011a2d',
  				400: '#01233c',
  				500: '#012a4a',
  				600: '#025ca1',
  				700: '#048df6',
  				800: '#54b4fc',
  				900: '#aad9fe'
  			},
  			indigo_dye_1: {
  				DEFAULT: '#013a63',
  				100: '#000c14',
  				200: '#001828',
  				300: '#01243d',
  				400: '#012f51',
  				500: '#013a63',
  				600: '#026bb6',
  				700: '#0d99fd',
  				800: '#5dbbfd',
  				900: '#aeddfe'
  			},
  			indigo_dye_2: {
  				DEFAULT: '#01497c',
  				100: '#000f19',
  				200: '#011e32',
  				300: '#012c4c',
  				400: '#013b65',
  				500: '#01497c',
  				600: '#0277ca',
  				700: '#1c9ffd',
  				800: '#68bffd',
  				900: '#b3dffe'
  			},
  			indigo_dye_3: {
  				DEFAULT: '#014f86',
  				100: '#000f1a',
  				200: '#001f35',
  				300: '#002e4f',
  				400: '#013e6a',
  				500: '#014f86',
  				600: '#0179cf',
  				700: '#1ea0fe',
  				800: '#69c0fe',
  				900: '#b4dfff'
  			},
  			ucla_blue: {
  				DEFAULT: '#2a6f97',
  				100: '#09161e',
  				200: '#112d3c',
  				300: '#1a435b',
  				400: '#225979',
  				500: '#2a6f97',
  				600: '#3a93c7',
  				700: '#6baed5',
  				800: '#9cc9e3',
  				900: '#cee4f1'
  			},
  			cerulean: {
  				DEFAULT: '#2c7da0',
  				100: '#091920',
  				200: '#123240',
  				300: '#1a4b60',
  				400: '#236480',
  				500: '#2c7da0',
  				600: '#3fa1ca',
  				700: '#6fb8d8',
  				800: '#9fd0e5',
  				900: '#cfe7f2'
  			},
  			air_force_blue: {
  				DEFAULT: '#468faf',
  				100: '#0e1d23',
  				200: '#1c3946',
  				300: '#2a5669',
  				400: '#38738c',
  				500: '#468faf',
  				600: '#67a7c3',
  				700: '#8dbdd2',
  				800: '#b3d3e1',
  				900: '#d9e9f0'
  			},
  			air_superiority_blue: {
  				DEFAULT: '#61a5c2',
  				100: '#10222a',
  				200: '#214454',
  				300: '#31677e',
  				400: '#4189a7',
  				500: '#61a5c2',
  				600: '#81b7ce',
  				700: '#a0c9da',
  				800: '#c0dbe6',
  				900: '#dfedf3'
  			},
  			sky_blue: {
  				DEFAULT: '#89c2d9',
  				100: '#112b35',
  				200: '#22566a',
  				300: '#34819f',
  				400: '#52a6c7',
  				500: '#89c2d9',
  				600: '#a0cee0',
  				700: '#b7dae8',
  				800: '#cfe6f0',
  				900: '#e7f3f7'
  			},
  			light_blue: {
  				DEFAULT: '#a9d6e5',
  				100: '#12333d',
  				200: '#25657b',
  				300: '#3798b8',
  				400: '#6bb9d3',
  				500: '#a9d6e5',
  				600: '#badeea',
  				700: '#cbe6f0',
  				800: '#dceff5',
  				900: '#eef7fa'
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
  		boxShadow: {
  			'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  			'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  			'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  			'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  			'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  			'2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  			'3xl': '0 35px 60px -15px rgb(0 0 0 / 0.3)',
  			'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  			'inner-md': 'inset 0 4px 8px 0 rgba(0, 0, 0, 0.08)',
  			'inner-lg': 'inset 0 8px 16px 0 rgba(0, 0, 0, 0.12)',
  			'none': 'none',
  			// Premium shadow layers for cards
  			'premium-xs': '0 1px 2px 0 rgba(0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.06)',
  			'premium-sm': '0 2px 4px 0 rgba(0, 0, 0, 0.06), 0 4px 6px -1px rgba(0, 0, 0, 0.08)',
  			'premium-md': '0 4px 8px 0 rgba(0, 0, 0, 0.08), 0 6px 12px -2px rgba(0, 0, 0, 0.1)',
  			'premium-lg': '0 8px 16px 0 rgba(0, 0, 0, 0.1), 0 12px 24px -4px rgba(0, 0, 0, 0.12)',
  			'premium-xl': '0 16px 32px 0 rgba(0, 0, 0, 0.12), 0 24px 48px -8px rgba(0, 0, 0, 0.15)',
  			'premium-2xl': '0 24px 48px 0 rgba(0, 0, 0, 0.15), 0 32px 64px -12px rgba(0, 0, 0, 0.18)',
  			// Soft shadows for light themes
  			'soft-xs': '0 1px 2px 0 rgba(0, 0, 0, 0.02), 0 1px 3px 0 rgba(0, 0, 0, 0.03)',
  			'soft-sm': '0 2px 4px 0 rgba(0, 0, 0, 0.03), 0 4px 6px -1px rgba(0, 0, 0, 0.04)',
  			'soft-md': '0 4px 8px 0 rgba(0, 0, 0, 0.04), 0 6px 12px -2px rgba(0, 0, 0, 0.05)',
  			'soft-lg': '0 8px 16px 0 rgba(0, 0, 0, 0.05), 0 12px 24px -4px rgba(0, 0, 0, 0.06)',
  			'soft-xl': '0 16px 32px 0 rgba(0, 0, 0, 0.06), 0 24px 48px -8px rgba(0, 0, 0, 0.08)',
  			// Elevated shadows for dark themes
  			'elevated-xs': '0 1px 2px 0 rgba(0, 0, 0, 0.15), 0 1px 3px 0 rgba(0, 0, 0, 0.12)',
  			'elevated-sm': '0 2px 4px 0 rgba(0, 0, 0.18), 0 4px 6px -1px rgba(0, 0, 0, 0.15)',
  			'elevated-md': '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 12px -2px rgba(0, 0, 0, 0.18)',
  			'elevated-lg': '0 8px 16px 0 rgba(0, 0, 0, 0.22), 0 12px 24px -4px rgba(0, 0, 0, 0.2)',
  			'elevated-xl': '0 16px 32px 0 rgba(0, 0, 0, 0.25), 0 24px 48px -8px rgba(0, 0, 0, 0.22)',
  			// Colored shadows using theme variables
  			'theme-xs': '0 1px 2px 0 hsl(var(--theme-accent) / 0.1), 0 1px 3px 0 hsl(var(--theme-accent) / 0.08)',
  			'theme-sm': '0 2px 4px 0 hsl(var(--theme-accent) / 0.12), 0 4px 6px -1px hsl(var(--theme-accent) / 0.1)',
  			'theme-md': '0 4px 8px 0 hsl(var(--theme-accent) / 0.15), 0 6px 12px -2px hsl(var(--theme-accent) / 0.12)',
  			'theme-lg': '0 8px 16px 0 hsl(var(--theme-accent) / 0.18), 0 12px 24px -4px hsl(var(--theme-accent) / 0.15)',
  			'theme-xl': '0 16px 32px 0 hsl(var(--theme-accent) / 0.2), 0 24px 48px -8px hsl(var(--theme-accent) / 0.18)',
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
  			},
  			'fade-in': {
  				from: {
  					opacity: '0',
  					transform: 'translateY(10px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'fade-out': {
  				from: {
  					opacity: '1',
  					transform: 'translateY(0)'
  				},
  				to: {
  					opacity: '0',
  					transform: 'translateY(10px)'
  				}
  			},
  			'bounce-in': {
  				'0%': {
  					opacity: '0',
  					transform: 'scale(0.3)'
  				},
  				'50%': {
  					opacity: '1',
  					transform: 'scale(1.05)'
  				},
  				'70%': {
  					transform: 'scale(0.9)'
  				},
  				'100%': {
  					transform: 'scale(1)'
  				}
  			},
  			'pulse-glow': {
  				'0%': {
  					boxShadow: '0 0 5px hsl(var(--theme-accent) / 0.5)'
  				},
  				'50%': {
  					boxShadow: '0 20px hsl(var(--theme-accent) / 0.8)'
  				},
  				'10%': {
  					boxShadow: '0 0 5px hsl(var(--theme-accent) / 0.5)'
  				}
  			},
  			'shake': {
  				'0%, 100%': {
  					transform: 'translateX(0)'
  				},
  				'25%': {
  					transform: 'translateX(-5px)'
  				},
  				'75%': {
  					transform: 'translateX(5px)'
  				}
  			},
  			'success-celebration': {
  				'0%': {
  					transform: 'scale(1)',
  					boxShadow: '0 0 hsl(var(--theme-progress) / 0.7)'
  				},
  				'50%': {
  					transform: 'scale(1.05)',
  					boxShadow: '0 0 10px hsl(var(--theme-progress) / 0.3)'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					boxShadow: '0 0 0 20px hsl(var(--theme-progress) / 0)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-in': 'fade-in 0.3s ease-in-out',
  			'fade-out': 'fade-out 0.3s ease-in-out',
  			'bounce-in': 'bounce-in 0.6s ease-out',
  			'pulse-glow': 'pulse-glow 2s infinite',
  			'shake': 'shake 0.5s ease-in-out',
  			'success-celebration': 'success-celebration 0.8s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
