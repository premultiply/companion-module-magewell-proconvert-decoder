import { combineRgb } from '@companion-module/base'

export function setPresets(self) {
	const presets = {}

	const colorWhite = combineRgb(255, 255, 255)
	const colorRed = combineRgb(255, 0, 0)
	const colorGreen = combineRgb(0, 204, 0)
	const colorYellow = combineRgb(255, 255, 0)
	const colorBlue = combineRgb(0, 51, 204)
	const colorPurple = combineRgb(255, 0, 255)
	const colorDarkRed = combineRgb(102, 0, 0)
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
					bgcolor: colorGreen,
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

	presets['videoFollowInput'] = {
		type: 'button',
		category: 'System',
		name: 'Video Follow Input',
		style: {
			text: 'Video Follow Input',
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [
			{
				down: [
					{
						actionId: 'videoConfigFollowInputMode',
						options: {
							mode: true,
						},
					},
					{
						actionId: 'videoConfigDeinterlaceMode',
						options: {
							mode: 'weave',
						},
					},
					{
						actionId: 'videoConfigAutoColorFormat',
						options: {
							auto: true,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['audioFollowInput'] = {
		type: 'button',
		category: 'System',
		name: 'Audio Follow Input',
		style: {
			text: 'Audio Follow Input',
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [
			{
				down: [
					{
						actionId: 'audioConfigGain',
						options: {
							gain: 20.0,
						},
					},
					{
						actionId: 'audioConfigConvertMode',
						options: {
							mode: 'smpte',
						},
					},
					{
						actionId: 'audioConfigSamplerate',
						options: {
							samplerate: '0',
						},
					},
					{
						actionId: 'audioConfigChannelCount',
						options: {
							channels: '0',
						},
					},
					{
						actionId: 'videoConfigVUMeterMode',
						options: {
							mode: 'post-gain-dbfs',
						},
					},
				],
				up: [],
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
							actionId: 'selectPresetName',
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
						bgcolor: colorBlue,
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
							actionId: 'selectPresetIndex',
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
						bgcolor: colorBlue,
					},
				},
			],
		}
	})

	return presets
}
