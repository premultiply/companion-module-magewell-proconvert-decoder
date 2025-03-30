export const api = {
	MW_STATUS_SUCCESS: 0,
	MW_STATUS_PENDING: 1,
	MW_STATUS_TIMEOUT: 2,
	MW_STATUS_INTERRUPTED: 3,
	MW_STATUS_TRY_AGAIN: 4,
	MW_STATUS_NOT_IMPLEMENTED: 5,
	MW_STATUS_UNKNOWN_ERROR: 6,
	MW_STATUS_INVALID_ARG: 7,
	MW_STATUS_NO_MEMORY: 8,
	MW_STATUS_UNSUPPORTED: 9,
	MW_STATUS_FILE_BUSY: 10,
	MW_STATUS_DEVICE_BUSY: 11,
	MW_STATUS_DEVICE_LOST: 12,
	MW_STATUS_IO_FAILED: 13,
	MW_STATUS_READ_FAILED: 14,
	MW_STATUS_WRITE_FAILED: 15,
	MW_STATUS_NOT_EXIST: 16,
	MW_STATUS_TOO_MANY: 17,
	MW_STATUS_TOO_LARGE: 18,
	MW_STATUS_OVERFLOW: 19,
	MW_STATUS_UNDERFLOW: 20,
	MW_STATUS_FORMAT_ERROR: 21,
	MW_STATUS_FILE_EXISTS: 22,
	MW_STATUS_FILE_TYPE_ERROR: 23,
	MW_STATUS_DEVICE_TYPE_ERROR: 24,
	MW_STATUS_IS_DIRECTORY: 25,
	MW_STATUS_READ_ONLY: 26,
	MW_STATUS_RANGE_ERROR: 27,
	MW_STATUS_BROKEN_PIPE: 28,
	MW_STATUS_NO_SPACE: 29,
	MW_STATUS_NOT_DIRECTORY: 30,
	MW_STATUS_NOT_PERMITTED: 31,
	MW_STATUS_BAD_ADDRESS: 32,
	MW_STATUS_SEEK_ERROR: 33,
	MW_STATUS_CROSS_DEVICE_LINK: 34,
	MW_STATUS_NOT_INITIALIED: 35,
	MW_STATUS_AUTH_FAILED: 36,
	MW_STATUS_NOT_LOGGED_IN: 37,
	MW_STATUS_WRONG_STATE: 38,
	MW_STATUS_MISMATCH: 39,
	MW_STATUS_VERIFY_FAILED: 40,
	MW_STATUS_CONSTRAINT_VIOLATION: 41,

	STATUS_CODES: [
		{ id: 0, label: 'MW_STATUS_SUCCESS' },
		{ id: 1, label: 'MW_STATUS_PENDING' },
		{ id: 2, label: 'MW_STATUS_TIMEOUT' },
		{ id: 3, label: 'MW_STATUS_INTERRUPTED' },
		{ id: 4, label: 'MW_STATUS_TRY_AGAIN' },
		{ id: 5, label: 'MW_STATUS_NOT_IMPLEMENT' },
		{ id: 6, label: 'MW_STATUS_UNKNOWN_ERROR' },
		{ id: 7, label: 'MW_STATUS_INVALID_ARG' },
		{ id: 8, label: 'MW_STATUS_NO_MEMORY' },
		{ id: 9, label: 'MW_STATUS_UNSUPPORTED' },
		{ id: 10, label: 'MW_STATUS_FILE_BUSY' },
		{ id: 11, label: 'MW_STATUS_DEVICE_BUSY,' },
		{ id: 12, label: 'MW_STATUS_DEVICE_LOST' },
		{ id: 13, label: 'MW_STATUS_IO_FAILED' },
		{ id: 14, label: 'MW_STATUS_READ_FAILED' },
		{ id: 15, label: 'MW_STATUS_WRITE_FAILED' },
		{ id: 16, label: 'MW_STATUS_NOT_EXIST' },
		{ id: 17, label: 'MW_STATUS_TOO_MANY' },
		{ id: 18, label: 'MW_STATUS_TOO_LARGE' },
		{ id: 19, label: 'MW_STATUS_OVERFLOW' },
		{ id: 20, label: 'MW_STATUS_UNDERFLOW' },
		{ id: 21, label: 'MW_STATUS_FORMAT_ERROR' },
		{ id: 22, label: 'MW_STATUS_FILE_EXISTS' },
		{ id: 23, label: 'MW_STATUS_FILE_TYPE_ERROR' },
		{ id: 24, label: 'MW_STATUS_DEVICE_TYPE_ERROR' },
		{ id: 25, label: 'MW_STATUS_IS_DIRECTORY' },
		{ id: 26, label: 'MW_STATUS_READ_ONLY' },
		{ id: 27, label: 'MW_STATUS_RANGE_ERROR' },
		{ id: 28, label: 'MW_STATUS_BROKEN_PIPE' },
		{ id: 29, label: 'MW_STATUS_NO_SPACE' },
		{ id: 30, label: 'MW_STATUS_NOT_DIRECTORY' },
		{ id: 31, label: 'MW_STATUS_NOT_PERMITTED' },
		{ id: 32, label: 'MW_STATUS_BAD_ADDRESS' },
		{ id: 33, label: 'MW_STATUS_SEEK_ERROR' },
		{ id: 34, label: 'MW_STATUS_CROSS_DEVICE_LINK' },
		{ id: 35, label: 'MW_STATUS_NOT_INITIALIED' },
		{ id: 36, label: 'MW_STATUS_AUTH_FAILED' },
		{ id: 37, label: 'MW_STATUS_NOT_LOGGED_IN' },
		{ id: 38, label: 'MW_STATUS_WRONG_STATE' },
		{ id: 39, label: 'MW_STATUS_MISMATCH' },
		{ id: 40, label: 'MW_STATUS_VERIFY_FAILED' },
		{ id: 41, label: 'MW_STATUS_CONSTRAINT_VIOLATION' },
	],
}

/*
export const data1 = {
	status: null,
	device: {
		name: null,
		model: null,
		productId: null,
		authType: null,
		serialNo: null,
		hwRevision: null,
		fwVersion: null,
		upToDate: null,
		outputState: null,
		cpuUsage: null,
		memoryUsage: null,
		coreTemp: null,
		boardId: null,
		upTime: null,
		sdSize: null,
	},
	ethernet: {
		state: null,
		macAddr: null,
		ipAddr: null,
		ipMask: null,
		gwAddr: null,
		dnsAddr: null,
		txSpeedKbps: null,
		rxSpeedKbps: null,
	},
	rndis: {
		state: null,
		ipAddr: null,
		txSpeedKbps: null,
		rxSpeedKbps: null,
	},
	ndi: {
		name: null,
		url: null,
		connected: null,
		tallyPreview: null,
		tallyProgram: null,
		audioDropFrames: null,
		videoDropFrames: null,
		videoBitRate: null,
		audioBitRate: null,
		audioJitter: null,
		videoJitter: null,
		videoWidth: null,
		videoHeight: null,
		videoScan: null,
		videoFieldRate: null,
		audioNumChannels: null,
		audioSampleRate: null,
		audioBitCount: null,
	},
}
*/

/*
name
model
product-id
auth-type
serial-no
hw-revision
fw-version
up-to-date
output-state
cpu-usage
memory-usage
core-temp
board-id
up-time
sd-size

state
mac-addr
ip-addr
ip-mask
gw-addr
dns-addr
tx-speed-kbps
rx-speed-kbps

state
ip-addr
tx-speed-kbps
rx-speed-kbps

name
url
connected
tally-preview
tally-program
audio-drop-frames
video-drop-frames
video-bit-rate
audio-bit-rate
audio-jitter
video-jitter
video-width
video-height
video-scan
video-field-rate
audio-num-channels
audio-sample-rate
audio-bit-count
 */
