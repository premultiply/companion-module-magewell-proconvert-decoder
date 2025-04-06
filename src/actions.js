// ##########################
// #### Instance Actions ####
// ##########################
export function setActions(self) {
	const actions = {}

	actions.videoconfig_showtitle = {
		name: 'Video Config - Show Source Name and Resolution',
		options: [
			{
				type: 'checkbox',
				label: 'Show Source Name and Resolution',
				id: 'show',
				default: false,
			},
		],
		callback: (action) => {
			self.sendCommand('set-video-config', 'show-title=' + action.options.show)
		},
	}

	actions.videoconfig_showtally = {
		name: 'Video Config - Show Tally',
		options: [
			{
				type: 'checkbox',
				label: 'Show Tally',
				id: 'show',
				default: false,
			},
		],
		callback: (action) => {
			self.sendCommand('set-video-config', 'show-tally=' + action.options.show)
		},
	}

	actions.videoconfig_showvumeter = {
		name: 'Video Config - Show VU Meter',
		options: [
			{
				type: 'checkbox',
				label: 'Show VU Meter',
				id: 'show',
				default: false,
			},
		],
		callback: (action) => {
			self.sendCommand('set-video-config', 'show-vu-meter=' + action.options.show)
		},
	}

	actions.videoconfig_vumetermode = {
		name: 'Video Config - VU Meter Mode',
		options: [
			{
				type: 'dropdown',
				label: 'VU Meter Mode',
				id: 'mode',
				default: 'none',
				choices: [
					{ id: 'none', label: 'None' },
					{ id: 'dbu', label: 'dBU' },
					{ id: 'dbvu', label: 'dBVU' },
					{ id: 'dbfs', label: 'dBFS' },
				],
			},
		],
		callback: (action) => {
			self.sendCommand('set-video-config', 'vu-meter-mode=' + action.options.mode)
		},
	}

	actions.videoconfig_showcentercross = {
		name: 'Video Config - Show Center Cross',
		options: [
			{
				type: 'checkbox',
				label: 'Show Center Cross',
				id: 'show',
				default: false,
			},
		],
		callback: (action) => {
			self.sendCommand('set-video-config', 'show-center-cross=' + action.options.show)
		},
	}

	actions.videoconfig_safeareamode = {
		name: 'Video Config - Safe Area Mode',
		options: [
			{
				type: 'dropdown',
				label: 'Safe Area Mode',
				id: 'mode',
				default: 'none',
				choices: [
					{ id: 'none', label: 'None' },
					{ id: '4:3', label: 'Show 4:3 aspect ratio area' },
					{ id: '80%', label: 'Show 80% center view area' },
					{ id: 'square', label: 'Show Square aspect ratio area' },
				],
			},
		],
		callback: (action) => {
			self.sendCommand('set-video-config', 'safe-area-mode=' + action.options.mode)
		},
	}

	actions.videoconfig_identmode = {
		name: 'Video Config - Ident Mode',
		options: [
			{
				type: 'dropdown',
				label: 'Ident Mode',
				id: 'mode',
				default: 'none',
				choices: [
					{ id: 'none', label: 'None' },
					{ id: 'ident-text', label: 'Ident Text' },
					{ id: 'device-name', label: 'Device Name' },
				],
			},
		],
		callback: (action) => {
			self.sendCommand('set-video-config', 'ident-mode=' + action.options.mode)
		},
	}

	actions.videoconfig_identtext = {
		name: 'Video Config - Ident Text',
		options: [
			{
				type: 'textinput',
				label: 'Ident Text',
				id: 'text',
				default: '',
			},
		],
		callback: (action) => {
			self.sendCommand('set-video-config', 'ident-text=' + action.options.text)
		},
	}

	actions.videoconfig_hflip = {
		name: 'Video Config - Horizontal Flip',
		options: [
			{
				type: 'checkbox',
				label: 'Flip',
				id: 'flip',
				default: false,
			},
		],
		callback: (action) => {
			self.sendCommand('set-video-config', 'h-flip=' + action.options.flip)
		},
	}

	actions.videoconfig_vflip = {
		name: 'Video Config - Vertical Flip',
		options: [
			{
				type: 'checkbox',
				label: 'Flip',
				id: 'flip',
				default: false,
			},
		],
		callback: (action) => {
			self.sendCommand('set-video-config', 'v-flip=' + action.options.flip)
		},
	}

	actions.videoconfig_deinterlacemode = {
		name: 'Video Config - Deinterlace Mode',
		options: [
			{
				type: 'dropdown',
				label: 'Deinterlace Mode',
				id: 'mode',
				default: 'bob',
				choices: [
					{ id: 'bob', label: 'Bob' },
					{ id: 'weave', label: 'Weave' },
				],
			},
		],
		callback: (action) => {
			self.sendCommand('set-video-config', 'deinterlace-mode=' + action.options.mode)
		},
	}

	actions.videoconfig_arconvertmode = {
		name: 'Video Config - Aspect Ratio Convert Mode',
		options: [
			{
				type: 'dropdown',
				label: 'Aspect Ratio Convert Mode',
				id: 'mode',
				default: 'full',
				choices: [
					{ id: 'windowbox', label: 'Letterbox/Pillarbox' },
					{ id: 'full', label: 'Full Screen' },
					{ id: 'zoom', label: 'Zoom/Crop' },
				],
			},
		],
		callback: (action) => {
			self.sendCommand('set-video-config', 'ar-convert-mode=' + action.options.mode)
		},
	}

	actions.videoconfig_autocolorfmt = {
		name: 'Video Config - Auto Color Format',
		options: [
			{
				type: 'checkbox',
				label: 'Auto Color Format',
				id: 'auto',
				default: false,
			},
		],
		callback: (action) => {
			self.sendCommand('set-video-config', 'in-auto-color-fmt=' + action.options.auto)
		},
	}

	actions.videoconfig_colorfmt = {
		name: 'Video Config - Color Format',
		options: [
			{
				type: 'dropdown',
				label: 'Color Format',
				id: 'fmt',
				default: 'bt.709',
				choices: [
					{ id: 'bt.601', label: 'BT.601' },
					{ id: 'bt.709', label: 'BT.709' },
				],
			},
		],
		callback: (action) => {
			self.sendCommand('set-video-config', 'in-color-fmt=' + action.options.fmt)
		},
	}

	actions.videoconfig_switchmode = {
		name: 'Video Config - Switch Mode',
		options: [
			{
				type: 'dropdown',
				label: 'Switch Mode',
				id: 'mode',
				tooltip: 'Image to show when source is changed',
				default: 'blank',
				choices: [
					{ id: 'blank', label: 'Black Screen' },
					{ id: 'keep-last', label: 'Keep Last Picture' },
				],
			},
		],
		callback: (action) => {
			self.sendCommand('set-video-config', 'switch-mode=' + action.options.mode)
		},
	}

	actions.audioconfig_gain = {
		name: 'Audio Config - Gain',
		options: [
			{
				type: 'number',
				label: 'Gain',
				id: 'gain',
				tooltip: 'Sets the gain level (-100.00dB - 20.00 dB)',
				min: -100,
				max: 20,
				default: 0.0,
				step: 0.1,
				required: true,
				range: true,
			},
		],
		callback: (action) => {
			self.sendCommand('set-audio-config', 'gain=' + action.options.gain)
		},
	}

	actions.audioconfig_samplerate = {
		name: 'Audio Config - Samplerate',
		options: [
			{
				type: 'dropdown',
				label: 'Sample Rate',
				id: 'samplerate',
				default: '48000',
				choices: [
					{ id: '0', label: 'Follow Input' },
					{ id: '32000', label: '32000 Hz' },
					{ id: '44100', label: '44100 Hz' },
					{ id: '48000', label: '48000 Hz' },
					{ id: '88200', label: '88200 Hz' },
					{ id: '96000', label: '96000 Hz' },
				],
			},
		],
		callback: (action) => {
			self.sendCommand('set-audio-config', 'samplerate=' + action.options.samplerate)
		},
	}

	actions.audioconfig_channelcount = {
		name: 'Audio Config - Channel count',
		options: [
			{
				type: 'dropdown',
				label: 'Channels',
				id: 'channels',
				default: '0',
				choices: [
					{ id: '0', label: 'Follow Input' },
					{ id: '2', label: '2 Channels' },
					{ id: '4', label: '4 Channels' },
					{ id: '8', label: '8 Channels' },
				],
			},
		],
		callback: (action) => {
			self.sendCommand('set-audio-config', 'channels=' + action.options.channels)
		},
	}

	actions.select_preset_name = {
		name: 'Select Source Preset',
		description: 'Select a source preset for decoding',
		options: [
			{
				type: 'dropdown',
				label: 'Preset Name',
				id: 'name',
				choices: self.SOURCE_PRESETS,
				allowCustom: true,
			},
		],
		callback: (action) => {
			self.sendCommand(
				'set-channel',
				'ndi-name=' + (action.options.name === '' ? 'true' : 'false') + '&name=' + action.options.name,
			)
		},
	}

	actions.selectPresetIndex = {
		name: 'Select Source Preset by Index',
		description: 'Select a source preset for decoding by its position in the list',
		options: [
			{
				type: 'number',
				label: 'Preset #',
				id: 'index',
				required: true,
				min: 0,
				//max: self.SOURCE_PRESETS.length - 1,
				default: 0,
			},
		],
		callback: (action) => {
			const name =
				action.options.index >= 0 && action.options.index < self.SOURCE_PRESETS.length
					? self.SOURCE_PRESETS[action.options.index].id
					: ''
			self.sendCommand('set-channel', 'ndi-name=' + (name === '' ? 'true' : 'false') + '&name=' + name)
		},
	}

	actions.selectSourceName = {
		name: 'Select Source',
		description: 'Select either an available NDI source or a Source Preset for decoding',
		options: [
			{
				type: 'checkbox',
				label: 'NDI Source',
				tooltip: 'Enable to select an available NDI source, otherwise select a source from the preset list',
				id: 'isNameNDI',
				default: false,
			},
			{
				type: 'dropdown',
				label: 'Preset Name',
				tooltip:
					'Select a Source Preset name for decoding. Source Presets can be created, edited and removed in the device web interface.',
				id: 'nameSource',
				choices: self.SOURCE_PRESETS,
				allowCustom: true,
				isVisible: (options) => options.isNameNDI === false,
			},
			{
				type: 'dropdown',
				label: 'Source',
				tooltip: 'List of NDI sources currently available for decoding. The list is updated automatically.',
				id: 'nameNDI',
				choices: self.NDI_SOURCES,
				allowCustom: true,
				isVisible: (options) => options.isNameNDI === true,
			},
		],
		callback: (action) => {
			self.sendCommand(
				'set-channel',
				'ndi-name=' +
					(action.options.isNameNDI || action.options.nameSource === '' ? 'true' : 'false') +
					'&name=' +
					(action.options.isNameNDI ? action.options.nameNDI : action.options.nameSource),
			)
		},
	}

	actions.reboot = {
		name: 'Reboot',
		description: 'Reboots the device without any further confirmation',
		options: [],
		callback: () => {
			self.sendCommand('reboot')
		},
	}

	return actions
}
