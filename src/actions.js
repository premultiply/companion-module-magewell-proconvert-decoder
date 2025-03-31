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

	actions.select_preset_channel = {
		name: 'Select Source Preset',
		description: 'Select a source preset for decoding',
		options: [
			{
				type: 'dropdown',
				label: 'Channel',
				id: 'channel',
				choices: self.CHOICES_CHANNELS,
				default: self.CHOICES_NDI_SOURCES[0].id,
			},
		],
		callback: (action) => {
			const name = action.options.channel
			self.sendCommand('set-channel', 'name=' + name + '&ndi-name=' + (name == '' ? 'true' : 'false'))
		},
	}

	actions.select_ndi_source = {
		name: 'Select NDI Source',
		description: 'Select an available NDI source for decoding',
		options: [
			{
				type: 'dropdown',
				label: 'NDI Source',
				id: 'ndisource',
				choices: self.CHOICES_NDI_SOURCES,
				default: self.CHOICES_NDI_SOURCES[0].id,
			},
		],
		callback: (action) => {
			self.sendCommand('set-channel', 'name=' + action.options.ndisource + '&ndi-name=true')
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
