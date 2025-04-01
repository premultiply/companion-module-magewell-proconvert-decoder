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

		this.pollID = null
	}

	// Cleanup when the module gets deleted or disabled.
	async destroy() {
		this.clearSession()
		this.stopPolling()
		this.updateStatus(InstanceStatus.Disconnected)
	}

	// Initalize module
	async init(config) {
		this.config = config

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

		this.startPolling()
	}

	// Update module after a config change
	async configUpdated(config) {
		this.clearSession()
		this.stopPolling()
		this.updateStatus(InstanceStatus.Disconnected, 'Config changed')

		this.config = config

		this.startPolling()
	}

	startPolling() {
		clearInterval(this.pollID)
		this.pollID = setInterval(() => this.poll(), this.config.pollingrate)
		this.log('debug', 'Polling started with ' + this.config.pollingrate + 'ms interval')
	}

	stopPolling() {
		clearInterval(this.pollID)
		this.pollID = null
		this.log('debug', 'Polling stopped')
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

	async login() {
		this.log('debug', 'login()')

		this.stopPolling()
		this.clearSession()

		this.updateStatus(InstanceStatus.Connecting, 'Connecting to ' + this.config.host)

		let cookie = undefined

		const url = `http://` + this.config.host + `/mwapi?method=login&id=` + this.config.username + `&pass=` + crypto.createHash('md5').update(this.config.password).digest('hex')
		this.log('debug', 'GET ' + url)

		const c = new AbortController()
		const t = setTimeout(() => c.abort(), 10000)

		const start = Date.now()

		try {
			const response = await fetch(url, { signal: c.signal })
			if (response.ok) {
				cookie = response.headers.getSetCookie()[0]
				if (this.apiStatusIsSuccess(await response.json())) {
					this.log('debug', `login successful after ${Date.now() - start}ms`)
					this.setupSession(cookie)
					this.updateStatus(InstanceStatus.Ok, 'Connected to ' + this.config.host)

					return true
				}
			}
		} catch (error) {
			this.log('error', `login attempt failed after ${Date.now() - start}ms`)
			if (error.name === 'AbortError') {
				this.updateStatus(InstanceStatus.Disconnected, 'Timeout')
			} else {
				this.updateStatus(InstanceStatus.ConnectionFailure, String(error))
			}
		} finally {
			clearTimeout(t)
			this.startPolling()
		}

		return false
	}

	async getAPI(param, signal = undefined) {
		if (!this.isValidSession()) throw new Error('no session')

		const url = `http://` + this.config.host + `/mwapi?method=` + param.method
		this.log('debug', 'GET ' + url)

		const response = await fetch(url, { signal, headers: { cookie: this.session } })
		if (!response.ok) throw new Error('HTTP error: ' + response.status)

		const data = await response.json()
		if (!this.apiStatusIsSuccess(data)) throw new Error('API operation was rejected')

		if (param.callback !== undefined) param.callback.call(this, data)

		return data
	}

	async poll() {
		this.log('debug', 'poll()')

		if (!this.isValidSession()) {
			this.login()
			return
		}

		const params = [
			{ method: `get-summary-info`, callback: this.get_summary_info },
			{ method: `get-video-config`, callback: this.get_video_config },
			{ method: `get-audio-config`, callback: this.get_audio_config },
			{ method: `list-channels`, callback: this.list_channels },
			{ method: `get-ndi-sources`, callback: this.get_ndi_sources },
		]

		const c = new AbortController()
		const t = setTimeout(() => c.abort(), this.config.pollingrate / 2)
		const requests = params.map((param) => this.getAPI(param, c.signal))

		const start = Date.now()
		try {
			await Promise.all(requests)
			this.log('debug', `All async API requests are resolved after ${Date.now() - start}ms`)

			this.checkVariables()
			this.checkFeedbacks()
		} catch (error) {
			c.abort() // cancel any OTHER pending request

			this.log('debug', `One of the async API requests is rejected with error "` + String(error) + `" after ${Date.now() - start}ms`)

			this.login()
		} finally {
			clearTimeout(t)
		}
	}

	apiStatusIsSuccess(data) {
		if (typeof data === 'undefined' || typeof data.status === 'undefined') {
			this.updateStatus(InstanceStatus.UnknownError, 'Invalid API response from device')
			return false
		}

		switch (data.status) {
			case api.MW_STATUS_SUCCESS:
				//this.updateStatus(InstanceStatus.Ok)
				return true //continue
			case api.MW_STATUS_AUTH_FAILED:
				this.log('error', 'Authentication failed')
				this.updateStatus(InstanceStatus.AuthenticationFailure)
				break
			case api.MW_STATUS_NOT_LOGGED_IN:
				this.log('debug', 'Login required')
				break
			default: {
				const statusLabel = this.getLabel(api.STATUS_CODES, data.status)
				this.updateStatus(InstanceStatus.UnknownWarning, 'Unexpected status code: ' + statusLabel)
			}
		}

		return false
	}

	get_summary_info(data) {
		this.STATUS.summaryInfo.device.name = data.device['name']
		this.STATUS.summaryInfo.device.model = data.device['model']
		this.STATUS.summaryInfo.device.productId = data.device['product-id']
		this.STATUS.summaryInfo.device.serialNo = data.device['serial-no']
		this.STATUS.summaryInfo.device.hwRevision = data.device['hw-revision']
		this.STATUS.summaryInfo.device.fwVersion = data.device['fw-version']
		this.STATUS.summaryInfo.device.outputState = data.device['output-state']
		this.STATUS.summaryInfo.device.cpuUsage = data.device['cpu-usage']
		this.STATUS.summaryInfo.device.memoryUsage = data.device['memory-usage']
		this.STATUS.summaryInfo.device.coreTemp = data.device['core-temp']
		this.STATUS.summaryInfo.device.boardId = data.device['board-id']
		this.STATUS.summaryInfo.device.upTime = data.device['up-time']

		this.STATUS.summaryInfo.ethernet.state = data.ethernet['state']
		this.STATUS.summaryInfo.ethernet.macAddr = data.ethernet['mac-addr']
		this.STATUS.summaryInfo.ethernet.txSpeedKbps = data.ethernet['tx-speed-kbps']
		this.STATUS.summaryInfo.ethernet.rxSpeedKbps = data.ethernet['rx-speed-kbps']

		this.STATUS.summaryInfo.source.name = data.ndi['name']
		this.STATUS.summaryInfo.source.url = data.ndi['url']
		this.STATUS.summaryInfo.source.connected = data.ndi['connected']
		this.STATUS.summaryInfo.source.tallyPreview = data.ndi['tally-preview']
		this.STATUS.summaryInfo.source.tallyProgram = data.ndi['tally-program']
		this.STATUS.summaryInfo.source.audioDropSamples = data.ndi['audio-drop-frames']
		this.STATUS.summaryInfo.source.videoDropFrames = data.ndi['video-drop-frames']
		this.STATUS.summaryInfo.source.videoBitRate = data.ndi['video-bit-rate']
		this.STATUS.summaryInfo.source.audioBitRate = data.ndi['audio-bit-rate']
		this.STATUS.summaryInfo.source.audioJitter = data.ndi['audio-jitter']
		this.STATUS.summaryInfo.source.videoJitter = data.ndi['video-jitter']
		this.STATUS.summaryInfo.source.videoWidth = data.ndi['video-width']
		this.STATUS.summaryInfo.source.videoHeight = data.ndi['video-height']
		this.STATUS.summaryInfo.source.videoScan = data.ndi['video-scan']
		this.STATUS.summaryInfo.source.videoFieldRate = data.ndi['video-field-rate']
		this.STATUS.summaryInfo.source.audioNumChannels = data.ndi['audio-num-channels']
		this.STATUS.summaryInfo.source.audioSampleRate = data.ndi['audio-sample-rate']
		this.STATUS.summaryInfo.source.audioBitCount = data.ndi['audio-bit-count']
	}

	get_video_config(data) {
		this.STATUS.videoConfig.showTitle = data['show-title']
		this.STATUS.videoConfig.showTally = data['show-tally']
		this.STATUS.videoConfig.showVUMeter = data['show-vu-meter']
		this.STATUS.videoConfig.showCenterCross = data['show-center-cross']
		this.STATUS.videoConfig.followInputMode = data['follow-input-mode']
		this.STATUS.videoConfig.identMode = data['ident-mode']
		this.STATUS.videoConfig.identText = data['ident-text']
		this.STATUS.videoConfig.switchMode = data['switch-mode']
		this.STATUS.videoConfig.deinterlaceMode = data['deinterlace-mode']
	}

	get_audio_config(data) {
		this.STATUS.audioConfig.checkPts = data['check-pts']
		this.STATUS.audioConfig.gain = data['gain']
	}

	list_channels(data) {
		const first = [{ id: '', label: 'None' }]
		const c = first.concat(data.channels.map((channel) => ({ id: channel['name'], label: channel['name'] })))
		if (this.CHOICES_CHANNELS.length !== c.length || !this.CHOICES_CHANNELS.every((channel, index) => channel.id === c[index].id && channel.label === c[index].label)) {
			this.CHOICES_CHANNELS = c
			this.init_actions()
			this.init_feedbacks()
		}
	}

	get_ndi_sources(data) {
		const first = [{ id: '', label: 'None' }]
		const c = first.concat(data.sources.map((source) => ({ id: source['ndi-name'], label: source['ndi-name'] })))
		if (this.CHOICES_NDI_SOURCES.length !== c.length || !this.CHOICES_NDI_SOURCES.every((source, index) => source.id === c[index].id && source.label === c[index].label)) {
			this.CHOICES_NDI_SOURCES = c
			this.init_actions()
			this.init_feedbacks()
		}
	}

	async sendCommand(method, args = '') {
		if (this.isValidSession() || (await this.login())) {
			if (args !== '') args = '&' + args

			this.log('debug', 'GET mwapi?method=' + method + args)

			const c = new AbortController()
			const t = setTimeout(() => c.abort(), this.config.pollingrate)

			try {
				const data = await this.getAPI({ method: method + args, callback: undefined }, c.signal)
				this.log('debug', 'OK ' + this.getLabel(api.STATUS_CODES, data.status))
			} catch (error) {
				this.log('debug', 'FAILED ' + String(error))
			} finally {
				clearTimeout(t)
			}
		} else {
			this.log('error', 'Unable to send command. No connection to device.')
		}
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
	init_feedbacks() {
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
