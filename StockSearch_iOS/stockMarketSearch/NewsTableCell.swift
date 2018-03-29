//
//  NewsTableCell.swift
//  stockMarketSearch
//
//  Created by Lingqing Xia on 11/28/17.
//  Copyright © 2017 Lingqing Xia. All rights reserved.
//

import UIKit

class NewsTableCell: UITableViewCell {

    @IBOutlet weak var Author: UILabel!
    @IBOutlet weak var title: UILabel!
    
    @IBOutlet weak var pubDate: UILabel!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
