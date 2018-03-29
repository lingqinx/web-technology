# web-technology
HTML, CSS, JavaScript, Bootstrap, AJAX, JSON, Jquery, Android, IOS

## JavaScript + JSONParse

The assignment aims to write a HTML/JavaScript program, which takes the URL of a JSON document containing US Airlines information, parses the JSON file, and extracts the list of airlines, displaying them in a table. The JavaScript program will be embedded in an HTML file so that it can be executed within a browser.

![alt text](/airplaneinfo.png)

## StockSearch_Web

this assignment aims to create a webpage that allows users to search for stock information using Alpha Vantage API and display the results on the same page below the form. Also, the assignment requires to build a Node.js script to return JSON formatted data to the front-end. The client will parse the JSON data and render it in a nice-looking responsive UI, using the Bootstrap toolkit.

A user will first open a page as shown below, where she/he can enter the stock ticker symbol, and select from a list of matching stock symbols using "autocomplete". Then after pressing the "quote" button, AJAX function will be executed to start an asynchronous transaction with Node.js script running on pre-configured AWS server. The server will fetch:<br>
1) corresponding stock's JSON file from the Alpha Vantage API<br>
2) corresponding stock's news XML file from the Seeking Alpha News RSS feed<br>
and then parse them to the client-side. <br>

The client-side will then process the JSON file and extract neccessary information in a tabular and Highchart diagram form, the XML file will also be processed for recent news display.<br>

Other features include:<br>
1) share Highchart on Facebook<br>
2) favourite list to improve user experience<br>
3) local storage feature<br>
4) responsive design<br>

#### Initial page
![alt text](/StockSearch_initial.png)
#### Auto-complete
![alt text](/StockSearch_autocomplete.png)
#### Current-stock details
![alt text](/StockSearch_info.png)
#### Historical chart
![alt text](/StockSearch_historical.png)
#### News
![alt text](/StockSearch_news.png)
#### Responsive design
![alt text](/StockSearch_responsive.png)


## StockSearch_iOS
The functionalities are the same as the web application. But this time, client-side scripts should all be implemented using Swift, UI design should be implemented using storyboard in Xcode.


### Pics for detail
#### Initial page

![alt text](/iOS_initial.png)
#### Auto-complete

![alt text](/iOS_autocomplete.png)
#### Current-stock details

![alt text](/iOS_stockinfo.png)
![alt_text](/iOS_highchart.png)
#### Historical & News chart details

![alt text](/iOS_historical:news.png)
#### Facebook share feature

![alt text](/iOS_fb.png)
