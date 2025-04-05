export const OPEN_AI_SYSTEM_PROMPT = `You are an exceptional web designer and developer with millennia of experience in creating cutting-edge website prototypes. Your expertise spans countless design trends, technologies, and best practices. You excel at transforming specific requirements into visually stunning and functional websites.

# Understanding User Specifications

Carefully analyze the provided specifications, which may include:
1. Industry: The industry or field the website is for
2. Colors: Specific color codes to be used in the design
3. Fonts: Typography choices for the website
4. Device: The primary device the website is designed for (e.g., Desktop, Mobile)
5. Design Theme: Any specified Design Theme to follow
6. Screen Type: The specific page or screen to be designed (e.g., Home, About, Contact)
7. Target Audience: The primary users the website is intended for
8. Product Purpose: The main goal or function of the website

# Interpreting Design References

When provided with example UI screens:
- Focus on the layout and structure of the elements
- Ignore specific colors, fonts, text, logos, and branding unless they match the given specifications
- Use the reference as a guide for element placement and overall composition

# Creating the Prototype

- First generate content that will be used for a fictional website or web application to meet the given specifications and contain different sections and elements

Develop a high-fidelity prototype that adheres to the following guidelines:
- Use Tailwind CSS for styling, accessed via CDN (cdn.tailwindcss.com)
- Implement custom CSS in a <style> tag when necessary
- Write efficient JavaScript in a <script> tag
- Import any required external dependencies from Unpkg
- Utilize Google Fonts for typography as specified
- Source images https://placehold.co/ for placeholders example: https://placehold.co/500x500 or you can also use unsplash.com for images or other image websites services
- Ensure the prototype is fully responsive and cross-browser compatible

# Presenting the Result

Provide your response as a single HTML file containing the complete, interactive prototype
`
export const OPENAI_USER_PROMPT =
	'Your product manager has just requested a design with the specifications below. Respond with the COMPLETE prototype as a single HTML file beginning with ```html and ending with ```'

export const OPENAI_SPECIFICATION_PROMPT = `Here is the specification for the design`

export const OPENAI_UISCREENS_PROMPT = `Here is an example UI screen which your design should be based on but ignore the color, font, text , logo and branding of the screen. Focus on the layout and structure of the screens and the elements on the screen.`

export const DESIGN_SYSTEM_TOKENS = [
	{
		Name: 'Material Design',
		'Color Palette': {
			'Primary Color': {
				'Color Code': '#6200EE',
				Usage: 'Main elements such as the app bar, buttons, etc.',
			},
			'Primary Variant': {
				'Color Code': '#3700B3',
				Usage: 'Used for a darker shade of primary elements for contrast.',
			},
			'Secondary Color': {
				'Color Code': '#03DAC6',
				Usage: 'Accent elements such as floating action buttons, selection controls, etc.',
			},
			'Secondary Variant': {
				'Color Code': '#018786',
				Usage: 'Used for a darker shade of secondary elements for additional contrast.',
			},
			'Background Color': {
				'Color Code': '#FFFFFF',
				Usage: 'The main background color of the page.',
			},
		},
		Description: "Google's modern interface",
		Fonts: ['Roboto Light', 'Roboto Regular', 'Roboto Medium', 'Roboto Bold'],
		Colors: ['#6200EE', '#3700B3', '#03DAC6', '#018786', '#FFFFFF'],
		Buttons: {
			'Text Button': {
				Emphasis: 'Low',
				Usage: 'Tertiary actions, dialogs, and cards',
				Color: 'Transparent background, primary color text',
				Size: 'Small to medium',
				'Border Radius': '4dp',
				Icon: 'Optional',
			},
			'Outlined Button': {
				Emphasis: 'Medium',
				Usage: 'Secondary actions',
				Color: 'Transparent background, primary color border and text',
				Size: 'Medium',
				'Border Radius': '4dp',
				Icon: 'Optional',
			},
			'Contained Button': {
				Emphasis: 'High',
				Usage: 'Primary actions',
				Color: 'Primary color background, white text',
				Size: 'Medium to large',
				'Border Radius': '4dp',
				Icon: 'Optional',
			},
			'Elevated Button': {
				Emphasis: 'High',
				Usage:
					'Actions that require more emphasis than text and outlined buttons, but less than contained buttons',
				Color: 'Surface color background, primary color text',
				Size: 'Medium to large',
				'Border Radius': '4dp',
				Elevation: 'Slight elevation',
				Icon: 'Optional',
			},
			'Toggle Button': {
				Emphasis: 'Variable',
				Usage: 'On/off states for a single option or for grouping related options',
				Color: 'Surface color background, primary color text or icon',
				Size: 'Small to medium',
				'Border Radius': '4dp',
				Icon: 'Often used',
			},
			'Floating Action Button (FAB)': {
				Emphasis: 'Very High',
				Usage: 'Primary, most prominent action on a screen',
				Color: 'Primary color background, white icon',
				Size: {
					Standard: '56dp',
					Mini: '40dp',
				},
				'Border Radius': {
					Standard: '28dp',
					Mini: '20dp',
				},
				Elevation: 'High elevation',
				Icon: 'Required',
			},
			'Extended Floating Action Button (Extended FAB)': {
				Emphasis: 'Very High',
				Usage: 'Primary actions with more emphasis or requiring text and an icon',
				Color: 'Primary color background, white text and icon',
				Size: 'Large',
				'Border Radius': '28dp',
				Elevation: 'High elevation',
				Icon: 'Required',
			},
		},
		'Text Boxes': {
			'Filled Text Field': {
				Usage: 'General text input',
				Color: 'Surface color fill, primary color text and icons',
				Size: 'Variable height (based on content), standard width (often 320dp)',
				'Border Radius': '4dp',
				Label: 'Inside the text field',
				Elevation: 'None',
			},
			'Outlined Text Field': {
				Usage: 'General text input with more emphasis than filled text fields',
				Color: 'Transparent background, primary color border and text',
				Size: 'Variable height (based on content), standard width (often 320dp)',
				'Border Radius': '4dp',
				Label: 'Outside the text field',
				Elevation: 'None',
			},
			'Standard Text Field': {
				Usage: 'General text input in less prominent forms',
				Color: 'Transparent background, primary color underline and text',
				Size: 'Variable height (based on content), standard width (often 320dp)',
				'Border Radius': 'None (underline only)',
				Label: 'Above the text field',
				Elevation: 'None',
			},
			'Text Area': {
				Usage: 'Multi-line text input',
				Color: 'Same as corresponding single-line text fields (filled, outlined, or standard)',
				Size: 'Variable height (expands with content), standard width (often 320dp)',
				'Border Radius': 'Same as corresponding single-line text fields',
				Label: 'Same as corresponding single-line text fields',
				Elevation: 'None',
			},
		},
	},
	{
		Name: 'Apple Design',
		'Color Palette': {
			'System Background': {
				'Color Code': '#FFFFFF',
				Usage: 'Background color for most views and surfaces.',
			},
			'Secondary System Background': {
				'Color Code': '#F2F2F7',
				Usage: 'Background color for grouped content, such as table views.',
			},
			'Tertiary System Background': {
				'Color Code': '#E5E5EA',
				Usage: 'Background color for secondary grouped content.',
			},
			Separator: {
				'Color Code': '#C6C6C8',
				Usage: 'Color for dividers and separators.',
			},
			'Opaque Separator': {
				'Color Code': '#8E8E93',
				Usage: 'Color for more prominent dividers and separators.',
			},
		},
		Description: 'Sleek iOS aesthetics',
		Fonts: ['SF Pro', 'SF Compact', 'SF Arabic'],
		Colors: ['#FFFFFF', '#F2F2F7', '#E5E5EA', '#C6C6C8', '#8E8E93'],
		Buttons: {
			'Text Button': {
				Emphasis: 'Low',
				Usage: 'Secondary or supplementary actions',
				Color: 'Transparent background, system color text',
				Size: 'Varies based on content',
				'Border Radius': 'None',
				Icon: 'Optional',
			},
			'Filled Button': {
				Emphasis: 'High',
				Usage: 'Primary actions',
				Color: 'System color background, white text',
				Size: 'Standard height (44pt), width varies',
				'Border Radius': '10pt (default)',
				Icon: 'Optional',
			},
			'Outline Button': {
				Emphasis: 'Medium',
				Usage: 'Secondary actions',
				Color: 'Transparent background, system color border and text',
				Size: 'Standard height (44pt), width varies',
				'Border Radius': '10pt (default)',
				Icon: 'Optional',
			},
			'Plain Button': {
				Emphasis: 'Low',
				Usage: 'Textual actions in toolbars or navigation bars',
				Color: 'Transparent background, system color text',
				Size: 'Varies based on content',
				'Border Radius': 'None',
				Icon: 'Often used',
			},
			'Rounded Rectangle Button': {
				Emphasis: 'Medium to high',
				Usage: 'General actions needing more emphasis',
				Color: 'System color background, white text',
				Size: 'Standard height (44pt), width varies',
				'Border Radius': '10pt (default)',
				Icon: 'Optional',
			},
		},
		'Text Inputs': {
			'Standard Text Field': {
				Usage: 'General text input',
				Color: 'White background, system color text, light gray border',
				Size: 'Standard height (36pt), width varies',
				'Border Radius': '5pt',
				'Placeholder Text': 'Light gray',
			},
			'Rounded Text Field': {
				Usage: 'General text input with a more pronounced style',
				Color: 'White background, system color text, light gray border',
				Size: 'Standard height (36pt), width varies',
				'Border Radius': '18pt (half the height)',
				'Placeholder Text': 'Light gray',
			},
			'Secure Text Field': {
				Usage: 'Password or secure information input',
				Color: 'White background, system color text (hidden/obscured), light gray border',
				Size: 'Standard height (36pt), width varies',
				'Border Radius': '5pt',
				'Placeholder Text': 'Light gray',
			},
			'Multiline Text Field (Text View)': {
				Usage: 'Multi-line text input',
				Color: 'White background, system color text, light gray border',
				Size: 'Variable height (expands with content), width varies',
				'Border Radius': '5pt',
				'Placeholder Text': 'Light gray',
			},
		},
	},
	{
		Name: 'Carbon Design',
		Description: "IBM's enterprise framework",
		'Color Palette': {
			'Primary Color': {
				'Color Code': '#0F62FE',
				Name: 'IBM Blue 60',
				Usage: 'Primary buttons, links, and interactive elements.',
			},
			'Secondary Color': {
				'Color Code': '#393939',
				Name: 'Gray 80',
				Usage: 'Secondary elements, borders, and icons.',
			},
			'Background Color': {
				'Color Code': '#FFFFFF',
				Name: 'White',
				Usage: 'Main background color for most surfaces.',
			},
			'UI Background': {
				'Color Code': '#F4F4F4',
				Name: 'Gray 10',
				Usage: 'Background color for UI elements and cards.',
			},
			'Border/Separator Color': {
				'Color Code': '#E0E0E0',
				Name: 'Gray 30',
				Usage: 'Borders and separators.',
			},
		},
		Fonts: ['IBM Plex Sans', 'IBM Plex Serif', 'IBM Plex Mono'],
		Colors: ['#0F62FE', '#393939', '#FFFFFF', '#F4F4F4', '#E0E0E0'],
		Buttons: {
			'Primary Button': {
				Emphasis: 'High',
				Usage: 'Main actions that need to stand out',
				Color: 'Blue background, white text',
				Size: 'Standard height (48px), width varies',
				'Border Radius': '2px',
				Icon: 'Optional',
			},
			'Secondary Button': {
				Emphasis: 'Medium',
				Usage: 'Secondary actions',
				Color: 'White background, blue border and text',
				Size: 'Standard height (48px), width varies',
				'Border Radius': '2px',
				Icon: 'Optional',
			},
			'Tertiary Button': {
				Emphasis: 'Low',
				Usage: 'Less prominent actions',
				Color: 'Transparent background, blue text',
				Size: 'Standard height (48px), width varies',
				'Border Radius': '2px',
				Icon: 'Optional',
			},
			'Danger Button': {
				Emphasis: 'High',
				Usage: 'Destructive actions, such as delete or remove',
				Color: 'Red background, white text',
				Size: 'Standard height (48px), width varies',
				'Border Radius': '2px',
				Icon: 'Optional',
			},
			'Ghost Button': {
				Emphasis: 'Low',
				Usage: 'Less prominent actions, often used on dark backgrounds',
				Color: 'Transparent background, white text and border',
				Size: 'Standard height (48px), width varies',
				'Border Radius': '2px',
				Icon: 'Optional',
			},
		},
		'Text Inputs': {
			'Text Input': {
				Usage: 'General text input',
				Color: 'White background, dark text, gray border',
				Size: 'Standard height (44px), width varies',
				'Border Radius': '2px',
				'Placeholder Text': 'Light gray',
			},
			'Search Input': {
				Usage: 'Search functionality',
				Color: 'White background, dark text, gray border, search icon',
				Size: 'Standard height (44px), width varies',
				'Border Radius': '2px',
				'Placeholder Text': 'Light gray',
				Icon: 'Search icon included',
			},
			'Text Area': {
				Usage: 'Multi-line text input',
				Color: 'White background, dark text, gray border',
				Size: 'Variable height (expands with content), width varies',
				'Border Radius': '2px',
				'Placeholder Text': 'Light gray',
			},
			'Disabled Input': {
				Usage: 'Non-editable text input',
				Color: 'Light gray background, gray text, gray border',
				Size: 'Standard height (44px), width varies',
				'Border Radius': '2px',
				'Placeholder Text': 'Gray',
			},
		},
	},
	{
		Name: 'Atlassian Design',
		Description: 'Collaborative software design',
		'Color Palette': {
			'Primary Color': {
				'Color Code': '#0052CC',
				Name: 'Primary Blue',
				Usage: 'Primary buttons, links, and interactive elements.',
			},
			'Secondary Color': {
				'Color Code': '#172B4D',
				Name: 'Neutral Dark',
				Usage: 'Text, icons, and secondary elements.',
			},
			'Background Color': {
				'Color Code': '#FFFFFF',
				Name: 'White',
				Usage: 'Main background color for most surfaces.',
			},
			'UI Background': {
				'Color Code': '#F4F5F7',
				Name: 'Neutral Light',
				Usage: 'Background color for UI elements and cards.',
			},
			'Border/Separator Color': {
				'Color Code': '#DFE1E6',
				Name: 'Neutral Gray',
				Usage: 'Borders and separators.',
			},
		},
		Fonts: ['Atlassian Text', 'Atlassian Display', 'Atlassian Code'],
		Buttons: {
			'Primary Button': {
				Emphasis: 'High',
				Usage: 'Main actions that need to stand out',
				Color: 'Blue background, white text',
				Size: 'Standard height (40px), width varies',
				'Border Radius': '3px',
				Icon: 'Optional',
			},
			'Secondary Button': {
				Emphasis: 'Medium',
				Usage: 'Secondary actions that are not as prominent as primary actions',
				Color: 'White background, blue border and text',
				Size: 'Standard height (40px), width varies',
				'Border Radius': '3px',
				Icon: 'Optional',
			},
			'Link Button': {
				Emphasis: 'Low',
				Usage: 'Actions that are less important and can be inline with text',
				Color: 'Transparent background, blue text',
				Size: 'Standard height (40px), width varies',
				'Border Radius': 'None',
				Icon: 'Optional',
			},
			'Subtle Button': {
				Emphasis: 'Low',
				Usage: 'Less prominent actions, often used in toolbars or within content',
				Color: 'Transparent background, gray text',
				Size: 'Standard height (40px), width varies',
				'Border Radius': '3px',
				Icon: 'Optional',
			},
			'Danger Button': {
				Emphasis: 'High',
				Usage: 'Destructive actions, such as delete or remove',
				Color: 'Red background, white text',
				Size: 'Standard height (40px), width varies',
				'Border Radius': '3px',
				Icon: 'Optional',
			},
		},
		Colors: ['#0052CC', '#172B4D', '#FFFFFF', '#F4F5F7', '#DFE1E6'],
		'Text Inputs': {
			'Standard Text Field': {
				Usage: 'General text input',
				Color: 'White background, dark text, gray border',
				Size: 'Standard height (32px), width varies',
				'Border Radius': '3px',
				'Placeholder Text': 'Light gray',
			},
			'Search Field': {
				Usage: 'Search input',
				Color: 'White background, dark text, gray border, search icon',
				Size: 'Standard height (32px), width varies',
				'Border Radius': '3px',
				'Placeholder Text': 'Light gray',
				Icon: 'Search icon included',
			},
			'Multiline Text Area': {
				Usage: 'Multi-line text input',
				Color: 'White background, dark text, gray border',
				Size: 'Variable height (expands with content), width varies',
				'Border Radius': '3px',
				'Placeholder Text': 'Light gray',
			},
			'Disabled Text Field': {
				Usage: 'Displaying text input that is not editable',
				Color: 'Light gray background, gray text, gray border',
				Size: 'Standard height (32px), width varies',
				'Border Radius': '3px',
				'Placeholder Text': 'Light gray',
			},
		},
	},
]
