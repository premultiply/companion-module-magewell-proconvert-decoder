import { runEntrypoint, InstanceBase, InstanceStatus } from '@companion-module/base'
import { setActions } from './actions.js'
import { setFeedbacks } from './feedbacks.js'
import { setPresets } from './presets.js'
import { setVariables, checkVariables } from './variables.js'
import { api } from './api.js'
import crypto from 'crypto'

// ########################
// #### Instance setup ####
// ########################
class MagewellProConvertDecoderInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	// Cleanup when the module gets deleted or disabled.
	async destroy() {
		this.clearSession()
		clearInterval(this.intervalID)
	}

	// Initalize module
	async init(config) {
		this.config = config
		this.updateStatus(InstanceStatus.Disconnected, 'Initializing')

		this.STATUS = {
			summaryInfo: {
				device: {
					name: null,
					model: null,
					productId: null,
					//authType: null,
					serialNo: null,
					hwRevision: null,
					fwVersion: null,
					//upToDate: null,
					outputState: null,
					cpuUsage: null,
					memoryUsage: null,
					coreTemp: null,
					boardId: null,
					upTime: null,
					//sdSize: null,
				},
				ethernet: {
					state: null,
					macAddr: null,
					//ipAddr: null,
					//ipMask: null,
					//gwAddr: null,
					//dnsAddr: null,
					txSpeedKbps: null,
					rxSpeedKbps: null,
				},
				rndis: {
					//state: null,
					//ipAddr: null,
					//txSpeedKbps: null,
					//rxSpeedKbps: null,
				},
				source: {
					name: null,
					url: null,
					connected: null,
					tallyPreview: null,
					tallyProgram: null,
					audioDropSamples: null,
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
			},
			videoConfig: {
				showTitle: null,
				showTally: null,
				showVUMeter: null,
				//vuMeterMode: null,
				showCenterCross: null,
				followInputMode: null,
				//safeAreaMode: null,
				identMode: null,
				identText: null,
				//hFlip: null,
				//vFlip: null,
				switchMode: null,
				deinterlaceMode: null,
				//arConvertMode: null,
				//inAutoColorFmt: null,
				//inColorFmt: null,
				//clipLeft: null,
				//clipTop: null,
				//clipRight: null,
				//clipBottom: null,
			},
			audioConfig: {
				checkPts: null,
				gain: null,
				//sampleRate: null,
				//channels: null,
				//bitCount: null,
				//convertMode: null,
				//ch0: null,
				//ch1: null,
				//ch2: null,
				//ch3: null,
				//ch4: null,
				//ch5: null,
				//ch6: null,
				//ch7: null,
				//ch8: null,
				//ch9: null,
				//ch10: null,
				//ch11: null,
				//ch12: null,
				//ch13: null,
				//ch14: null,
				//ch15: null,
			},
		}

		this.CHOICES_CHANNELS = [{ id: '', label: 'None' }]
		this.CHOICES_NDI_SOURCES = [{ id: '', label: 'None' }]

		this.session = undefined

		this.init_variables()
		this.init_actions()
		this.init_feedbacks()
		this.init_presets()

		this.checkVariables()

		this.updateStatus(InstanceStatus.Connecting)
		this.intervalID = setInterval(this.get_state, this.config.pollingrate, this)
	}

	// Update module after a config change
	async configUpdated(config) {
		this.clearSession()
		clearInterval(this.intervalID)
		this.updateStatus(InstanceStatus.Disconnected, 'Config changed')

		this.config = config

		this.updateStatus(InstanceStatus.Connecting)
		this.intervalID = setInterval(this.get_state, this.config.pollingrate, this)
	}

	setupSession(id) {
		if (id !== undefined && id !== this.session) {
			this.log('debug', 'New session: ' + id)
			this.session = id
		}
	}

	clearSession() {
		if (this.session !== undefined) {
			this.log('debug', 'Session destroyed: ' + this.session)
			this.session = undefined
		}
	}

	isValidSession() {
		return this.session !== undefined
	}

	getLabel(values, key) {
		return values.find((v) => v.id === key)?.label
	}

	handleHttpError(err) {
		this.updateStatus(InstanceStatus.ConnectionFailure, String(err))
	}

	sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms))
	}

	login() {
		this.log('debug', 'login()')
		this.clearSession()
		let session = undefined

		const request =
			`http://` +
			this.config.host +
			`/mwapi?method=login&id=` +
			this.config.username +
			`&pass=` +
			crypto.createHash('md5').update(this.config.password).digest('hex')

		fetch(request)
			.then((response) => {
				if (response.ok) {
					session = response.headers.getSetCookie()[0]
					return response.json()
				}
			})
			.then((data) => {
				//console.log(data)
				if (this.handleApiStatus(data)) {
					this.log('debug', 'login ok')
					this.setupSession(session)
				}
			})
			.catch((error) => {
				this.log('error', String(error))
				this.updateStatus(InstanceStatus.ConnectionFailure, String(error))
			})
	}

	getAPI(param, signal = undefined) {
		return new Promise((resolve, reject) => {
			if (!this.isValidSession()) reject('no session')
			fetch(`http://` + this.config.host + `/mwapi?method=` + param.method, { signal, headers: { cookie: this.session } })
				.then((response) => {
					if (response.ok) return response.json()
				})
				.then((data) => {
					//console.log(data)
					if (this.handleApiStatus(data)) {
						if (param.callback !== undefined) param.callback(this, data)
						resolve(data)
					}
					reject(data)
				})
				.catch((error) => {
					reject(error)
				})
		})
	}

	get_state(self) {
		const params = [
			{ method: `get-summary-info`, callback: self.get_summary_info },
			{ method: `get-video-config`, callback: self.get_video_config },
			{ method: `get-audio-config`, callback: self.get_audio_config },
			{ method: `list-channels`, callback: self.list_channels },
			{ method: `get-ndi-sources`, callback: self.get_ndi_sources },
		]

		const controller = new AbortController()
		const promises = params.map((param) => self.getAPI(param, controller.signal))
		const t = setTimeout(() => controller.abort(), self.config.pollingrate)
		const start = Date.now()
		//console.log('----------------------------------------------------------------------------')

		Promise.all(promises)
			.then((data) => {
				// all successfull
				//console.log(data)
			})
			.catch((error) => {
				// any rejected
				// remember: only first error will occur here, any other will be discarded.
				controller.abort() // Cancel any OTHER pending request
				// filter out abort errors
				if (error.name !== 'AbortError') {
					self.log('debug', String(error))
				}

				self.login()
			})
			.finally(() => {
				clearTimeout(t)

				const millis = Date.now() - start
				self.log('debug', `RTT: ${millis}ms`)

				self.checkVariables()
				self.checkFeedbacks()
			})
	}

	handleApiStatus(data) {
		if (data.status !== undefined) {
			switch (data.status) {
				case api.MW_STATUS_SUCCESS:
					this.updateStatus(InstanceStatus.Ok)
					return true //continue
				case api.MW_STATUS_AUTH_FAILED:
					this.log('warn', 'Authentication failed')
					this.updateStatus(InstanceStatus.AuthenticationFailure)
					break
				case api.MW_STATUS_NOT_LOGGED_IN:
					this.log('debug', 'Login required')
					break
				default:
					this.updateStatus(InstanceStatus.UnknownWarning, 'Status code: ' + this.getLabel(api.STATUS_CODES, data.status))
			}
		} else {
			this.updateStatus(InstanceStatus.Disconnected)
		}

		return false
	}

	get_summary_info(self, data) {
		self.STATUS.summaryInfo.device.name = data.device['name']
		self.STATUS.summaryInfo.device.model = data.device['model']
		self.STATUS.summaryInfo.device.productId = data.device['product-id']
		self.STATUS.summaryInfo.device.serialNo = data.device['serial-no']
		self.STATUS.summaryInfo.device.hwRevision = data.device['hw-revision']
		self.STATUS.summaryInfo.device.fwVersion = data.device['fw-version']
		self.STATUS.summaryInfo.device.outputState = data.device['output-state']
		self.STATUS.summaryInfo.device.cpuUsage = data.device['cpu-usage'].toFixed(2)
		self.STATUS.summaryInfo.device.memoryUsage = data.device['memory-usage'].toFixed(2)
		self.STATUS.summaryInfo.device.coreTemp = data.device['core-temp'].toFixed(2)
		self.STATUS.summaryInfo.device.boardId = data.device['board-id']
		self.STATUS.summaryInfo.device.upTime = data.device['up-time']

		self.STATUS.summaryInfo.ethernet.state = data.ethernet['state']
		self.STATUS.summaryInfo.ethernet.macAddr = data.ethernet['mac-addr']
		self.STATUS.summaryInfo.ethernet.txSpeedKbps = data.ethernet['tx-speed-kbps']
		self.STATUS.summaryInfo.ethernet.rxSpeedKbps = data.ethernet['rx-speed-kbps']

		self.STATUS.summaryInfo.source.name = data.ndi['name']
		self.STATUS.summaryInfo.source.url = data.ndi['url']
		self.STATUS.summaryInfo.source.connected = data.ndi['connected']
		self.STATUS.summaryInfo.source.tallyPreview = data.ndi['tally-preview']
		self.STATUS.summaryInfo.source.tallyProgram = data.ndi['tally-program']
		self.STATUS.summaryInfo.source.audioDropSamples = data.ndi['audio-drop-frames']
		self.STATUS.summaryInfo.source.videoDropFrames = data.ndi['video-drop-frames']
		self.STATUS.summaryInfo.source.videoBitRate = (data.ndi['video-bit-rate'] / 1000).toFixed(2)
		self.STATUS.summaryInfo.source.audioBitRate = data.ndi['audio-bit-rate']
		self.STATUS.summaryInfo.source.audioJitter = data.ndi['audio-jitter']
		self.STATUS.summaryInfo.source.videoJitter = data.ndi['video-jitter']
		self.STATUS.summaryInfo.source.videoWidth = data.ndi['video-width']
		self.STATUS.summaryInfo.source.videoHeight = data.ndi['video-height']
		self.STATUS.summaryInfo.source.videoScan = data.ndi['video-scan']
		self.STATUS.summaryInfo.source.videoFieldRate = data.ndi['video-field-rate']
		self.STATUS.summaryInfo.source.audioNumChannels = data.ndi['audio-num-channels']
		self.STATUS.summaryInfo.source.audioSampleRate = data.ndi['audio-sample-rate']
		self.STATUS.summaryInfo.source.audioBitCount = data.ndi['audio-bit-count']
	}

	get_video_config(self, data) {
		self.STATUS.videoConfig.showTitle = data['show-title']
		self.STATUS.videoConfig.showTally = data['show-tally']
		self.STATUS.videoConfig.showVUMeter = data['show-vu-meter']
		self.STATUS.videoConfig.showCenterCross = data['show-center-cross']
		self.STATUS.videoConfig.followInputMode = data['follow-input-mode']
		self.STATUS.videoConfig.identMode = data['ident-mode']
		self.STATUS.videoConfig.identText = data['ident-text']
		self.STATUS.videoConfig.switchMode = data['switch-mode']
		self.STATUS.videoConfig.deinterlaceMode = data['deinterlace-mode']
	}

	get_audio_config(self, data) {
		self.STATUS.audioConfig.checkPts = data['check-pts']
		self.STATUS.audioConfig.gain = data['gain']
	}

	list_channels(self, data) {
		const first = [{ id: '', label: 'None' }]
		const c = first.concat(data.channels.map((channel) => ({ id: channel['name'], label: channel['name'] })))
		if (
			self.CHOICES_CHANNELS.length !== c.length ||
			!self.CHOICES_CHANNELS.every((channel, index) => channel.id === c[index].id && channel.label === c[index].label)
		) {
			self.CHOICES_CHANNELS = c
			self.init_actions()
			self.init_feedbacks()
		}
	}

	get_ndi_sources(self, data) {
		const first = [{ id: '', label: 'None' }]
		const c = first.concat(data.sources.map((source) => ({ id: source['ndi-name'], label: source['ndi-name'] })))
		if (
			self.CHOICES_NDI_SOURCES.length !== c.length ||
			!self.CHOICES_NDI_SOURCES.every((source, index) => source.id === c[index].id && source.label === c[index].label)
		) {
			self.CHOICES_NDI_SOURCES = c
			self.init_actions()
			self.init_feedbacks()
		}
	}

	async sendCommand(method, args) {
		if (args !== '') {
			args = '&' + args
		}

		const cmd = `mwapi?method=${method}${args}`

		if (this.config.verbose) {
			this.log('debug', 'Sending: GET ' + cmd)
		}

		return this.getAPI({ method: method + args, callback: undefined })
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module will control a Magewell Pro Convert Decoder Device.',
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Device IP / Hostname',
				width: 4,
				// regex: this.REGEX_IP,
			},
			{
				type: 'textinput',
				id: 'username',
				label: 'Username',
				width: 4,
				default: 'Admin',
			},
			{
				type: 'textinput',
				id: 'password',
				label: 'Password',
				width: 4,
				default: 'Admin',
			},
			{
				type: 'static-text',
				id: 'dummy1',
				width: 12,
				label: ' ',
				value: ' ',
			},
			{
				type: 'static-text',
				id: 'info2',
				label: 'Polling',
				width: 12,
				value: `
				<div class="alert alert-warning">
					<strong>Please read:</strong>
					<br>
					Enabling polling unlocks these features:
					<br><br>
					<ul>
						<li>Changes made at the device outside of this module</li>
						<li>Currently selected channel, feedbacks, etc.</li>
					</ul>
					Enabling polling will send a request to the Device at a continuous interval.
					<br>
					<strong>This could have an undesired performance effect on your Device, depending on the polling rate.</strong>
					<br>
				</div>
			`,
			},
			{
				type: 'checkbox',
				id: 'polling',
				label: 'Enable Polling (necessary for feedbacks and variables)',
				default: true,
				width: 3,
			},
			{
				type: 'number',
				id: 'pollingrate',
				label: 'Polling Rate (in ms)',
				default: 1000,
				min: 1,
				max: 10000,
				width: 3,
				isVisible: (configValues) => configValues.polling === true,
			},
			{
				type: 'checkbox',
				id: 'verbose',
				label: 'Enable Verbose Logging',
				default: false,
			},
		]
	}

	// ##########################
	// #### Instance Actions ####
	// ##########################
	init_actions() {
		this.setActionDefinitions(setActions(this))
	}

	// ############################
	// #### Instance Feedbacks ####
	// ############################
	init_feedbacks(system) {
		this.setFeedbackDefinitions(setFeedbacks(this))
	}

	// ############################
	// #### Instance Variables ####
	// ############################
	init_variables() {
		this.setVariableDefinitions(setVariables(this))
	}

	// Update Values
	checkVariables() {
		checkVariables(this)
	}

	// ##########################
	// #### Instance Presets ####
	// ##########################
	init_presets() {
		this.setPresetDefinitions(setPresets(this))
	}
}

runEntrypoint(MagewellProConvertDecoderInstance, [])
