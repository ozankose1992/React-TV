import * as React from 'react';
import './index.css';
import { HttpService } from './../../httpService.jsx';
import {widget} from '../../charting_library/charting_library.min';

export class TVChartContainer extends React.PureComponent {
	static defaultProps = {
		symbol: 'VET-USDT.CISCALC',
		interval: '1D',
		containerId: 'tv_chart_container',
		datafeedUrl: 'https://demo_feed.tradingview.com',
		libraryPath: '/charting_library/',
		chartsStorageUrl: 'https://saveload.tradingview.com',
		chartsStorageApiVersion: '1.1',
		clientId: 'tradingview.com',
		userId: 'public_user_id',
		fullscreen: false,
		autosize: true
	};

	// Reference to widget object
	tvWidget = null;
    // Service for fetching data
	apiService = new HttpService();
	// Data feed reference
	_datafeed;
	// Default timezone of the chart
	timezone = 'Etc/UTC';

	// We are saying our feed supports these aggregations
	intradayMultipliers = ['1', '5', '15', '30', '60'];
	// Supported resolutions (No following abbr means minutes)
	config = {
		supported_resolutions: ['1', '5', '15', '30', '60', '1D']
	};

	componentDidMount() {

		this.dataFeed = {
			onReady: cb => {
				setTimeout(() => cb(this.config), 0);

			},
			searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
				this.apiService.searchSymbol(this.props.symbol.split(/[-.]/)[1], userInput).then(res => {
					onResultReadyCallback(res);
				});
			},
			resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
				this.apiService.loadLatestPrice(symbolName).then(price => {
					const splitData = symbolName.split(/[-.]/);
					const symbolStub = {
						name: symbolName, // Name of the symbol
						ticker: symbolName, // Unique identifier for the symbol to fetch data
						description: `${splitData[0]}/${splitData[1]}`, // Chart Legend
						type: 'crypto', // Type of the symbol (Don't know what is useful for maybe grouping symbols)
						session: '24x7', // Special session string for crypto
						exchange: '', // Exchange of the symbol (e.g Bitfinex), shown in legend
						listed_exchange: '', // Listed exchange same logic above required
						timezone: this.timezone, // Timezone of the chart
						format: 'price', // Formats decimal or fractional numbers based on params (minmov, pricescale)
						minmov: 1, // Did not understand what this is...
						pricescale: this.decimalDetector(price), // Number of decimal places 10's power (e.g 1.01 => 100, 1.005 => 1000)
						has_intraday: true, // E.g 1 minute, 2 minute resolutions...
						supported_resolutions:  this.config.supported_resolutions, // Symbol specific resolutions
						intraday_multipliers: this.intradayMultipliers, // Aggregate multipliers that our data feed supports
						has_seconds: false, // If we are supporting second resolutions
						seconds_multipliers: [], // Second aggregate multipliers
						has_daily: true,  // Indicates if data feed supports daily aggregates (only 1 daily requested by TV)
						has_weekly_and_monthly: false, // Indicates if data feed supports these aggregates (only 1 weekly/yearly requested by TV)
						has_empty_bars: true, // Fill chart with empty bars for empty data
						has_no_volume: true, // Indicates if data has volume values
						volume_precision: 2, // Decimal places for volume (2 values after comma)
						full_name: symbolName // Not documented but required
					};
					onSymbolResolvedCallback(symbolStub);
				});
			},
			getBars: (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
				// Do not feed from/to if this is the first request
				const paramFrom = firstDataRequest ? null : from;
				const paramTo = firstDataRequest ? null : to;
				this.apiService.getTSData(symbolInfo.name, resolution, paramFrom, paramTo).then(bars => {
					// If there are bars to show send to history callback and let TV handle the draw
					if (bars && bars.length) {
						onHistoryCallback(bars, {noData: false});
					} else {
						onHistoryCallback([], {noData: true});
					}
				});
			},
			subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
				// this.socketService.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback,history)
			},
			unsubscribeBars: subscriberUID => {
				// this.socketService.unsubscribeBars(subscriberUID)
			},
			calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
				// Requesting daily resolution, fetch 12 months worth of daily data
				if (resolution.endsWith('D')) {
					return {
						resolutionBack: 'D',
						intervalBack: 1440 // Too keep same limit value with intraday resolutions
					};
				}

				// If resolution only contains digits scale wrt base 1 day worth of minutes
				if (/^\d+$/.test(resolution)) {
					const minInt = parseInt(resolution);
					return {
						resolutionBack: 'D',
						intervalBack: 1 * minInt // Base is 1 day for 1 minute data
					};
				}

				return undefined;
			}
		};

		const widgetOptions = {
			symbol: this.props.symbol, // Default symbol of the chart (We don't have default symbol)
			interval: this.props.interval, // Default interval of the chart (1D)
			container_id: this.props.containerId, // Id of container DOM element
			datafeed: this.dataFeed, // Datafeed that will be used to provide data (has special interface check docs)
			library_path: this.props.libraryPath, // Path to the TV library
			fullscreen: this.props.fullscreen, // Enable full screen mode
			autosize: this.props.autosize, // Let chart to autosize itself wrt changes
			locale: 'en', // Chart locale
			disabled_features: ['border_around_the_chart', 'header_symbol_search', 'uppercase_instrument_names',
				'symbol_search_hot_key', 'header_saveload', 'header_undo_redo'], // Features that are disabled check docs
			theme: 'Dark', // Default theme of the chart
			custom_css_url: 'https://cisfunctionsstorage.blob.core.windows.net/tv-css/custom.css', // Design css url
			overrides: { // Chart colors
				'editorFontsList': '["Roboto"]',
				'paneProperties.background': '#292E33',
				'paneProperties.vertGridProperties.color': '#41464b',
				'paneProperties.horzGridProperties.color': '#41464b',
				'paneProperties.crossHairProperties.color': '#989898',
				'paneProperties.crossHairProperties.width': 1,
			},
			loading_screen: { backgroundColor: '#292E33' }, // Loading screen color
			charts_storage_url: this.props.chartsStorageUrl, // Handle user saved charts
			charts_storage_api_version: this.props.chartsStorageApiVersion, // Handle user saved charts
			client_id: this.props.clientId, // Handle user saved charts
			user_id: this.props.userId, // Handle user saved charts
			time_frames: [ // Supported timeframes (These are default)
				{ text: "1y", resolution: "D", description: "1 Year" },
				{ text: "3m", resolution: "60", description: "3 Months" },
				{ text: "1m", resolution: "30", description: "1 Month" },
				{ text: "5d", resolution: "5", description: "5 Day" },
				{ text: "1d", resolution: "1", description: "1 Day" }
			]
		};

		const tvWidget = new widget(widgetOptions);
		this.tvWidget = tvWidget;

		tvWidget.onChartReady(() => {
			// Do Something On Chart Ready
		});
	}

	/**
	 * Detect how many decimal places a symbol need
	 *
	 * @param num decimal place on number
	 * @param multiplier Multiplier for decimal place
	 */
	decimalDetector(num, multiplier = 1) {
		if (num > 1 || num === 0) {
			return 100 * multiplier;
		} else {
			return this.decimalDetector(num * multiplier, multiplier * 10);
		}
	}

	componentWillUnmount() {
		if (this.tvWidget !== null) {
			this.tvWidget.remove();
			this.tvWidget = null;
		}
	}

	render() {
		return (
			<div
				id={ this.props.containerId }
				className={ 'TVChartContainer' }
			/>
		);
	}
}
