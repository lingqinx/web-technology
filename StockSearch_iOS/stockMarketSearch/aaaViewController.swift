//
//  aaaViewController.swift
//  stockMarketSearch
//
//  Created by Lingqing Xia on 11/28/17.
//  Copyright © 2017 Lingqing Xia. All rights reserved.
//

import UIKit
import Alamofire
import AlamofireSwiftyJSON
import SwiftyJSON


class aaaViewController: UIViewController, UITableViewDelegate, UITableViewDataSource{
    let a:Array = [1,2,3]
      var stockSymbol: String = ""
    var newsArray : Array<Dictionary<String, String>> = Array<Dictionary<String, String>>()
    @IBOutlet weak var NewsTable: UITableView!
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return newsArray.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        //let cell = UITableViewCell()
        //cell.textLabel?.text = "123"
        let cell = NewsTable.dequeueReusableCell(withIdentifier: "newsRow", for: indexPath) as! NewsTableCell
        //let cell = UITableViewCell()
        //cell.textLabel?.text = "123"
        let str = newsArray[indexPath.row]["pubDate"]!
        let start = str.index(str.startIndex, offsetBy: 0)
        let end = str.index(str.endIndex, offsetBy: -5)
        let result = str[start..<end]
        cell.title.text = newsArray[indexPath.row]["title"]
        cell.Author.text = "Author: "+newsArray[indexPath.row]["auName"]!
        cell.pubDate.text = "Date: "+result+"EST"
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let rIndex = indexPath.row
        if let checkURL = NSURL(string: newsArray[rIndex]["link"]!){
            UIApplication.shared.openURL(checkURL as URL)
        }
    }

    override func viewDidLoad() {
        loadNews()
        super.viewDidLoad()
    }
    func loadNews(){
        Alamofire.request("http://stockenviroment.us-east-2.elasticbeanstalk.com/news", parameters : ["input" : stockSymbol]).responseSwiftyJSON { response in
            let data = response.result.value //A JSON object
            let isSuccess = response.result.isSuccess
            if (isSuccess && (data != nil)) {
                let News = data!["rss"]["channel"][0]["item"]
                
                    for i in 0 ..< News.count{

                        var newsRow: Dictionary<String, String> = Dictionary<String, String>()
                        if (News[i]["link"][0].string?.contains("article"))!{
                            print("qq")
                            newsRow["title"] = News[i]["title"][0].string
                            //print(newsRow["title"])
                            newsRow["link"] = News[i]["link"][0].string
                            newsRow["auName"] = News[i]["sa:author_name"][0].string
                            //print(newsRow["auName"])
                            newsRow["pubDate"] = News[i]["pubDate"][0].string
                            self.newsArray.append(newsRow)
                        
                        }
                        newsRow.removeAll()
                    
                }
                

                self.NewsTable.reloadData()
            }
        }
        
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
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
