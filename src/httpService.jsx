// Here we have Service class > dont forget that in JS class is Function
export class HttpService {
    constructor() {}

    getBaseCISPath() {
        return 'https://ciswebapi2.cryptoindexseries.com/api';
    }

    getTSPath() {
        return this.getBaseCISPath() + '/timeseries/gettimeseries';
    }

    getTSData(pair, resolution, from, to) {
        console.log("Test Resolution", resolution);
        const intervalVal = resolution === '1440' ? '1d' : '1m';
        const limitVal = resolution === '1440' ? '180' : '1440';
        var query = 'symbol=' + pair + '&interval=' + intervalVal + '&limit=' + limitVal;

        if (from) {
            query += '&start=' + from * 1000;
        }
        if (to) {
            query += '&end=' + to * 1000;
        }

        fetch('http://jsonplaceholder.typicode.com/users')
            .then(res => res.json());

        return fetch(this.getTSPath() + '?' + query) .then(res => res.json());
    }

}
