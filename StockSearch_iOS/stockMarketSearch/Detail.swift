//
//  Detail.swift
//  stockMarketSearch
//
//  Created by Lingqing Xia on 11/29/17.
//  Copyright © 2017 Lingqing Xia. All rights reserved.
//

import UIKit

class Detail: UIViewController {
    var stockDetail: Array<Dictionary<String, String>>?
    var stockSymbol:String?
    @IBOutlet weak var newsContainer: UIView!
    @IBOutlet weak var historicalContainer: UIView!
    @IBOutlet weak var DetailTableContainer: UIView!

    @IBOutlet weak var ba: UIButton!
    
    @IBOutlet weak var segmentBar: UISegmentedControl!
    
    @IBOutlet weak var navigationBar: UINavigationItem!
    override func viewDidLoad() {
        //super.viewDidLoad()
        DetailTableContainer.isHidden = false
        historicalContainer.isHidden = true
        newsContainer.isHidden = true
        
        self.navigationController?.isNavigationBarHidden = false
        //self.navigationBar.title = stockDetail![1]["Symbol"]!

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func touchSegmentedController(sender: AnyObject) {
        if segmentBar.selectedSegmentIndex == 0 {
            DetailTableContainer.isHidden = false
            //      performSegueWithIdentifier("sagueToDetailTable", sender: self)
           historicalContainer.isHidden = true
            newsContainer.isHidden = true
        }
        else if segmentBar.selectedSegmentIndex == 1 {
            DetailTableContainer.isHidden = true
            historicalContainer.isHidden = false
            newsContainer.isHidden = true
            //NotificationCenter.default.post(name: NSNotification.Name(rawValue: "loadWeb"), object: nil)
        }
        else if segmentBar.selectedSegmentIndex == 2 {
            DetailTableContainer.isHidden = true
            historicalContainer.isHidden = true
            newsContainer.isHidden = false
           // NotificationCenter.default.post(name: NSNotification.Name(rawValue: "loadNews"), object: nil)
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
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        
        if segue.identifier == "sagueToDetailTable" {
            let symbol: stockTableViewViewController = segue.destination as! stockTableViewViewController
            symbol.stockSymbol = stockSymbol!
        }
        else if segue.identifier == "segueToHistorical"  {
            let symbol: Historicals = segue.destination as! Historicals
            symbol.stockSymbol = stockSymbol!
        }
        else if segue.identifier == "segueToNews" {
            let symbol: aaaViewController = segue.destination as! aaaViewController
            symbol.stockSymbol = stockSymbol!
        }
        
    }

}
