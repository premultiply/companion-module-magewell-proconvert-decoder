// ##########################
// #### Define Variables ####
// ##########################
export function setVariables() {
	const variables = []

	// Summary Info
	variables.push({ variableId: 'device-model', name: 'Device - Model' })
	variables.push({ variableId: 'device-product-id', name: 'Device - Product ID' })
	variables.push({ variableId: 'device-serial-no', name: 'Device - Serial number' })
	variables.push({ variableId: 'device-hw-revision', name: 'Device - Hardware version' })
	variables.push({ variableId: 'device-fw-version', name: 'Device - Firmware version' })
	variables.push({ variableId: 'device-output-state', name: 'Device - HDMI Output State' })
	variables.push({ variableId: 'device-cpu-usage', name: 'Device - CPU Usage (%)' })
	variables.push({ variableId: 'device-memory-usage', name: 'Device - Memory Usage (%)' })
	variables.push({ variableId: 'device-core-temp', name: 'Device - Temperature (°C)' })
	variables.push({ variableId: 'device-board-id', name: 'Device - Slot index' })
	variables.push({ variableId: 'device-up-time', name: 'Device - Up time (s)' })

	variables.push({ variableId: 'ethernet-state', name: 'Ethernet - Connection' })
	variables.push({ variableId: 'ethernet-tx-speed-kbps', name: 'Ethernet - Send Speed (Kbps)' })
	variables.push({ variableId: 'ethernet-rx-speed-kbps', name: 'Ethernet - Receive Speed (Kbps)' })

	variables.push({ variableId: 'source-name', name: 'Source - Name' })
	variables.push({ variableId: 'source-url', name: 'Source - URL' })
	variables.push({ variableId: 'source-url-type', name: 'Source - Type' }) // Custom variable
	variables.push({ variableId: 'source-buffer-duration', name: 'Source - Buffer Duration (ms)' }) // Custom variable
	variables.push({ variableId: 'source-connected', name: 'Source - Connected' })
	variables.push({ variableId: 'source-tally-preview', name: 'Source - Tally Preview' })
	variables.push({ variableId: 'source-tally-program', name: 'Source - Tally Program' })
	variables.push({ variableId: 'source-audio-drop-samples', name: 'Source - Audio Dropped Samples' })
	variables.push({ variableId: 'source-video-drop-frames', name: 'Source - Video Dropped Frames' })
	variables.push({ variableId: 'source-video-bit-rate', name: 'Source - Video Bit Rate (Mbps)' })
	variables.push({ variableId: 'source-audio-bit-rate', name: 'Source - Audio Bit Rate (Kbps)' })
	variables.push({ variableId: 'source-audio-jitter', name: 'Source - Audio Jitter (ms)' })
	variables.push({ variableId: 'source-video-jitter', name: 'Source - Video Jitter (ms)' })
	variables.push({ variableId: 'source-video-width', name: 'Source - Video Width' })
	variables.push({ variableId: 'source-video-height', name: 'Source - Video Height' })
	variables.push({ variableId: 'source-video-scan', name: 'Source - Video Scan Mode' })
	variables.push({ variableId: 'source-video-scan-short', name: 'Source - Video Scan Mode (Short)' }) // Custom variable
	variables.push({ variableId: 'source-video-field-rate', name: 'Source - Video Field Rate (FPS)' })
	variables.push({ variableId: 'source-audio-num-channels', name: 'Source - Audio Number of Channels' })
	variables.push({ variableId: 'source-audio-sample-rate', name: 'Source - Audio Sample Rate (Hz)' })
	variables.push({ variableId: 'source-audio-bit-count', name: 'Source - Audio Bit Count' })

	// Video Config
	variables.push({ variableId: 'video-show-title', name: 'Video Config - OSD - Show source name & resolution' })
	variables.push({ variableId: 'video-show-tally', name: 'Video Config - OSD - Show tally indicators' })
	variables.push({ variableId: 'video-show-vumeter', name: 'Video Config - OSD - Show audio meter' })
	variables.push({ variableId: 'video-show-center-cross', name: 'Video Config - OSD - Show center cross' })
	variables.push({ variableId: 'video-ident-mode', name: 'Video Config - OSD - Ident Mode' })
	variables.push({ variableId: 'video-ident-text', name: 'Video Config - OSD - Ident Text' })
	variables.push({ variableId: 'video-deinterlace-mode', name: 'Video Config - Process - Deinterlace mode' })
	variables.push({ variableId: 'video-switch-mode', name: 'Video Config - Source - Display after source lost' })
	variables.push({ variableId: 'video-follow-input-mode', name: 'Video Config - Resolution - Follow input' })

	// Audio Config
	variables.push({ variableId: 'audio-check-pts', name: 'Audio Config - Check audio PTS' })
	variables.push({ variableId: 'audio-gain', name: 'Audio Config - Gain (dB)' })

	return variables
}

// #########################
// #### Check Variables ####
// #########################
export function checkVariables(self) {
	self.setVariableValues({
		'device-model': self.STATUS.summaryInfo.device.model,
		'device-product-id': self.STATUS.summaryInfo.device.productId,
		'device-serial-no': self.STATUS.summaryInfo.device.serialNo,
		'device-hw-revision': self.STATUS.summaryInfo.device.hwRevision,
		'device-fw-version': self.STATUS.summaryInfo.device.fwVersion,
		'device-output-state': self.STATUS.summaryInfo.device.outputState,
		'device-cpu-usage': self.STATUS.summaryInfo.device.cpuUsage,
		'device-memory-usage': self.STATUS.summaryInfo.device.memoryUsage,
		'device-core-temp': self.STATUS.summaryInfo.device.coreTemp,
		'device-board-id': self.STATUS.summaryInfo.device.boardId,
		'device-up-time': self.STATUS.summaryInfo.device.upTime,
		'ethernet-state': self.STATUS.summaryInfo.ethernet.state,
		'ethernet-tx-speed-kbps': self.STATUS.summaryInfo.ethernet.txSpeedKbps,
		'ethernet-rx-speed-kbps': self.STATUS.summaryInfo.ethernet.rxSpeedKbps,
		'source-name': self.STATUS.summaryInfo.source.name,
		'source-url': self.STATUS.summaryInfo.source.url,
		'source-connected': self.STATUS.summaryInfo.source.connected,
		'source-tally-preview': self.STATUS.summaryInfo.source.tallyPreview,
		'source-tally-program': self.STATUS.summaryInfo.source.tallyProgram,
		'source-audio-drop-samples': self.STATUS.summaryInfo.source.audioDropSamples,
		'source-video-drop-frames': self.STATUS.summaryInfo.source.videoDropFrames,
		'source-video-bit-rate': self.STATUS.summaryInfo.source.videoBitRate,
		'source-audio-bit-rate': self.STATUS.summaryInfo.source.audioBitRate,
		'source-audio-jitter': self.STATUS.summaryInfo.source.audioJitter,
		'source-video-jitter': self.STATUS.summaryInfo.source.videoJitter,
		'source-video-width': self.STATUS.summaryInfo.source.videoWidth,
		'source-video-height': self.STATUS.summaryInfo.source.videoHeight,
		'source-video-scan': self.STATUS.summaryInfo.source.videoScan,
		'source-video-field-rate': self.STATUS.summaryInfo.source.videoFieldRate,
		'source-audio-num-channels': self.STATUS.summaryInfo.source.audioNumChannels,
		'source-audio-sample-rate': self.STATUS.summaryInfo.source.audioSampleRate,
		'source-audio-bit-count': self.STATUS.summaryInfo.source.audioBitCount,
		'video-show-title': self.STATUS.videoConfig.showTitle,
		'video-show-tally': self.STATUS.videoConfig.showTally,
		'video-show-vumeter': self.STATUS.videoConfig.showVUMeter,
		'video-show-center-cross': self.STATUS.videoConfig.showCenterCross,
		'video-ident-mode': self.STATUS.videoConfig.identMode,
		'video-ident-text': self.STATUS.videoConfig.identText,
		'video-deinterlace-mode': self.STATUS.videoConfig.deinterlaceMode,
		'video-switch-mode': self.STATUS.videoConfig.switchMode,
		'video-follow-input-mode': self.STATUS.videoConfig.followInputMode,
		'audio-check-pts': self.STATUS.audioConfig.checkPts,
		'audio-gain': self.STATUS.audioConfig.gain,

		// Custom variables
		'source-url-type': (self.STATUS.summaryInfo.source.url?.split(':')[0] ?? '').toUpperCase(),
		'source-video-scan-short': self.STATUS.summaryInfo.source.videoScan?.charAt(0) ?? ' ',
		'source-buffer-duration': getBufferDuration(self.STATUS.summaryInfo.source.url),
	})
}

function getBufferDuration(url) {
	const bufferDuration = url?.match(/mw-buffer-duration=(\d+)/)
	return bufferDuration ? parseInt(bufferDuration[1]) : 0
}
