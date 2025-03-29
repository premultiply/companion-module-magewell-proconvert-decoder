import { runEntrypoint, InstanceBase, InstanceStatus } from '@companion-module/base'
import { setActions } from './actions.js'
import { setFeedbacks } from './feedbacks.js'
import { setPresets } from './presets.js'
import { setVariables, checkVariables } from './variables.js'
import { api } from './api.js'
import got from 'got'
import crypto from 'crypto'

// ########################
// #### Instance setup ####
// ########################
class MagewellProConvertDecoderInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	/* 	STATUS = {
		information: '',
		summary: {
			name: '',
			model: '',
			productId: '',
			authType: '',
			serialNumber: '',
			hwRevision: '',
			fwVersion: '',
			uptodate: true,
			outputState: '',
			cpuUsage: '',
			memoryUsage: '',
			coreTemp: '',
			boardId: '',
			upTime: '',
			sdSize: '',
			ndi: {
				name: '',
				connected: false,
			},
		},
		videoConfig: {
			showTitle: false,
			showTally: false,
			showVUMeter: false,
			VUMeterMode: 'none',
			showCenterCross: false,
			safeAreaMode: 'none',
			identMode: 'none',
			identText: '',

			hFlip: false,
			vFlip: false,
			deinterlaceMode: 'bob',
			arConvertMode: 'full',
			alphaDispMode: 'alpha-blend-checkerboard',

			autoColorFmt: true,
			colorFmt: 'bt.709',
			switchMode: 'blank',
		},
		videoMode: {
			width: 1920,
			height: 1080,
			interlaced: false,
			fieldRate: 5000,
			aspectRatio: '16:9',
		},
		audioConfig: {
			gain: 0.0,
			sampleRate: 48000,
			channels: 2,
		},
		channelConfig: {
			currentChannel: '',
			currentChannelNDI: true,
			NDIEnableDiscovery: false,
			NDIDiscoveryServer: '',
			NDISourceName: '',
			NDIGroupName: '',
			NDILowBandwidth: false,
			bufferDuration: 60,
		},
		networkConfig: {
			useDHCP: true,
			deviceName: '',
			state: '',
			mac: '',
			tx: '',
			rx: '',
		},
	} */

	session = undefined

	// Initalize module
	async init(config) {
		this.config = config
		this.updateStatus(InstanceStatus.Disconnected, 'Initializing')

		/* 		this.init_actions()
		this.init_feedbacks()
		this.init_variables()
		this.init_presets()

		this.checkVariables() */

		//this.get_state()
		this.updateStatus(InstanceStatus.Connecting)
		this.intervalID = setInterval(this.get_state, this.config.pollingrate, this)
	}

	// Update module after a config change
	async configUpdated(config) {
		this.config = config
		this.updateStatus(InstanceStatus.Disconnected, 'Config changed')
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
		return session !== undefined
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
					data = response.json()
					if (this.handleApiStatus(data)) {
						this.log('debug', 'login ok')
						this.setupSession(session)
					}
				}
			})
			.catch((error) => {
				this.updateStatus(InstanceStatus.ConnectionFailure, String(error))
			})
	}

	getAPI(param, session, signal = undefined) {
		return new Promise((resolve, reject) =>
			fetch(`http://` + this.config.host + `/mwapi?method=` + param.method, { signal, headers: { cookie: session } })
				.then((response) => {
					if (response.ok) {
						session = response.headers.getSetCookie()[0]
						return response.json()
					}
				})
				.catch((error) => {
					reject(error)
				})
				.then((data) => {
					if (this.handleApiStatus(data)) {
						this.setupSession(session)
						resolve(data)
					}
					reject(this.getLabel(api.STATUS_CODES, data.status))
				})
				.catch((error) => {
					reject(error)
				})
		)
	}

	get_state(self) {
		const params = [
			{ method: `get-summary-info`, callback: self.get_summary_info },
			{ method: `get-video-config`, callback: self.get_video_config },
			{ method: `get-video-mode`, callback: self.get_video_mode },
			{ method: `get-audio-config`, callback: self.get_audio_config },
			{ method: `list-channels`, callback: self.list_channels },
			{ method: `get-ndi-sources`, callback: self.get_ndi_sources },
			{ method: `get-channel`, callback: self.get_channel },
			{ method: `get-ndi-config`, callback: self.get_ndi_config },
			{ method: `get-playback-config`, callback: self.get_playback_config },
			{ method: `get-eth-status`, callback: self.get_eth_status },
		]

		const controller = new AbortController()
		const promises = params.map((param) => self.getAPI(param, self.session, controller.signal))

		Promise.all(promises)
			.then((data) => {
				console.log(data)
				//self.log('debug', String(data))
			})
			.catch((error) => {
				// remember: only first error will occur here, any other will be discarded.
				controller.abort() // Cancel any other pending requests
				self.login()
			})

		/* 	this.get_summary_info(),

			//Video
			this.get_video_config(),
			this.get_video_mode(),

			//Audio
			this.get_audio_config(),

			//Channels and NDI Sources
			this.list_channels(),
			this.get_ndi_sources(),
			this.get_channel(), //gets the currently selected source channel for decoding
			this.get_ndi_config(),
			this.get_playback_config(),

			//Network
			this.get_eth_status()
		] */
	}

	handleApiStatus(data) {
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

		return false
	}

	async get_summary_info() {
		const cmd = `mwapi?method=get-summary-info`
		try {
			const response = await got.get(cmd, this.got_options)
			if (this.handleApiStatus(response)) {
				//this.log('info', 'Response: ' + JSON.stringify(response.body))
				this.STATUS.summary.name = response.body.device['name']
				this.STATUS.summary.model = response.body.device['model']
				this.STATUS.summary.productId = response.body.device['product-id']
				this.STATUS.summary.authType = response.body.device['auth-type']
				this.STATUS.summary.serialNumber = response.body.device['serial-no']
				this.STATUS.summary.hwRevision = response.body.device['hw-revision']
				this.STATUS.summary.fwVersion = response.body.device['fw-version']
				this.STATUS.summary.uptodate = response.body.device['up-to-date']
				this.STATUS.summary.outputState = response.body.device['output-state']
				this.STATUS.summary.cpuUsage = response.body.device['cpu-usage']
				this.STATUS.summary.memoryUsage = response.body.device['memory-usage']
				this.STATUS.summary.coreTemp = response.body.device['core-temp']
				this.STATUS.summary.boardId = response.body.device['board-id']
				this.STATUS.summary.upTime = response.body.device['up-time']
				this.STATUS.summary.sdSize = response.body.device['sd-size']

				this.STATUS.summary.ndi.name = response.body.ndi['name']
				this.STATUS.summary.ndi.connected = response.body.ndi['connected']

				return true //successful
			}
		} catch (err) {
			this.handleHttpError(err)
		}

		return false //not successful, abort data polling
	}

	async get_video_config() {
		const cmd = `mwapi?method=get-video-config`
		try {
			const response = await got.get(cmd, this.got_options)
			if (this.handleApiStatus(response)) {
				//OSD
				this.STATUS.videoConfig.showTitle = response.body['show-title']
				this.STATUS.videoConfig.showTally = response.body['show-tally']
				this.STATUS.videoConfig.showVUMeter = response.body['show-vu-meter']
				this.STATUS.videoConfig.VUMeterMode = response.body['vu-meter-mode']
				this.STATUS.videoConfig.showCenterCross = response.body['show-center-cross']
				this.STATUS.videoConfig.safeAreaMode = response.body['safe-area-mode']
				this.STATUS.videoConfig.identMode = response.body['ident-mode']
				this.STATUS.videoConfig.identText = response.body['ident-text']

				//Process
				this.STATUS.videoConfig.hFlip = response.body['h-flip']
				this.STATUS.videoConfig.vFlip = response.body['v-flip']
				this.STATUS.videoConfig.deinterlaceMode = response.body['deinterlace-mode']
				this.STATUS.videoConfig.arConvertMode = response.body['ar-convert-mode']
				this.STATUS.videoConfig.alphaDispMode = response.body['alpha-disp-mode']

				//Source
				this.STATUS.videoConfig.autoColorFmt = response.body['in-auto-color-fmt']
				this.STATUS.videoConfig.colorFmt = response.body['in-color-fmt']
				this.STATUS.videoConfig.switchMode = response.body['switch-mode']

				this.checkVariables()
				this.checkFeedbacks()
			}
		} catch (err) {
			this.handleHttpError(err)
		}
	}

	async get_video_mode() {
		const cmd = `mwapi?method=get-video-mode`
		try {
			const response = await got.get(cmd, this.got_options)
			if (this.handleApiStatus(response)) {
				//Video Mode
				this.STATUS.videoMode.width = response.body['width']
				this.STATUS.videoMode.height = response.body['height']
				this.STATUS.videoMode.interlaced = response.body['interlaced']
				this.STATUS.videoMode.fieldRate = response.body['field-rate']
				this.STATUS.videoMode.aspectRatio = response.body['aspect-ratio']

				this.checkVariables()
				this.checkFeedbacks()
			}
		} catch (err) {
			this.handleHttpError(err)
		}
	}

	async get_audio_config() {
		const cmd = `mwapi?method=get-audio-config`
		try {
			const response = await got.get(cmd, this.got_options)
			if (this.handleApiStatus(response)) {
				this.STATUS.audioConfig.gain = response.body['gain']
				this.STATUS.audioConfig.sampleRate = response.body['sample-rate']
				this.STATUS.audioConfig.channels = response.body['channels']

				this.checkVariables()
				this.checkFeedbacks()
			}
		} catch (err) {
			this.handleHttpError(err)
		}
	}

	async list_channels() {
		const cmd = `mwapi?method=list-channels`
		try {
			const response = await got.get(cmd, this.got_options)
			// Success
			let old_channels = this.CHOICES_CHANNELS
			this.CHOICES_CHANNELS = []
			if (this.handleApiStatus(response) && response.body.channels && response.body.channels.length) {
				for (let i = 0; i < response.body.channels.length; i++) {
					let channelName = response.body.channels[i]['name']
					let channelObj = { id: channelName, label: channelName }
					this.CHOICES_CHANNELS.push(channelObj)
				}
				if (JSON.stringify(old_channels) !== JSON.stringify(this.CHOICES_CHANNELS)) {
					this.init_actions() //republish list of actions because of new channels
					this.init_feedbacks() //republish list of feedbacks because of new NDI sources
				}
			}
		} catch (err) {
			this.handleHttpError(err)
		}
	}

	async get_ndi_sources() {
		const cmd = `mwapi?method=get-ndi-sources`
		try {
			const response = await got.get(cmd, this.got_options)
			if (this.handleApiStatus(response) && response.body.sources && response.body.sources.length) {
				let old_ndi_sources = this.CHOICES_NDI_SOURCES

				this.CHOICES_NDI_SOURCES = []

				for (let i = 0; i < response.body.sources.length; i++) {
					let ndiName = response.body.sources[i]['ndi-name']
					let ipAddr = response.body.sources[i]['ip-addr']

					let ndiSourceObj = { id: ndiName, label: ndiName + ' (' + ipAddr + ')' }
					this.CHOICES_NDI_SOURCES.push(ndiSourceObj)
				}

				if (this.CHOICES_NDI_SOURCES.length == 0) {
					this.CHOICES_NDI_SOURCES.push({ id: -1, label: 'No NDI Sources loaded.' })
				}

				if (JSON.stringify(old_ndi_sources) !== JSON.stringify(this.CHOICES_NDI_SOURCES)) {
					this.init_actions() //republish list of actions because of new NDI sources
					this.init_feedbacks() //republish list of feedbacks because of new NDI sources
				}
			}
		} catch (err) {
			this.handleHttpError(err)
		}
	}

	async get_channel() {
		const cmd = `mwapi?method=get-channel`
		try {
			const response = await got.get(cmd, this.got_options)
			if (this.handleApiStatus(response) && response.body.name) {
				this.STATUS.channelConfig.currentChannel = response.body.name
				if (response.body['ndi-name'] == true) {
					this.STATUS.channelConfig.currentChannelNDI = true
				} else {
					this.STATUS.channelConfig.currentChannelNDI = false
				}
			}

			this.checkVariables()
			this.checkFeedbacks()
		} catch (err) {
			this.handleHttpError(err)
		}
	}

	async get_ndi_config() {
		const cmd = `mwapi?method=get-ndi-config`
		try {
			const response = await got.get(cmd, this.got_options)
			if (this.handleApiStatus(response)) {
				this.STATUS.channelConfig.NDIEnableDiscovery = response.body['enable-discovery']
				this.STATUS.channelConfig.NDIDiscoveryServer = response.body['discovery-server']
				this.STATUS.channelConfig.NDISourceName = response.body['source-name']
				this.STATUS.channelConfig.NDIGroupName = response.body['group-name']
				this.STATUS.channelConfig.NDILowBandwidth = response.body['low-bandwidth']

				this.checkVariables()
				this.checkFeedbacks()
			}
		} catch (err) {
			this.handleHttpError(err)
		}
	}

	async get_playback_config() {
		const cmd = `mwapi?method=get-playback-config`
		try {
			const response = await got.get(cmd, this.got_options)
			if (this.handleApiStatus(response)) {
				this.STATUS.channelConfig.bufferDuration = response.body['buffer-duration']

				this.checkVariables()
				this.checkFeedbacks()
			}
		} catch (err) {
			this.handleHttpError(err)
		}
	}

	async get_eth_status() {
		const cmd = `mwapi?method=get-eth-status`
		try {
			const response = await got.get(cmd, this.got_options)
			if (this.handleApiStatus(response)) {
				this.STATUS.networkConfig.useDHCP = response.body['use-dhcp']
				this.STATUS.networkConfig.deviceName = response.body['device-name']
				this.STATUS.networkConfig.state = response.body['state']
				this.STATUS.networkConfig.mac = response.body['mac-addr']
				this.STATUS.networkConfig.tx = response.body['tx-speed-kbps']
				this.STATUS.networkConfig.rx = response.body['rx-speed-kbps']

				this.checkVariables()
				this.checkFeedbacks()
			}
		} catch (err) {
			this.handleHttpError(err)
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

		try {
			const response = await got.get(cmd, this.got_options)
			if (this.handleApiStatus(response)) {
				if (this.config.verbose) {
					this.log('debug', 'Status Code Received: ' + response.body.status)
				}
				this.processStatusCode(response.body.status)
			}
		} catch (err) {
			this.handleHttpError(err)
		}
	}

	processStatusCode(statusCode) {
		if (statusCode == 37) {
			//not logged in
			this.handleHttpError('Error: Not logged into Device. Re-initiating login.')
			this.login()
		} else if (statusCode !== 0) {
			let statusObj = this.STATUS_CODES.find(({ number }) => number === statusCode)
			this.handleHttpError(statusObj.status)
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

	// Cleanup when the module gets deleted or disabled.
	async destroy() {
		clearInterval(this.intervalID)

		this.debug('destroy')
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
