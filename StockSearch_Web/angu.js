
var APP = angular.module('MySearchApp', ['ngMaterial','ngAnimate','ngMessages']);
    APP.controller('MySearchController', function($scope, $q, $timeout,$http) {
        var data_sto ;
        var searchctrl = this;
        searchctrl.current = true;
        DateArray = new Array();
        Symbol = '';
        searchctrl.favorite=[];
        if(localStorage.length > 0){

            for (var k= 0; k < localStorage.length;k++){
                console.log(localStorage.key(k));
                searchctrl.favorite.push(JSON.parse(localStorage.getItem(localStorage.key(k))));
                console.log(searchctrl.favorite);
            }
        }
        $scope.change = function(){
            console.log(searchctrl.current);
             searchctrl.current = ! searchctrl.current;
             //present_table(data_sto);
        };
        $scope.quote = function(selectedItem){
             searchctrl.current = false;
             
             $scope.submit(selectedItem);
             //present_table(data_sto);
        };
        
        
        var URL='';
        function Highchart2png(Chart){
            var data = {
                options: JSON.stringify(Chart),
                filename: 'filename',
                type: 'image/png',
                async: true
            };

            var exportUrl = 'http://export.highcharts.com/';
            $.post(exportUrl, data, function(data) {
                var url = exportUrl + data;
                URL = url;
                console.log(URL);
                //window.open(url);
            });     
              
        }
        $scope.fbshare = function() {
            
            FB.ui({
                method: 'feed',
                picture: URL, 
                 
                }, function(response){
                if (response && !response.error_message) {
                    alert("Posted successfully");
                } else {
                    alert("Not posted");
                }
            }); 
        }
        this.getMatches = function(searchText) {
            var deferred = $q.defer();
            $http.get('http://127.0.0.1:8081/market',{params:{input:searchText}}).success(function (market_data) {
                
                //console.log(data);
                deferred.resolve(market_data);
                
                
            }).error(function(market_data) {
                console.log('Error: ' + market_data);
                //todo
            });
            return deferred.promise;

        };
        $scope.reset = function(){
            $scope.selectedItem=null; 
            $scope.searchText='';
            $("#carousel_right_btn").removeClass("active").addClass("disabled");
            $("#current_stock_left").empty();
            $("#current_stock_right").empty();
            $("#historical_charts").empty();
            $("#news_feeds_container").empty();
        }
        
        $scope.submit = function(search_obj) {
            Symbol = search_obj['Symbol'];
            console.log(Symbol);
            $http.get('http://127.0.0.1:8081/stock_price',{params:{input:Symbol}}).success(function (json_data) {
                //present_fb_button();
                $(".AlertInfo").removeClass("right");
                $(".AlertInfo").addClass("error");
                present_table(json_data);
                DChart(json_data);
                $scope.news();
                if(json_data==null || json_data["Information"]!=undefined || json_data["Error Message"]!=undefined){
                    $(".AlertInfo").removeClass("error");
                    $(".AlertInfo").addClass("right");
                }
                //price_graph();
            }).error(function(json_data) {
                console.log('Error: ' + json_data);
                $(".AlertInfo").removeClass("right");
                $(".AlertInfo").addClass("error");
            });

        };
        $scope.news = function() {
            
            $http.get('http://127.0.0.1:8081/news',{params:{input:Symbol}}).success(function (json_news) {
                
                var News = json_news.rss.channel[0]['item'];
                var NewsArray = new Array();
                //console.log(News);
                //var HText="<table border='1' style='margin-left:80px;margin-top:10px;background-color :rgb(245,245,245);'>"; 
                for (var i = 0; i <News.length; i++) {
                    if (News[i]["link"][0].indexOf("article")>0){
                        NewsArray.push(News[i]);
                    }    
                }
                
                var HText='';
                $("news_feeds_container").empty();
                for (var i = 0; i < 5; i++) {
                    HText+='<div class = "well" style = "margin-top:15px;margin-bottom:15px;margin-left:5px;margin-right:5px;backgroung-color: rgb(232,232,232);"><h4><a href ='+ NewsArray[i]["link"][0]+' target="_blank">'+NewsArray[i]["title"][0]+'</a ><br><br>'
                    +'<p>Author: '+NewsArray[i]["sa:author_name"][0]+'</p ><p>Date: '+ NewsArray[i]["pubDate"][0].substring(0,NewsArray[i]["pubDate"][0].length-5)+' EDT</div>';
                }
                //console.log(HText);
                $("#news_feeds_container").append(HText);


            }).error(function(json_news) {
                console.log('Error: ' + json_news);
                //todo
            });

        };
        $scope.graph = function(IndicatorId,search_obj) {
             var symbol = search_obj['Symbol'];
            $http.get('http://127.0.0.1:8081/stock_graph',{params:{input:IndicatorId,sy:symbol}}).success(function (graph_data) {

                prsent_graph(IndicatorId,Symbol,graph_data);
            }).error(function(graph_data) {
                console.log('Error: ' + json_data);
                $(".AlertInfo").removeClass("right");
                $(".AlertInfo").addClass("error");
            });

        };
        var change;
        var change_persent;
        var Price;
        var Volume;
        function present_table(data){
            console.log(data);
            var time_series = data['Time Series (Daily)'];
            
            var i = 0;
            for ( var DateTime in data['Time Series (Daily)']){
                DateArray.push(DateTime);
                i++;
                if(i == 131){
                    break;
                }
            }              
            var currentday = DateArray[0];
            var previousday = DateArray[1];
            var last_price = time_series[currentday]['4. close'];
            change = time_series[currentday]['4. close'] - time_series[previousday]['4. close']; 
                          
            change_persent = (change/time_series[previousday]['4. close'])*100;
            change =change.toFixed(2);
            change_persent = Math.round(change_persent * 100) / 100;
            //console.log(time_series[currentday]['4. close']);
            var stock_table= '<div class="panel-body"><table class="table table-striped" id="current_stock_table">'+
                    '<tr><td class="col-md-6"><b>Stock Ticker Symbol</b></td><td>'+data['Meta Data']['2. Symbol']+'</td></tr>'+
                    '<tr><td class="col-md-6"><b>Last Price</b></td><td>'+Math.round(last_price * 100) / 100+'</td></tr>'+
                    '<tr><td class="col-md-6"><b>Change (Change Percent)</b></td>';
            if(change>0){
                var th1 = '<td style="color: green">'+change+' ('+change_persent+'%)'+'<img src="http://cs-server.usc.edu:45678/hw/hw8/images/Up.png" width="18px" height="18px">'+'</td></tr>';
            }
            else if(change<0){
                var th1 = '<td style="color: red">'+change+' ('+change_persent+'%)'+'<img src="http://cs-server.usc.edu:45678/hw/hw8/images/Down.png" width="18px" height="18px">'+'</td></tr>';
            }
            else{
                var th1 = '<td>'+change+' ('+change_persent+'%)'+'</td></tr>';
            }
            var timestamp = data['Meta Data']['3. Last Refreshed'];
             
            if(timestamp.length<=10){
                timestamp = timestamp + '16:00:00 EDT';
                var Close = Math.round(time_series[previousday]['4. close'] *100) / 100;
            }else{
                timestamp = timestamp + ' EDT';
                var Close = Math.round(time_series[currentday]['4. close']*100) / 100;
            }
            var th2='<tr><td class="col-md-6"><b>Timestamp</b></td><td>'+timestamp+'</td></tr>'+
                    '<tr><td class="col-md-6"><b>Open</b></td><td>'+Math.round(time_series[currentday]['1. open'] * 100) / 100+'</td></tr>'+
                    '<tr><td class="col-md-6"><b>Close</b></td><td>'+Close+'</td></tr>'+
                    '<tr><td class="col-md-6"><b>Day\'s Range</b></td><td>'+Math.round(time_series[currentday]['3. low'] * 100) / 100+'-'+Math.round(time_series[currentday]['2. high']* 100) / 100+'</td></tr>'+
                    '<tr><td class="col-md-6"><b>Volume</b></td><td>'+Number(time_series[currentday]['5. volume']).toLocaleString("en-US")+'</td></tr>'+
                '</table></div>';
            Volume=Number(time_series[currentday]['5. volume']);
            Price=Math.round(last_price * 100) / 100;
            
            
            var table_detail= stock_table+th1+th2;
            $("#current_stock_left").empty();
            $("#current_stock_left").append(table_detail);
            present_price(data);
            
        };
$scope.set_favarite = function(){
    if($("#favabutton").hasClass("gold")){
        $("#favabutton").removeClass("gold");
        $("#favabutton").removeClass("glyphicon-star");
        $("#favabutton").addClass("glyphicon-star-empty");
        localStorage.removeItem(Symbol);
        searchctrl.favorite = [];
        if(localStorage.length > 0){
        for (var k= 0; k < localStorage.length;k++){
            searchctrl.favorite.push(JSON.parse(localStorage.getItem(localStorage.key(k))));
        }}
    }
    else{
        
        $("#favabutton").removeClass("glyphicon-star-empty");
        $("#favabutton").addClass("glyphicon-star");
        $("#favabutton").addClass("gold");
        var faval = {
                Symbol:Symbol,
                Price:Number(Price),
                Change:Number(change),
                ChanePersent: Number(change_persent),
                Volume:Number(Volume),
                Time:Date.parse(new Date()),
            }
         localStorage.setItem(Symbol,JSON.stringify(faval));
         console.log(localStorage);
         searchctrl.favorite = [];
        if(localStorage.length > 0){
        for (var k= 0; k < localStorage.length;k++){
            searchctrl.favorite.push(JSON.parse(localStorage.getItem(localStorage.key(k))));
            console.log(searchctrl.favorite);
        }}
    }

}

$scope.remove_favarite = function(){

        localStorage.removeItem(Symbol);
            searchctrl.favorites = [];

            if(localStorage.length > 0){
            for (var k= 0; k < localStorage.length;k++){
                searchctrl.favorites.push(JSON.parse(localStorage.getItem(localStorage.key(k))));
            }
        }
            $("#favabutton").addClass("glyphicon-star-empty");

            $("#favabutton").removeClass("gold");
            $("#favabutton").removeClass("glyphicon-star");


       // refresh();
       // var x="#"+symbol;
       // $(x).remove();
    }

function DChart(jsonObj) {
    //$("#historical_charts").empty();
    var symbol = jsonObj['Meta Data']['2. Symbol'];
    var DATAArray=new Array();
    var i =0;
    for ( var DateTime in jsonObj['Time Series (Daily)']){
        var Time = Date.UTC(DateTime.split("-")[0],DateTime.split("-")[1]-1,DateTime.split("-")[2],0,0,0,0);
        
        DATAArray.push([Time,Number(jsonObj['Time Series (Daily)'][DateTime]['4. close'])]);
        i=i+1;
        if(i == 1000){
            break;
        }
    }
    
    var hischarta = {


        rangeSelector : {
                buttons : [{
                type : 'day',
                count : 7,
                text : '1w'
            }, {
                type : 'month',
                count : 1,
                text : '1m'
            }, {
                type : 'month',
                count : 3,
                text : '3m'
            }, {
                type : 'month',
                count : 6,
                text : '6m'
            },  {
                type: 'ytd',
                text: 'YTD'
            }, {
                type : 'year',
                count : 1,
                text : '1y'
            },  {
                type : 'all',
                count : 1,
                text : 'All'
            }],
            selected : 0,
        },
        title : {
            text : symbol+' Stock Price'
        },
        subtitle: {
            text: '<a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>'
        },
        yAxis: {
            title: {
                text: 'Stock Value',
                align: 'middle',
                textAlign: 'left'
            }
        },

        series : [{
            name : ' Stock Value',
            data : DATAArray.reverse(),
            type : 'area',
            threshold : null,
            tooltip : {
                valueDecimals : 2,
                valuePrefix: "$"
            },
            
            
        }]
    };
    Highcharts.stockChart('stock_chart',hischarta);
    
}
        function present_price(jsonObj){
            var symbol = jsonObj['Meta Data']['2. Symbol'];
            if(jsonObj==null || jsonObj["Information:"]!=undefined || jsonObj["Error Message:"]!=undefined){
                    $(".AlertInfo").removeClass("error");
                    $(".AlertInfo").addClass("right");
                }
            /*
            var DateArray = new Array();
            for ( var DateTime in jsonObj['Time Series (Daily)']){
                DateArray.push(DateTime);
            }*/
            //console.log(DateArray);
            var times = new Array();
            var DATAArray=new Array();
            var DATAArrayV=new Array();
            var TitleText = symbol+' Stock Price and Volume';
            var SeriesName = 'Stock Price';
            for(var i = 0; i<131;i++){
                var x = "";
                //console.log(jsonObj['Time Series (Daily)'][DateArray[i]]);
                DATAArray.push(parseFloat(jsonObj['Time Series (Daily)'][DateArray[i]]['1. open']));
                DATAArrayV.push(parseFloat(jsonObj['Time Series (Daily)'][DateArray[i]]['5. volume']));
                x = DateArray[i].substring(5,7)+"/"+DateArray[i].substring(8,10);
                times.push(x);
                
            }

            var Chart =    {
                    title: {
                        text: TitleText
                    },
                    subtitle: {
                        text: '<a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>'
                    },
                    xAxis: {
                        categories: times,
                        reversed: true,
                        tickInterval: 15,
                        showLastLabel: true,

                    },
                    yAxis: [{
                            type: 'linear',
                            tickAmount: 4,
                            title: {
                                text: 'Stock Price'
                            },
                            },{
                            title: {
                                text: 'Volume'
                            },
                            tickAmount: 4,
                            opposite:true,
                            
                        },],
                    plotOptions: {
                        area: {
                            fillColor: 'rgb(227,226,254)',
                            marker: {
                                enabled: false,
                                radius: 2,
                                fillColor: 'rgb(0,0,255)',
                            },
                            lineWidth: 3,
                            lineColor: 'rgb(0,0,255)',
                            threshold: null
                        }
                    },

                        

                        series: [{
                            type:'area',
                            name: 'Stock Price',
                            yAxis: 0,
                            color: 'rgb(0,0,255)',
                            data: DATAArray
                        },{
                            type:'column',                                   
                            name: 'Volume',
                            yAxis: 1,
                            color: 'rgb(233,33,0)',
                            data: DATAArrayV
                        }],

                };
                Highcharts.chart('Price',Chart);

                Highchart2png(Chart);
        };

        function prsent_graph(IndicatorId,symbol,jsonObj){
            console.log(jsonObj);
            
            //var symbol = jsonObj['Meta Data']['1: Symbol'];
            var TechAna="Technical Analysis: "+IndicatorId;
            var DateArray = new Array();
            for ( var DateTime in jsonObj[TechAna]){
                DateArray.push(DateTime);
            }
            //console.log(DateArray);
            var times = new Array();
            for(var i = 0; i<131;i++){
                var x = "";
                x = DateArray[i].substring(5,7)+"/"+DateArray[i].substring(8,10);
                times.push(x);
            }
            var DATAArray=new Array();

            if(IndicatorId == 'STOCH'){
                var TitleText = 'Stochastic Oscillator (STOCH)';
                //alert(TitleText);
                var SeriesName = symbol +' SlowK';
                var Interval = 10;
                var DATAArrayD=new Array();
                for (var i=0;i<131;i++){
                    DATAArray.push(parseFloat(jsonObj[TechAna][DateArray[i]]["SlowK"]));
                    DATAArrayD.push(parseFloat(jsonObj[TechAna][DateArray[i]]["SlowD"]));
                }
                
            }
            else if(IndicatorId == 'BBANDS'){
                var TitleText = jsonObj["Meta Data"]["2: Indicator"];
                var SeriesName = symbol +' Real Middle Band';
                var Interval = 20;
                var DATAArrayU=new Array();
                var DATAArrayL=new Array();
                for (var i=0;i<131;i++){
                    DATAArray.push(parseFloat(jsonObj[TechAna][DateArray[i]]["Real Middle Band"]));
                    DATAArrayU.push(parseFloat(jsonObj[TechAna][DateArray[i]]["Real Upper Band"]));
                    DATAArrayL.push(parseFloat(jsonObj[TechAna][DateArray[i]]["Real Lower Band"]));
                }
            }
            else if(IndicatorId == 'MACD'){
                var TitleText = jsonObj["Meta Data"]["2: Indicator"];
                var SeriesName = symbol +' MACD';
                var Interval = 2;
                var DATAArrayH=new Array();
                var DATAArrayS=new Array();
                for (var i=0;i<131;i++){
                    DATAArray.push(parseFloat(jsonObj[TechAna][DateArray[i]]["MACD"]));
                    DATAArrayH.push(parseFloat(jsonObj[TechAna][DateArray[i]]["MACD_Signal"]));
                    DATAArrayS.push(parseFloat(jsonObj[TechAna][DateArray[i]]["MACD_Hist"]));
                }
            }
            else{
                var TitleText = jsonObj["Meta Data"]["2: Indicator"];
                var SeriesName = symbol;
                for (var i=0;i<131;i++){
                    DATAArray.push(parseFloat(jsonObj[TechAna][DateArray[i]][IndicatorId]));
                }
            }
            console.log(DATAArray);
            var Chart =     {
                    title: {
                        text: TitleText
                    },
                    subtitle: {
                        text: '<a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>'
                    },
                    xAxis: {
                        categories: times,
                        reversed: true,
                        tickInterval: 15,
                        showLastLabel: true,
                    },
                    yAxis: {
                        title: {
                            text: IndicatorId
                        },
                        
                    },
                    
                    plotOptions: {
                        line:{
                            marker: {//dot
                                enabled:false,
                                radius: 2,
                                symbol:  'square'
                            },
                            lineWidth: 2,
                          },  
                    },
                    series: [{
                        name: SeriesName,
                        data: DATAArray,

                    }],

                };
            var IndiChart = Highcharts.chart(IndicatorId,Chart);
            //
            if(IndicatorId == 'STOCH'){
                IndiChart.addSeries({
                    name: symbol + ' SlowK',
                    data: DATAArrayD,

                });
            }
            else if(IndicatorId == 'BBANDS'){
                IndiChart.addSeries({
                    name: symbol + ' Real Upper Band',
                    data: DATAArrayU,

                });
                IndiChart.addSeries({
                    name: symbol + ' Real Lower Band',
                    data: DATAArrayL,

                });
            }
            else if(IndicatorId == 'MACD'){
                IndiChart.addSeries({
                    name: symbol + ' MACD_Hist',
                    data: DATAArrayH,

                });
                IndiChart.addSeries({
                    name: symbol + ' MACD_Signal',
                    data: DATAArrayS,

                });
            }
            

            Highchart2png(Chart);
        };
  
});



