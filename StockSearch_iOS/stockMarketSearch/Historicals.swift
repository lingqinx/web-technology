//
//  Historical.swift
//  stockMarketSearch
//
//  Created by Lingqing Xia on 11/29/17.
//  Copyright © 2017 Lingqing Xia. All rights reserved.
//

import UIKit
import Foundation
import SwiftyJSON


class Historicals: UIViewController, UIWebViewDelegate {
  var stockSymbol: String = ""
    
    @IBOutlet weak var historicalweb: UIWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        let myPath = Bundle.main.path(forResource: "historicalh", ofType: "html")
        print(stockSymbol + "1")
        historicalweb.loadRequest(NSURLRequest(url: NSURL(string: myPath!)! as URL) as URLRequest)
        historicalweb.isOpaque = false

        // Do any additional setup after loading the view.
    }

    func webViewDidFinishLoad(_ webView: UIWebView) {
        //let script = "$(function(){plotChart(\"" + stockSymbol + "\");});"
        print(stockSymbol + "2")
        let script = "$(function(){plotChart(\"" + stockSymbol + "\");});"
        print(script)
        historicalweb.stringByEvaluatingJavaScript(from: script)
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
