import { toast } from "sonner"

interface Color {
	hex: string
}

export const exportSettings = ({
	toFile,
	domain,
	colors,
	fonts,
	device,
	style,
	screen_type,
	targetAudience,
	productPurpose,
	otherRequirements,
	logoURL,
	lockedFields,
}: {
	toFile?: boolean
	domain: string
	colors: Color[]
	fonts: string[]
	device: string
	style: string
	screen_type: string
	targetAudience: string
	productPurpose: string
	otherRequirements: string
	logoURL: string
	lockedFields: Set<string>
}) => {
	const settings = {
		domain: { value: domain, status: lockedFields.has('domain') ? 'locked' : 'open' },
		colors: colors.map((color) => ({
			value: color.hex,
			status: lockedFields.has('colors') ? 'locked' : 'open',
		})),
		fonts: fonts.map((font) => ({
			value: font,
			status: lockedFields.has('fonts') ? 'locked' : 'open',
		})),
		device: { value: device, status: lockedFields.has('device') ? 'locked' : 'open' },
		style: { value: style, status: lockedFields.has('style') ? 'locked' : 'open' },
		screen_type: {
			value: screen_type,
			status: lockedFields.has('screen_type') ? 'locked' : 'open',
		},
		targetAudience: {
			value: targetAudience,
			status: lockedFields.has('targetAudience') ? 'locked' : 'open',
		},
		productPurpose: {
			value: productPurpose,
			status: lockedFields.has('productPurpose') ? 'locked' : 'open',
		},
		otherRequirements: {
			value: otherRequirements,
			status: lockedFields.has('otherRequirements') ? 'locked' : 'open',
		},
		logoURL: { value: logoURL, status: lockedFields.has('logo') ? 'locked' : 'open' },
	}
	if (!toFile) {
		return settings
	}
	const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = 'settings.json'
	a.click()
	URL.revokeObjectURL(url)

	toast('Settings exported successfully', {
		duration: 3000,
	})
}

export const exportSettingsDesignSpecs = ({
	settings,
}: {
	settings: any
}) => {
	console.log(settings)
	const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = 'settings.json'
	a.click()
	URL.revokeObjectURL(url)
	toast('Settings exported successfully', {
		duration: 3000,
	})
}
