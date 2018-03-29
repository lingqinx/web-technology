//
//  favCellTableViewCell.swift
//  stockMarketSearch
//
//  Created by Lingqing Xia on 11/30/17.
//  Copyright © 2017 Lingqing Xia. All rights reserved.
//

import UIKit

class favCellTableViewCell: UITableViewCell {

    @IBOutlet weak var sym: UILabel!
    @IBOutlet weak var pri: UILabel!
    
    @IBOutlet weak var changes: UILabel!
    override func awakeFromNib() {
        super.awakeFromNib()
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
    }

}
