import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				brand: {
					page: '#EAF6F9',
					accent: '#38BDF8',
					'accent-deep': '#0EA5E9',
					surface: '#FFFFFF',
					ink: '#0F172A',
					muted: '#64748B',
				},
			},
			boxShadow: {
				float: '0 22px 60px -24px rgb(15 23 42 / 0.12), 0 8px 24px -12px rgb(15 23 42 / 0.06)',
				soft: '0 2px 12px rgb(15 23 42 / 0.06)',
			},
			borderRadius: {
				'4xl': '2rem',
			},
		},
	},
	plugins: [typography],
};
