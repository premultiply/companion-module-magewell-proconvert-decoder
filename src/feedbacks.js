import { combineRgb } from '@companion-module/base'

// ##########################
// #### Define Feedbacks ####
// ##########################
export function setFeedbacks(self) {
	const feedbacks = {}

	const colorWhite = combineRgb(255, 255, 255)
	const colorRed = combineRgb(255, 0, 0)
	const colorGreen = combineRgb(0, 255, 0)
	//const colorOrange = combineRgb(255, 102, 0)
	//const colorBlue = combineRgb(0, 51, 204)
	//const colorGrey = combineRgb(51, 51, 51)

	feedbacks.sourcePresetSelected = {
		type: 'boolean',
		name: 'Source Preset selected',
		description: 'Indicate if the Source Preset is currently selected for decoding',
		defaultStyle: {
			color: colorWhite,
			bgcolor: colorRed,
		},
		options: [
			{
				type: 'dropdown',
				label: 'Source Preset',
				id: 'option',
				default: self.SOURCE_PRESETS[0].id,
				choices: self.SOURCE_PRESETS,
			},
		],
		callback: function (feedback) {
			return self.STATUS.summaryInfo.source.name === feedback.options.option
		},
	}

	feedbacks.ndiSourceSelected = {
		type: 'boolean',
		name: 'NDI Source selected',
		description: 'Indicate if NDI Source is currently selected for decoding',
		defaultStyle: {
			color: colorWhite,
			bgcolor: colorRed,
		},
		options: [
			{
				type: 'dropdown',
				label: 'NDI Source',
				id: 'option',
				default: self.NDI_SOURCES[0].id,
				choices: self.NDI_SOURCES,
			},
		],
		callback: function (feedback) {
			return self.STATUS.summaryInfo.source.name === feedback.options.option
		},
	}

	feedbacks.sourceConnected = {
		type: 'boolean',
		name: 'Source is Connected',
		description: 'Indicate if selected Source is Connected',
		defaultStyle: {
			color: colorWhite,
			bgcolor: colorRed,
		},
		options: [],
		callback: function () {
			return self.STATUS.summaryInfo.source.connected
		},
	}

	feedbacks.sourceDropFrames = {
		type: 'boolean',
		name: 'Frame drop detected',
		description: 'Indicate if Decoder is dropping video frames or audio samples',
		defaultStyle: {
			color: colorWhite,
			bgcolor: colorRed,
		},
		options: [],
		callback: function () {
			return self.STATUS.summaryInfo.source.videoDropFrames > 0 || self.STATUS.summaryInfo.source.audioDropSamples > 0
		},
	}

	feedbacks.sourceTallyProgram = {
		type: 'boolean',
		name: 'Tally Program',
		description: 'Indicates if the Program Tally is currently active',
		defaultStyle: {
			color: colorWhite,
			bgcolor: colorRed,
		},
		options: [],
		callback: function () {
			return self.STATUS.summaryInfo.source.tallyProgram
		},
	}

	feedbacks.sourceTallyPreview = {
		type: 'boolean',
		name: 'Tally Preview',
		description: 'Indicates if the Preview Tally is currently active',
		defaultStyle: {
			color: colorWhite,
			bgcolor: colorGreen,
		},
		options: [],
		callback: function () {
			return self.STATUS.summaryInfo.source.tallyPreview
		},
	}

	return feedbacks
}
