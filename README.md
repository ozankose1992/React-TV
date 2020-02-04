# TradingView Charting Library and React Integration Example (JavaScript)

## How to start
1. Install dependencies `npm install`.
1. Run `npm start`. It will build the project and open a default browser with the Charting Library.
1. Disable es-lint of src/charting_library_min.js if you get an error. You need to add /* eslint-disable */ to start of the file.  

## How to Add Your Project
1. Copy `charting_library` folder from public/charting_library to `/public` folder. 
1. Copy `charting_library` folder from src/charting_library to `/src` folder. 
1. Copy `datafeeds` folder from public/datafeeds to `/public` folder.

I've used BTC-USDT.CISCALC as the default ticker. You can use any code (suggested) I wrote here to integrate trading view into CIS app. You will not need any API other than
ours because it fetches data from our API and maps it in the front-end. I did not use React before, so I don't know how to get ticker from user state or query path.

You can dynamically change the ticker drawn on the chart by calling setSymbol() on tv_widget instance. So let's say user is in BTC page and you show the user 
BTC/USDT chart when user change the exchange currency (e.g from USDT to TRY) you can use the setSymbol() without reloading the whole chart.  
<pre>
this.tvWidget.setSymbol(this._symbol, this.tvWidget.chart().resolution(), null);
</pre>
 
For to see, how this behaves in a regular application (implemented with Angular) please visit the http://207.180.195.188/wsclient/table 
and select a coin from table (e.g http://207.180.195.188/wsclient/table/BTC). In the coin window, you can change exchange from upper right corner (e.g USDT to ETH) to see
how the chart behaves. I can also share my Angular code with you if you want. 

There is an extensive documentation of this trading view library in https://github.com/RJPhillips01/charting_library/wiki
(where the original charting_library resides). Please read it. The repository is private so If you don't have access already (You or Hakan should have access) please contact me.

### Changes 28.01.2019
Alican I saw you already made some of the changes listed here so you can ignore them.

Following updates are done on the demo:

- Most of the mapping logic is moved from getBars(in index.jsx) function to httpService functions. So those functions need update. 
- Compare symbol functionality is added and users now can search symbols when click "Compare" and navigate to "Add Symbol" page.(see httpService.jsx and searchSymbols in index.jsx)
- Most of the redundant code are removed and comments are added for configurations.
- onHistoryCallback logic is changed
- Some global parameters are added (intraday_multipliers) and some are updated/renamed.
- widgetOptions parameter is commented and updated (Some features enabled)
- symbolStub in resolveSymbol functions is commented and updated (Some features are enabled, some features are disabled)

If you will do the changes one by one (not by directly copying) I highly recommend you check the changes with git diff or some other tool. Otherwise you can always put copy the code and apply the required changes on your side (for dynamic symbols and container fitting)

### Changes 31.01.2019
Design of the chart is arranged to match with design of application. Decimal places are arranged.

Following updates are done on the demo:

- Before generating symbol information (see resolveSymbol function) latest price (loadLatestPrice is httpService) is fetched and feed to the
decimalDetector (it detects how many decimal places we should use e.g VET needs 100000 decimal places)
- Design of the configurable components linked to external css (see custom_css_url in widgetOptions)
- Chart colors is fed from widget constructor (see overrides in widgetOptions)
- Loading screen color is fed from widget constructor (see loading_screen in widgetOptions) 

### Changes 04.02.2019
Symbols are now case-sensitive; not forced to be uppercase.

- Add 'uppercase_instrument_names' to disabled_features list. 
