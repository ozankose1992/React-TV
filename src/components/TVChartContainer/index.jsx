import * as React from 'react';
import './index.css';
import { HttpService } from './../../httpService.jsx';
import {widget} from '../../charting_library/charting_library.min';

export class TVChartContainer extends React.PureComponent {
	static defaultProps = {
		symbol: 'BTC-USDT.CISCALC',
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

	tvWidget = null;

	apiService = new HttpService();
	dataFeed;
	timezone = 'Etc/UTC';
	supportedResolutions = ['1', '1D'];
	config = {
		supported_resolutions: this.supportedResolutions
	};


	componentDidMount() {

		this.dataFeed = {
			onReady: cb => {
				setTimeout(() => cb(this.config), 0);

			},
			searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {},
			resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
				const splitData = symbolName.split(/[-.]/);

				const symbolStub = {
					name: symbolName,
					description: `${splitData[0]}/${splitData[1]}`,
					type: 'crypto',
					session: '24x7',
					timezone: this.timezone,
					ticker: symbolName,
					exchange: splitData[0],
					minmov: 1,
					pricescale: 100000000,
					has_intraday: true,
					has_no_volume: true,
					has_daily: true,
					expired: true,
					expiration_date: 1579523940,
					intraday_multipliers: ['1'],
					supported_resolutions:  this.supportedResolutions,
					volume_precision: 8,
					full_name: 'full_name',
					listed_exchange: 'listed_exchange',
					format: 'price'
				};

				symbolStub.pricescale = 100;
				setTimeout(() => {
					onSymbolResolvedCallback(symbolStub);
				}, 0);


			},
			getBars: (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
				// console.log('function args',arguments)
				// console.log(`Requesting bars between ${new Date(from * 1000).toISOString()} and ${new Date(to * 1000).toISOString()}`)
				console.log("Get bars called...", resolution, from, to);
				if (resolution === '1D') {
					resolution = '1440';
				}
				if (resolution === '3D') {
					resolution = '4320';
				}

				// Sending 2000 default limit
				this.apiService.getTSData(symbolInfo.name, resolution, firstDataRequest ? null : from, to).then((data) => {
					// if (data.Response && data.Response === 'Error') {
					//   console.log('CryptoCompare data fetching error :', data.Message);
					//   onHistoryCallback([], {noData: true});
					// }


					if (data['data'] && data['data'].length) {
						const indexMap = {};
						data['fields'].forEach((item, index) => {
							indexMap[item] = index;
						});

						const bars = data['data'].map(el => {
							return {
								time: el[indexMap['ts']],
								low: el[indexMap['l']],
								high: el[indexMap['h']],
								open: el[indexMap['o']],
								close: el[indexMap['c']],
								volume: null
							};
						});
						// if (firstDataRequest) {
						//   const lastBarEl = bars[0];
						//   history[symbolInfo.name] = { lastBar : lastBarEl};
						//
						// }

						if (bars.length) {
							onHistoryCallback(bars.reverse(), {noData: false});
						} else {
							onHistoryCallback([], {noData: true});
						}
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
				console.log("On History Callback...")
				console.log('resolution ' + resolution);
				if (resolution === '1D') {
					return {
						resolutionBack: 'M',
						intervalBack: 6
					};
				}
				if (resolution === '1') {
					return {
						resolutionBack: 'D',
						intervalBack: 1
					}
				}

				return undefined;
			}
		};

		const widgetOptions = {
			symbol: this.props.symbol,
			// BEWARE: no trailing slash is expected in feed URL
			datafeed: this.dataFeed,
			interval: this.props.interval,
			container_id: this.props.containerId,
			library_path: this.props.libraryPath,
			locale: 'en',
			disabled_features: ['use_localstorage_for_settings', 'symbol_info',  'property_pages', 'display_market_status',
				'context_menus', 'edit_buttons_in_legend', 'header_symbol_search', 'symbol_search_hot_key', 'header_widget_dom_node',
				'header_settings', 'header_compare', 'header_undo_redo', 'header_saveload', 'left_toolbar',
				'border_around_the_chart', 'control_bar', 'timeframes_toolbar'],
			theme: 'Dark',
			charts_storage_url: this.props.chartsStorageUrl,
			charts_storage_api_version: this.props.chartsStorageApiVersion,
			client_id: this.props.clientId,
			user_id: this.props.userId,
			fullscreen: this.props.fullscreen,
			autosize: this.props.autosize
		};

		const tvWidget = new widget(widgetOptions);
		this.tvWidget = tvWidget;

		tvWidget.onChartReady(() => {
			// Do Something On Chart Ready
		});
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
