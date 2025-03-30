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
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'show-title=' + action.options.show)
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
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'show-tally=' + action.options.show)
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
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'show-vu-meter=' + action.options.show)
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
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'vu-meter-mode=' + action.options.mode)
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
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'show-center-cross=' + action.options.show)
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
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'safe-area-mode=' + action.options.mode)
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
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'ident-mode=' + action.options.mode)
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
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'ident-text=' + action.options.text)
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
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'h-flip=' + action.options.flip)
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
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'v-flip=' + action.options.flip)
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
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'deinterlace-mode=' + action.options.mode)
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
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'ar-convert-mode=' + action.options.mode)
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
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'in-auto-color-fmt=' + action.options.auto)
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
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'in-color-fmt=' + action.options.fmt)
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
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'switch-mode=' + action.options.mode)
		},
	}

	actions.set_audio_config = {
		name: 'Set Audio Config',
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
		callback: async (action) => {
			await self.sendCommand('set-audio-config', 'gain=' + action.options.gain)
		},
	}

	actions.select_preset_channel = {
		name: 'Select Preset Channel to Decode',
		options: [
			{
				type: 'dropdown',
				label: 'Channel',
				id: 'channel',
				choices: self.CHOICES_CHANNELS,
				default: self.CHOICES_NDI_SOURCES[0].id,
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-channel', 'name=' + action.options.channel + '&ndi-name=false')
		},
	}

	actions.select_ndi_source = {
		name: 'Select NDI Source to Decode',
		options: [
			{
				type: 'dropdown',
				label: 'NDI Source',
				id: 'ndisource',
				choices: self.CHOICES_NDI_SOURCES,
				default: self.CHOICES_NDI_SOURCES[0].id,
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-channel', 'name=' + action.options.ndisource + '&ndi-name=true')
		},
	}

	return actions
}
