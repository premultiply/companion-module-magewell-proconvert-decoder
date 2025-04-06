import { combineRgb } from '@companion-module/base'

export function setPresets(self) {
	const presets = {}

	const colorWhite = combineRgb(255, 255, 255)
	const colorRed = combineRgb(255, 0, 0)
	const colorOrange = combineRgb(255, 102, 0)
	const colorYellow = combineRgb(255, 255, 0)
	const colorGreen = combineRgb(0, 255, 0)
	//const colorPurple = combineRgb(255, 0, 255)
	//const colorActiveBlue = combineRgb(0, 51, 204)
	const colorBlue = combineRgb(0, 51, 204)
	const colorDarkRed = combineRgb(102, 0, 0)
	const colorDarkYellow = combineRgb(102, 102, 0)
	const colorDarkBlue = combineRgb(0, 0, 102)
	const colorDarkGreen = combineRgb(0, 102, 0)
	const colorGrey = combineRgb(51, 51, 51)
	const colorBlack = combineRgb(0, 0, 0)

	presets['dashboardSourceConnected'] = {
		type: 'button',
		category: 'Dashboard',
		name: 'Source Connected',
		style: {
			text: '$(generic-module:sourceName)',
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'sourceConnected',
				style: {
					color: colorWhite,
					bgcolor: colorDarkGreen,
				},
			},
		],
	}

	presets['systemReboot'] = {
		type: 'button',
		category: 'System',
		name: 'Reboot Device (Hold for 2s)',
		style: {
			text: 'Reboot',
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		options: {
			relativeDelay: false,
		},
		steps: [
			{
				down: [],
				up: [],
				2000: {
					options: { runWhileHeld: true },
					actions: [
						{
							actionId: 'reboot',
							options: {},
						},
					],
				},
			},
		],
		feedbacks: [],
	}

	// #################
	// #### Presets ####
	// #################

	self.SOURCE_PRESETS.forEach((preset, index) => {
		presets[`presetName${index}`] = {
			type: 'button',
			category: 'Source Presets by Name',
			name: `Select Source Preset "${preset.id}"`,
			style: {
				text: preset.id,
				size: '14',
				color: colorWhite,
				bgcolor: colorBlack,
			},
			options: {
				relativeDelay: false,
			},
			steps: [
				{
					down: [
						{
							actionId: 'select_preset_name',
							options: {
								name: preset.id,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'sourcePresetName',
					options: {
						name: preset.id,
					},
					style: {
						color: colorWhite,
						bgcolor: colorDarkBlue,
					},
				},
			],
		}
	})

	self.SOURCE_PRESETS.forEach((preset, index) => {
		presets[`presetIndex${index}`] = {
			type: 'button',
			category: 'Source Presets by Index',
			name: `Select Source Preset #${index}`,
			style: {
				text: `PRESET #${index}\\n\\n$(generic-module:presetSource${index})`,
				size: '7',
				color: colorWhite,
				bgcolor: colorBlack,
			},
			options: {
				relativeDelay: false,
			},
			steps: [
				{
					down: [
						{
							actionId: 'select_preset_index',
							options: {
								index: index,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'sourcePresetIndex',
					options: {
						index: index,
					},
					style: {
						color: colorWhite,
						bgcolor: colorDarkBlue,
					},
				},
			],
		}
	})

	return presets
}
