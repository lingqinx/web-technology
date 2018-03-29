//
//  stockTableViewViewController.swift
//  stockMarketSearch
//
//  Created by Lingqing Xia on 11/29/17.
//  Copyright © 2017 Lingqing Xia. All rights reserved.
//

import UIKit
import Alamofire
import AlamofireSwiftyJSON
import SwiftyJSON
import CoreData


class stockTableViewViewController: UIViewController, UITableViewDelegate, UITableViewDataSource, UIWebViewDelegate, UIPickerViewDelegate, UIPickerViewDataSource  {
    var a:Array = ["Price","SMA","EMA","STOCH","RSI","ADX","CCI","BBANDS","MACD"]
    var script: String?
    var myPath: String?
    var IndicatorId: String?
    var flag: Bool = false
    var sf: String?
    
    
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }
    
    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return a.count
    }
    func pickerView(_ pickerView: UIPickerView, viewForRow row: Int, forComponent component: Int, reusing view: UIView?) -> UIView {
        var pickerl: UILabel? = (view as? UILabel)
        if pickerl == nil{
            pickerl = UILabel()
            pickerl?.text = a[row]
        }
        
        return pickerl!
    }
    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        sf = a[row]
        /*
        if flag == true{
            flag = false
            print(flag)
            if a[row] == "Price"{
                myPath = Bundle.main.path(forResource: "graph", ofType: "html")
                graph.loadRequest(NSURLRequest(url: NSURL(string: myPath!)! as URL) as URLRequest)
                graph.isOpaque = false
                script = "$(function(){drawPrice(\"" + stockSymbol! + "\");});"
                
            }
            else{
                IndicatorId = a[row]
                myPath = Bundle.main.path(forResource: "indicgraph", ofType: "html")
                graph.loadRequest(NSURLRequest(url: NSURL(string: myPath!)! as URL) as URLRequest)
                graph.isOpaque = false
                script = "$(function(){drawIndic(\"" + IndicatorId! + "\",\"" + stockSymbol! + "\");});"
                print(script!)
            }
            
        }*/
    }
    
    
    @IBAction func Change(_ sender: UIButton) {
        if sf == "Price"{
            myPath = Bundle.main.path(forResource: "graph", ofType: "html")
            graph.loadRequest(NSURLRequest(url: NSURL(string: myPath!)! as URL) as URLRequest)
            graph.isOpaque = false
            script = "$(function(){drawPrice(\"" + stockSymbol! + "\");});"
            
        }
        else{
            IndicatorId = sf
            myPath = Bundle.main.path(forResource: "indicgraph", ofType: "html")
            graph.loadRequest(NSURLRequest(url: NSURL(string: myPath!)! as URL) as URLRequest)
            graph.isOpaque = false
            script = "$(function(){drawIndic(\"" + IndicatorId! + "\",\"" + stockSymbol! + "\");});"
          //  print(script!)
        }
    }
    @IBOutlet weak var drawgrah: UIPickerView!
    
    @IBOutlet weak var scrolltable: UIScrollView!
    @IBOutlet weak var stockDetailTable: UITableView!

    @IBOutlet weak var graph: UIWebView!
    var TableData : Array<Dictionary<String, String>> = Array<Dictionary<String, String>>()
    var stockDetail: Dictionary<String, String> = Dictionary<String, String>()
    var stockSymbol: String?
    
    @IBOutlet weak var star: UIButton!
    
    var DateTime: Array<Any> = []
    var DATAArray: Array<Any> = []
    var DATAArrayV: Array<Any> = []
    var change : Float = 0.0
    
    override func viewWillLayoutSubviews() {//set the scrollviews area
        scrolltable.frame = self.view.bounds
        scrolltable.contentSize.height = 830
        scrolltable.contentSize.width = 0
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {

        return stockDetail.count-2
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = stockDetailTable.dequeueReusableCell(withIdentifier: "stockRow", for: indexPath) as! stockTableViewCell
        switch indexPath.row{
        case 0:
            cell.stockSymbol.text = "Stock Symbol"
            cell.stockValue.text = TableData[0]["symbol"]
        case 1:
            cell.stockSymbol.text = "Last Price"
            cell.stockValue.text = TableData[0]["price"]
        case 2:
            cell.stockSymbol.text = "Change"
            cell.stockValue.text = TableData[0]["change"]
            if (change > 0) {
                cell.UpDown.image = UIImage(named: "green.png")
            } else {
                cell.UpDown.image = UIImage(named: "red.png")
            }
        case 3:
            cell.stockSymbol.text = "Timestamp"
            cell.stockValue.text = TableData[0]["timestamp"]
        case 4:
            cell.stockSymbol.text = "Open"
            cell.stockValue.text = TableData[0]["open"]
        case 5:
            cell.stockSymbol.text = "Close"
            cell.stockValue.text = TableData[0]["close"]
        case 6:
            cell.stockSymbol.text = "Day's Range"
            cell.stockValue.text = TableData[0]["range"]
        case 7:
            cell.stockSymbol.text = "Volume"
            cell.stockValue.text = TableData[0]["volume"]
        default:
            cell.textLabel?.text = "Key"
            
        }
        return cell
    }
    
    @IBOutlet weak var loading: UIActivityIndicatorView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        loadTable()
        myPath = Bundle.main.path(forResource: "graph", ofType: "html")
        graph.loadRequest(NSURLRequest(url: NSURL(string: myPath!)! as URL) as URLRequest)
        graph.isOpaque = false
        script = "$(function(){drawPrice(\"" + stockSymbol! + "\");});"
        // Do any additional setup after loading the view.
    }
    func webViewDidFinishLoad(_ webView: UIWebView) {
        
        //let script = "$(function(){plotChart(\"" + stockSymbol + "\");});"
        
        graph.stringByEvaluatingJavaScript(from: script!)
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func loadTable() {
        Alamofire.request("http://stockenviroment.us-east-2.elasticbeanstalk.com/stock_price",parameters:["input":stockSymbol!]).responseSwiftyJSON { response in
            let data = response.result.value //A JSON object
            let isSuccess = response.result.isSuccess
            if (isSuccess && (data != nil)) {
                //print (data)
                let time = data!["Time Series (Daily)"]
                let current = time["2017-11-29"]
                let previous = time["2017-11-28"]
                self.stockDetail["price"] = current["4. close"].string!
                self.stockDetail["symbol"] = data!["Meta Data"]["2. Symbol"].string!
                let change = round(Double(current["4. close"].string!)! - Double(previous["4. close"].string!)!) * 100 / 100
                let changep = round((change / Double(previous["4. close"].string!)!) * 10000) / 100
                self.stockDetail["change1"] = String(change)
                self.stockDetail["changep"] = String(changep)
                self.stockDetail["change"] = String(change) + "(" + String(changep) + "%)"
                self.stockDetail["timestamp"] = data!["Meta Data"]["3. Last Refreshed"].string!
                self.stockDetail["open"] = String(round(Double(current["1. open"].string!)! * 100) / 100)
                self.stockDetail["close"] = String(round(Double(current["4. close"].string!)! * 100) / 100)
                self.stockDetail["range"] = String(round(Double(current["1. open"].string!)! * 100) / 100) + "-" + String(round(Double(current["4. close"].string!)! * 100) / 100)
                self.stockDetail["volume"] = current["5. volume"].string!
                print(self.stockDetail.count)
                self.TableData.append(self.stockDetail)
                let time_series = time.sorted(by: {$0 > $1})
                
                self.stockDetailTable.reloadData()
                
                var i = 0
                for item in time_series {
                    let myitemk = item.0 // json key
                    //let myitemv = item.1 // json key value
                    self.DateTime.append(myitemk)
                    self.DATAArray.append(data!["Time Series (Daily)"][String(myitemk)]["1. open"])
                    self.DATAArrayV.append(data!["Time Series (Daily)"][String(myitemk)]["5. volume"])
                    i = i + 1
                    if i == 13{
                        break
                    }
                }
            }
        }
    }
    
   @IBAction func addFav() {
    let app = UIApplication.shared.delegate as! AppDelegate
    let context = app.persistentContainer.viewContext
    
    //创建User对象

        if star.imageView?.image == UIImage(named: "empty.png"){
            print("222")
            let currentDateTime = Date()
            //let newitem = NSEntityDescription.entity(forEntityName: "Favors", in: context)
            let newitem = NSEntityDescription.insertNewObject(forEntityName: "Favors", into: context)as! Favors
            newitem.setValue(stockSymbol, forKey: "symbol")
            newitem.setValue(Double(self.stockDetail["close"]!), forKey: "price")
            newitem.setValue(Double(self.stockDetail["change1"]!), forKey: "change")
            newitem.setValue(Double(self.stockDetail["changep"]!), forKey: "changep")
            newitem.setValue(currentDateTime, forKey: "time")
            star.setImage(UIImage(named: "filled.png"), for: UIControlState.normal)
            do {
                try context.save()
            } catch {
                print("Failed saving")
            }

        }
   else if star.imageView?.image == UIImage(named: "filled.png"){
        print("333")
        //let currentDateTime = Date()
        //let newitem = NSEntityDescription.entity(forEntityName: "Favors", in: context)
        let fetchRequest = NSFetchRequest<Favors>(entityName:"Favors")
        let predicate = NSPredicate(format: "symbol = '\(String(describing: stockSymbol))' ", "")
        fetchRequest.predicate = predicate
        do {
            let fetchedObjects = try context.fetch(fetchRequest)
            
            //遍历查询的结果
            for info in fetchedObjects{
                print("symbol=\(String(describing: info.symbol))")
                context.delete(info)
                print("delete success")
            }
        }
        catch {
            fatalError("不能保存：\(error)")
        }
        star.setImage(UIImage(named: "empty.png"), for: UIControlState.normal)
        do {
            try context.save()
        } catch {
            print("Failed saving")
        }
        
    }

    
    }

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
