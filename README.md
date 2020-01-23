# TradingView Charting Library and React Integration Example (JavaScript)

## How to start
1. Install dependencies `npm install`.
1. Run `npm start`. It will build the project and open a default browser with the Charting Library.
1. Disable es-lint of src/charting_library_min.js if you get an error. You need to add /* eslint-disable */ to start of the file.  

## How to Add Your Project
1. Copy `charting_library` folder from public/charting_library to `/public` folder. 
1. Copy `charting_library` folder from src/charting_library to `/src` folder. 
1. Copy `datafeeds` folder from public/datafeeds to `/public` folder.

I've used BTC-USDT.CISCALC as the default ticker. I did not write any code in React before, so I don't know how to get
ticker from user or query path. You can use any code I wrote here to integrate trading view. You will not need any API other than
ours because it fetches data from our API and maps it in the front-end. For to see how this works in Angular please visit the http://207.180.195.188/wsclient/table 
and select a coin from table (e.g http://207.180.195.188/wsclient/table/BTC). When you select it change exchange from upper right corner (e.g USDT to ETH) to see
how the chart behaves. I can also share my Angular code with you if you want. There is an extensive documentation of this trading view library in https://github.com/RJPhillips01/charting_library/wiki, this is a link to 
private repository (where the original charting_library resides). If you don't have access you can contact me.

