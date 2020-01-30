// Here we have Service class > dont forget that in JS class is Function
export class HttpService {
    constructor() {}

    getBaseCISPath() {
        return 'https://ciswebapi2.cryptoindexseries.com/api';
    }

    getTSPath() {
        return this.getBaseCISPath() + '/timeseries/gettimeseries';
    }

    getSearchCoinPath() {
        return this.getBaseCISPath() + '/Search/CoinSearch' + '?ccy=USD&order_by=mkt_cap,desc&ts_cutoff=0&page_number=1';
    }

    /**
     * Search symbol and return TV friendly list
     *
     * @param currency Currency to set (e.g. USDT for BTC/USDT)
     * @param symbolInput Search text
     */
    searchSymbol(currency, symbolInput) {
        const url = this.getSearchCoinPath() + '&search_string=' + symbolInput;

        return fetch(url).then(res => res.json()).then(res => {
                return res['data'] ? res['data'].map(el => {
                    return {
                        symbol: el['symbol'],
                        full_name: el['symbol'] + '-' + currency,
                        description: el['name'],
                        exchange: '',
                        ticker: el['symbol'] + '-' + currency + '.CISCALC',
                        type: 'crypto'
                    };
                }) : [];
            }
        );
    }

    /**
     * Fetches and converts time series data from CIS API and converts it to TV time series.
     *
     * @param pair Pair to fetch
     * @param resolution Trading view resolution value
     * @param from Date to start from
     * @param to Date to end
     */
    getTSData(pair, resolution, from, to) {
        console.log("Test Resolution", resolution);
        const intervalVal = resolution.endsWith('D') ? '1d' : resolution + 'm';
        const limitVal = '1440';
        var query = 'symbol=' + pair + '&interval=' + intervalVal + '&limit=' + limitVal;
        if (from) {
            query += '&start=' + from * 1000;
        }
        if (to) {
            query += '&end=' + to * 1000;
        }

        // Map to trading view model and return
        return fetch(this.getTSPath() + '?' + query).then(res => res.json()).then(
            data => {
                // Map our data model to trading view data model
                if (data['data'] && data['data'].length) {
                    // Generate field index map (which array element belongs to which field)
                    const indexMap = {};
                    data['fields'].forEach((item, index) => {
                        indexMap[item] = index;
                    });

                    // Map to trading view model and return
                    return data['data'].map(el => {
                        return {
                            time: el[indexMap['ts']],
                            low: el[indexMap['l']],
                            high: el[indexMap['h']],
                            open: el[indexMap['o']],
                            close: el[indexMap['c']],
                            volume: null
                        };
                    }).reverse();
                } else {
                    return [];
                }
            }
        );
    }


    /**
     * Loads latest price of the pair
     *
     * @param pair Pair to fetch
     */
    loadLatestPrice(pair) {
        const query = 'symbol=' + pair + '&interval=1d&limit=1';
        return fetch(this.getTSPath() + '?' + query).then(res => res.json()).then( data => {
            // Get the low value of the data
            if (data['data'] && data['data'].length) {
                // Generate field index map (which array element belongs to which field)
                const indexMap = {};
                data['fields'].forEach((item, index) => {
                    indexMap[item] = index;
                });
                return data['data'][0][indexMap['l']];
            } else {
                return [];
            }
        });
    }

}
