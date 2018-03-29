<style>
        h1 {
            font-style: italic;
            height: 20px;
            margin-top: 5px;
            text-align: center;
        }
        #Button{
        margin-top: -13px;
        margin-left: 190px;
        margin-bottom: -13px;
        }
        form {
            margin-left: 400px;
            border:1px solid #ddd;
            width:400px;
            display: inline-block;
            margin-top:30px;
            padding-left: 10px;
            padding-right: 10px;
            background-color: #F3F3F3;
            padding-bottom: 24px;
        }
        input[type="submit"] {
             width: 70px;
            height:25px;
            background-color: white;
        }
        input[type="button"] {
            width: 70px;
            height:25px;
            background-color: white;
        }
        input[type="text"] {
            width: 160px;
        }
        tr th {
            background-color: #F3F3F3;
        }
        tr td {
            background-color: #FAFAFA;
            padding:4px;
            font-weight: 500;
            min-width: 80px;
        }
        
        input:required {
            box-shadow:none;
        }
        input:invalid {
            box-shadow:none;
        }
        a:link{
         color: royalblue;
         text-decoration:none;
        }
        a:visited{
         color: royalblue;
         text-decoration:none;
        }
        a:hover{
         color: black;
         text-decoration:none;
        }
        a:active{
         color: black;
         text-decoration:none;
        }
        #container {
        min-width: 310px;
        max-width: 800px;
        height: 400px;
        margin: 0 auto
        }
    </style>
    <script src="http://code.highcharts.com/highcharts.js"></script>
    <script src="http://code.highcharts.com/modules/exporting.js"></script>
<!--   
    <div id="Price" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
    <div id="SMA" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
    <div id="EMA" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
-->
<script type="text/javascript">
    function clearData(what) {
        what.value='';
        var table = document.getElementById("Table");
        if (table) {
                table.parentNode.removeChild(table);
            }
    }
    //Show five news
    function ShowNews(){
        <?php 
        error_reporting(0);
         ?>
        var  jsonObj= <?php echo json_encode(simplexml_load_file('https://seekingalpha.com/api/sa/combined/'.$_GET["symbol"].'.xml')) ?>;
        var News = jsonObj.channel.item;
        var NewsArray = new Array();

        HText="<table border='1' style='margin-left:80px;margin-top:10px;background-color :rgb(245,245,245);'>";         
        //if article add into array
        for (var i = 0; i <News.length; i++) {
            if (News[i]["link"].indexOf("article")>0){
                NewsArray.push(News[i]);
            }
            
        }


        NewsArray.sort(function(a,b){
            var c = new Date(a.pubDate);
            var d = new Date(b.pubDate);
            return d-c;
        });

        for (var i = 0; i < 5; i++) {
            
            HText+="<tr><td style='min-width:950px;background-color:rgb(245,245,245);'>"+"<a href = "+NewsArray[i]["link"]+">"+NewsArray[i]["title"]+ "</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Publicated Time: &nbsp;&nbsp;" + NewsArray[i]["pubDate"].substring(0,NewsArray[i]["pubDate"].length-5)+"</td></tr>";

        }
        
        HText+="</table>";
        document.getElementById("NewsTable").innerHTML=HText;
        HButton = '<div id = "show_NewsButton" style="margin-top:10px; margin-left:450px; width:200px; color:rgb(200,200,200);" onclick ="Hide()">Click to hide stock news </br><img src = "http://cs-server.usc.edu:45678/hw/hw6/images/Gray_Arrow_Up.png" width="25px" height="22px" style="margin-left:60px;"></div>';

        document.getElementById("NewsButton").innerHTML=HButton;
    }

    function Hide(){
        HButton = '<div id = "show_NewsButton" style="margin-top:10px; margin-left:450px; width:200px;color:rgb(200,200,200);" onclick ="ShowNews()">Click to show stock news </br><img src = "http://cs-server.usc.edu:45678/hw/hw6/images/Gray_Arrow_Down.png" width="25px" height="22px" style="margin-left:60px;"></div>';
        document.getElementById("NewsButton").innerHTML=HButton;
        document.getElementById("NewsTable").innerHTML="";
}

    </script>

    <form method="get">
        <h1> Stock Search</h1><hr style="height:1px;border:none;background-color:black;" />
        Enter Stock Ticker Symbol:* 
        <input type ="text" name ="symbol" id ="symbol" value="<?php echo isset($_GET["symbol"]) ? $_GET["symbol"] :""?>"><br><br>
        <div id="Button">
        <input type ="submit"  name="Search" value="search" style ="margin-right:10px">
        <input type ="button" name="Clear" value ="clear" onclick="clearData(this.form.symbol)"></br>
        
        </div>
        <i>* - Mandatory fields.</i>

    </form>

<?php if(isset($_GET["Search"])): ?>

<?php
    
    if($_GET["symbol"] == ""){echo "<script>alert('Please enter a symbol');</script>";} 

    else {
        $jsonResponse = file_get_contents('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='.$_GET["symbol"].'&outputsize=full&apikey=QCK6O0TDD595BLVW');

    //    $jsonResponse = file_get_contents('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='.$_GET["moreInfo"].'&apikey=QCK6O0TDD595BLVW');
        $jsonResponse = json_decode($jsonResponse, true);
        echo "<div id='Table'>";
        echo '<table border ="1px" id="infoTable" style="text-align: center; margin-left: 200px;">';
            foreach ($jsonResponse as $key1 => $value1) {
                if ($key1 == "Error Message"){
                    echo '<tr>';
                    echo '<td style="font-weight: bold; background-color:#F3F3F3;min-width: 200px; text-align: left ">Error</td><td>Error:NO recored has been found, please enter a vaild symbol</td></tr>';
                }
                else if ($key1 == "Meta Data") {
                    //symbol
                    echo '<tr>';
                    echo '<td style="font-weight: bold; background-color:#F3F3F3;min-width: 200px; text-align: left ">Stock Ticker Symbol</td><td>'.$_GET["symbol"].'</td></tr>';

                    $TimeStamp = $value1['3. Last Refreshed'];
                }

                else if ($key1 == "Time Series (Daily)"){
                    $TimeList=array_keys($value1);
                    $CurrentDay = $TimeList[0];
                    $PreviousDay=$TimeList[1];
                    $Change = $value1[$CurrentDay]['4. close'] - $value1[$PreviousDay]['4. close'];
                    $ChangePersent = ($Change / $value1[$PreviousDay]['4. close'])*100;

                    //close, open
                    echo '<tr><td style="font-weight: bold; background-color:#F3F3F3;min-width: 200px; text-align: left ">Close</td><td>'.$value1[$CurrentDay]['4. close'].'</td></tr>';
                    echo '<tr><td style="font-weight: bold; background-color:#F3F3F3;min-width: 200px; text-align: left ">Open</td><td>'.$value1[$CurrentDay]['1. open'].'</td></tr>';
                    echo '<tr><td style="font-weight: bold; background-color:#F3F3F3;min-width: 200px; text-align: left ">Previous Close</td><td>'.$value1[$PreviousDay]['4. close'].'</td></tr>';

                    //change
                    echo '<tr>';
                    echo '<td style="font-weight: bold; background-color:#F3F3F3;min-width: 200px; text-align: left ">Change</td>';
                    if($Change >0) {
                         echo '<td>' . number_format((float)$Change, 2, '.', '').'<img src="http://cs-server.usc.edu:45678/hw/hw6/images/Green_Arrow_Up.png" width="10px" height="12px"> ' . '</td>';
                         echo '</tr>';
                     }
                    else if($Change <0) {
                        echo '<td>' . number_format((float)$Change, 2, '.', '').'<img src="http://cs-server.usc.edu:45678/hw/hw6/images/Red_Arrow_Down.png" width="10px" height="12px"> ' . '</td>';
                        echo '</tr>';
                    }
                    else {
                        echo '<td>' . number_format((float)$Change, 2, '.', '') . '</td>';
                        echo '</tr>';
                    }
                    //ChangePersent
                    echo '<tr>';
                    echo '<td style="font-weight: bold; background-color:#F3F3F3;min-width: 200px; text-align: left ">Change Persent</td>';
                    if($ChangePersent >0) {
                         echo '<td>' . number_format((float)$ChangePersent, 2, '.', '').'%'.'<img src="http://cs-server.usc.edu:45678/hw/hw6/images/Green_Arrow_Up.png" width="10px" height="12px"> ' . '</td>';
                         echo '</tr>';
                     }
                    else if($ChangePersent <0) {
                        echo '<td>' . number_format((float)$ChangePersent, 2, '.', '').'%'.'<img src="http://cs-server.usc.edu:45678/hw/hw6/images/Red_Arrow_Down.png" width="10px" height="12px"> ' . '</td>';
                        echo '</tr>';
                    }
                    else {
                        echo '<td>' . number_format((float)$ChangePersent, 2, '.', '') . '%'.'</td>';
                        echo '</tr>';
                    }
                    //day's range,volume,timestamp
                    echo '<tr><td style="font-weight: bold; background-color:#F3F3F3;min-width: 200px; text-align: left ">Day\'s Range</td><td>'.$value1[$CurrentDay]['3. low'].'-'.$value1[$CurrentDay]['2. high'].'</td></tr>';
                    echo '<tr><td style="font-weight: bold; background-color:#F3F3F3;min-width: 200px; text-align: left ">Volume</td><td>'.number_format($value1[$CurrentDay]['5. volume']).'</td></tr>';
                    echo '<tr><td style="font-weight: bold; background-color:#F3F3F3;min-width: 200px; text-align: left ">Timestamp</td><td>'.$TimeStamp.'</td></tr>';
                    //indicators
                    echo "<tr><td style='font-weight: bold; background-color:#F3F3F3;min-width: 400px; text-align: left '>Indicators</td><td>"."<a id='Price'>Price     </a>"."<a onclick='ShowChat(\"SMA\")' >SMA      </a>"."<a onclick='ShowChat(\"EMA\")'>EMA       </a>"."<a onclick='ShowChat(\"STOCH\")'>STOCH       </a>"."<a onclick='ShowChat(\"RSI\")'>RSI       </a>"."<a onclick='ShowChat(\"ADX\")'>ADX       </a>"."<a onclick='ShowChat(\"CCI\")'>CCI       </a>"."<a onclick='ShowChat(\"BBANDS\")'>BBANDS     </a>"."<a onclick='ShowChat(\"MACD\")'>MACD</a>";

                    echo '</td></tr>';
                    echo '</table>';

                    //for test
                    //echo "<div id='cont' style='min-width: 310px; height: 400px; margin: 0 auto'></div>";
                    
                    
                    $Date = $PriceData=$VolumeData='[';
                    
                    for($i=0;$i<130;$i++){
                        $Date = $Date."'".date('m/d',strtotime($TimeList[$i]))."',";
                        $PriceData = $PriceData.$value1[$TimeList[$i]]['4. close'].",";
                        $VolumeData = $VolumeData.$value1[$TimeList[$i]]['5. volume'].",";
                        
                    }
                    $Date = $Date."]";
                    $PriceData=$PriceData."]";
                    $VolumeData=$VolumeData."]";
                    
                    echo "<div id='cont' style='min-width: 400px; height: 600px; margin: 0 auto'></div>
                    <script>
                    Highcharts.chart('cont', {
                        title: {
                            text: 'Stock Price(".$CurrentDay.")'
                        },
                        subtitle: {
                            text: '<a href=\"https://www.alphavantage.co/\">Source: Alpha Vantage</a>'
                        },
                        xAxis: {
                            categories:".$Date.",
                            reversed: true,
                            tickInterval: 5,
                        },
                        yAxis: [{
                            type: 'linear',
                            tickAmount: 8,
                            tickInterval: 5,
                            title: {
                                text: 'Stock Price'
                            },
                            },{
                            title: {
                                text: 'Volume'
                            },
                            tickAmount: 8,
                            opposite:true,
                            tickInterval: 50000000,
                        },],
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle',                        
                        },
                        plotOptions: {
                            area: {
                                fillColor: 'rgb(244,149,145)',
                                marker: {
                                    enabled: false,
                                    radius: 2,
                                    fillColor: 'rgb(233,33,0)',
                                },
                                lineWidth: 1,
                                lineColor: 'rgb(233,33,0)',
                                threshold: null
                            }
                        },

                        

                        series: [{
                            type:'area',
                            name: '".$_GET["symbol"]."',
                            yAxis: 0,
                            color: 'rgb(233,33,0)',
                            data: ".$PriceData."
                        },{
                            type:'column',                                   
                            name: '".$_GET["symbol"]." volume',
                            yAxis: 1,
                            color: 'rgb(255,255,255)',
                            data: ".$VolumeData."
                        }],
                        
                    });



                    </script>";

            echo '<div id = NewsButton><div id = "show_NewsButton" style="margin-top:10px; margin-left:450px; width:200px;color:rgb(200,200,200);" onclick ="ShowNews()">Click to show stock news </br><img src = "http://cs-server.usc.edu:45678/hw/hw6/images/Gray_Arrow_Down.png" width="25px" height="22px" style="margin-left:60px;"></div></div>';
            echo '<div id = "NewsTable"></div>';
            echo "</div>";
               
                }

            }
    }
?>
<?php endif; ?>

<script type="text/javascript">
    if (document.getElementById("Price") != null)
        document.getElementById("Price").addEventListener("click",ShowPrice); 

function ShowPrice(){
    var a = <?php echo $Date ?>;
    var b = '<?php echo $_GET["symbol"] ?>';
    var c = <?php echo $VolumeData ?>;
    var d = <?php echo $CurrentDay ?>;
    var e = <?php echo $PriceData ?>;
    
    Highcharts.chart('cont', {
                        title: {
                            text: 'Stock Price('+ d +')'
                        },
                        subtitle: {
                            text: '<a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>'
                        },
                        xAxis: {
                            categories: a,
                            reversed: true,
                            tickInterval: 5,
                        },
                        yAxis: [{
                            type: 'linear',
                            tickAmount: 8,
                            tickInterval: 5,
                            title: {
                                text: 'Stock Price'
                            },
                            },{
                            title: {
                                text: 'Volume'
                            },
                            tickAmount: 8,
                            opposite:true,
                            tickInterval: 50000000,
                        },],
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle',                        
                        },
                        plotOptions: {
                            area: {
                                fillColor: 'rgb(244,149,145)',
                                marker: {
                                    enabled: false,
                                    radius: 2,
                                    fillColor: 'rgb(233,33,0)',
                                },
                                lineWidth: 1,
                                lineColor: 'rgb(233,33,0)',
                                threshold: null
                            }
                        },

                        

                        series: [{
                            type:'area',
                            name: b,
                            yAxis: 0,
                            color: 'rgb(233,33,0)',
                            data: e
                        },{
                            type:'column',                                   
                            name: b + 'volume',
                            yAxis: 1,
                            color: 'rgb(255,255,255)',
                            data: c
                        }],
                        
                    });
}

function ShowChat(IndicatorId){

    var symbol = '<?php echo $_GET["symbol"] ?>';

    var url = 'https://www.alphavantage.co/query?function='+IndicatorId+'&symbol='+symbol +'&interval=daily&time_period=10&series_type=close&apikey=QCK6O0TDD595BLVW';

      var xmlhttp = new XMLHttpRequest();


xmlhttp.onreadystatechange = function() {
if (this.readyState == 4 && this.status == 200) {
    var jsonObj = JSON.parse(this.responseText);

    TechAna="Technical Analysis: "+IndicatorId;
    //alert(TechAna);
    var DateArray = new Array();
    for ( var DateTime in jsonObj[TechAna]){
        DateArray.push(DateTime);
    }
    var DATAArray=new Array();

    if(IndicatorId == 'STOCH'){
        var TitleText = 'Stochastic Oscillator (STOCH)';
        //alert(TitleText);
        var SeriesName = symbol +' SlowK';
        var Interval = 10;
        var DATAArrayD=new Array();
        for (var i=0;i<130;i++){
            DATAArray.push(parseFloat(jsonObj[TechAna][DateArray[i]]["SlowK"]));
            DATAArrayD.push(parseFloat(jsonObj[TechAna][DateArray[i]]["SlowD"]));
        }
        /*
        chart.update({
            series:[{
                name: symbol + 'SlowK',
                data: DATAArrayK,
                color: 'rgb(233,33,0)',
            },{
                name: symbol + 'SlowK',
                data: DATAArrayD,
            }]
        });  */
    }
    else if(IndicatorId == 'BBANDS'){
        var TitleText = jsonObj["Meta Data"]["2: Indicator"];
        var SeriesName = symbol +' Real Middle Band';
        var Interval = 5;
        var DATAArrayU=new Array();
        var DATAArrayL=new Array();
        for (var i=0;i<130;i++){
            DATAArray.push(parseFloat(jsonObj[TechAna][DateArray[i]]["Real Middle Band"]));
            DATAArrayU.push(parseFloat(jsonObj[TechAna][DateArray[i]]["Real Upper Band"]));
            DATAArrayL.push(parseFloat(jsonObj[TechAna][DateArray[i]]["Real Lower Band"]));
        }
    }
    else if(IndicatorId == 'MACD'){
        var TitleText = jsonObj["Meta Data"]["2: Indicator"];
        var SeriesName = symbol +' MACD';
        var Interval = 1;
        var DATAArrayH=new Array();
        var DATAArrayS=new Array();
        for (var i=0;i<130;i++){
            DATAArray.push(parseFloat(jsonObj[TechAna][DateArray[i]]["MACD"]));
            DATAArrayH.push(parseFloat(jsonObj[TechAna][DateArray[i]]["MACD_Signal"]));
            DATAArrayS.push(parseFloat(jsonObj[TechAna][DateArray[i]]["MACD_Hist"]));
        }
    }
    else{
        var TitleText = jsonObj["Meta Data"]["2: Indicator"];
        var SeriesName = symbol;
        for (var i=0;i<130;i++){
            DATAArray.push(parseFloat(jsonObj[TechAna][DateArray[i]][IndicatorId]));
        }
        if(IndicatorId == 'SMA')
            var Interval = 2.5;
        else if(IndicatorId == 'EMA')
            var Interval = 2.5;
        else if(IndicatorId == 'RSI')
            var Interval = 10;
        else if(IndicatorId == 'ADX')
            var Interval = 5;
        else if(IndicatorId == 'CCI')
            var Interval = 100;
    }
    var a = <?php echo $Date ?>;


    var Chart =    Highcharts.chart('cont', {
    title: {
        text: TitleText
    },
    subtitle: {
        text: '<a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>'
    },
    xAxis: {
        categories: a,
        reversed: true,
        tickInterval: 5,
    },
    yAxis: {
        title: {
            text: IndicatorId
        },
        tickInterval: Interval,
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },
    plotOptions: {
        line:{
            marker: {//dot
                enabled:true,
                radius: 2,
                symbol:  'square'
            },
            lineWidth: 1,
          },  
    },
    series: [{
        name: SeriesName,
        data: DATAArray,
        color: 'rgb(233,33,0)',

    }],

});

    if(IndicatorId == 'STOCH'){
        Chart.addSeries({
            name: symbol + ' SlowK',
            data: DATAArrayD,

        });
    }
    else if(IndicatorId == 'BBANDS'){
        Chart.addSeries({
            name: symbol + ' Real Upper Band',
            data: DATAArrayU,

        });
        Chart.addSeries({
            name: symbol + ' Real Lower Band',
            data: DATAArrayL,

        });
    }
    else if(IndicatorId == 'MACD'){
        Chart.addSeries({
            name: symbol + ' MACD_Hist',
            data: DATAArrayH,

        });
        Chart.addSeries({
            name: symbol + ' MACD_Signal',
            data: DATAArrayS,

        });
    }


    }
};


      xmlhttp.open("GET",url,true);

      xmlhttp.send();  
 


}
</script>
