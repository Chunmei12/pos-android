var moment = require('moment');
const escpos = require('escpos');
import realm from './models/realm'

//G.BK
//8.57

const truncate = (str, length = 20, ending = '.') => {
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  }
  return str;
};

function formatQuantity(quantity) {
  quantity = quantity.toString()
  if (quantity.length <= 4)
    return quantity + ' '.repeat(4 - quantity.length)
  else 
    return quantity + ' '
}

function formatName(name) {
  name = name.toString()
  if (name.length <= 26)
    return name + ' '.repeat(26 - name.length)
  else 
    return name + ' '
}

function formatPu(price, vat = false) {
  if (price.length <= 7)
    return ' '.repeat(7 - price.length) + (vat ?  '': '  ') + price
  else 
    return ' ' + price
}

function formatTotalTtc(price, vat = false) {
  if (price.length <= 7)
    return ' '.repeat(7 - price.length) + (vat ?  '' : '  ') + price
  else 
    return ' ' + price
}

function formatOrderTtc(price) {
  if (price.length <= 11)
    return ' '.repeat(11 - price.length) + price + " Eur"
  else 
    return ' ' + price + " Eur"
}

function formatOptQuantity(quantity, vat = false) { 
  quantity = quantity.toString()
  if (quantity.length <= 3)
    return quantity + ' '.repeat(3 - quantity.length)
  else 
    return quantity + ' '
}

function formatOptName(name, vat = false) {
  name = name.toString()
  if (name.length <= 22)
    return name + ' '.repeat(22 - name.length)
  else 
    return name + ' '
}

function formatOptPu(price, vat = false) {
  if (price == '0.00') return ' '
  if (price.length <= 8)
    return ' '.repeat(8 - price.length) + price
  else 
    return ' ' + price
}

function formatOptTotalTtc(price, vat = false) {
  if (price == '0.00') return ' '
  if (price.length <= 10)
    return ' '.repeat(10 - price.length) + price
  else 
    return ' ' + price
}

function formatVatId(vatId) {
  if (vatId == 1)
    return '   ' + 'A'
  else if (vatId == 2)
    return '   ' + 'B'
  else if (vatId == 3)
    return '   ' + 'C'
  else if (vatId == 4)
    return '   ' + 'D'
  else if (vatId == 5)
    return '   ' + 'E'
}

function formatKitchenQuantity(quantity) {
  quantity = quantity.toString()
  if (quantity.length <= 2)
    return quantity + ' '.repeat(2 - quantity.length)
  else 
    return quantity + ' '
}

function printKitchen(Printer, selectedOrder) {
  
    var products = Array.prototype.slice.call(selectedOrder.products);
    var createdAt = moment(selectedOrder.createdAt).format('DD-MM-YYYY HH:mm');
    
    let printerIp = realm.objects('Printer')[1] ? realm.objects('Printer')[1].ipAddress : ''    
    const device  = new escpos.Network(printerIp);
    const printer = new escpos.Printer(device);

    device.open((err, dev) => {
        if (err) {
        return console.log(err);                
        }

        printer
        .encode('GBK')
        .font('a')
        .align('lt')
        .style('bu')
        .size(2, 2)
        .text("\n\n\n")
        .text(selectedOrder.type == 'sit' ? 'Table: ' + selectedOrder.table + '  \t\tCV: ' + selectedOrder.nbCustomer : selectedOrder.type == 'takeAway' ? 'EMPORTER ' + selectedOrder.table : selectedOrder.type == 'delivery' ? 'LIVRAISON ' + selectedOrder.table : 'COMPTOIR ' + selectedOrder.table)
        // .text(moment(selectedOrder.createdAt).format('HH:mm') + '\t' + selectedOrder.userName)
        // .text(moment(selectedOrder.createdAt).format('HH:mm'))
        .text("------------------------")
        .size(2, 2)
        products.forEach((p) => {
        if (p.printKitchen == true) {
            if (p.type == "product" || p.type == "")
              printer.text(p.quantity + '\t' + p.name)
            else if (p.type == "option") {
              printer.text('\t   ' + p.quantity + ' ' + p.name)
            }
            else if (p.type == "next") {
              printer.text('---------------')
            }
        }
        })
        
        printer
        .text("\n")
        .cut()

        setTimeout(() => {
        device.close(function(err){
            
        });
        }, 1000)
    })
}

function printKitchen2(Printer, selectedOrder) {
  
    var products = Array.prototype.slice.call(selectedOrder.products);
    var createdAt = moment(selectedOrder.createdAt).format('DD-MM-YYYY HH:mm');
    
    let printerIp = realm.objects('Printer')[2] ? realm.objects('Printer')[2].ipAddress : ''    
    const device  = new escpos.Network(printerIp);
    const printer = new escpos.Printer(device);

    device.open((err, dev) => {
        if (err) {
        return console.log(err);                
        }

        printer
        .encode('GBK')
        .font('a')
        .align('lt')
        .style('bu')
        .size(2, 2)
        .text("\n\n\n")
        .text(selectedOrder.type == 'sit' ? 'Table: ' + selectedOrder.table + '  \t\tCV: ' + selectedOrder.nbCustomer : selectedOrder.type == 'takeAway' ? 'EMPORTER ' + selectedOrder.table : selectedOrder.type == 'delivery' ? 'LIVRAISON ' + selectedOrder.table : 'COMPTOIR ' + selectedOrder.table)
        // .text(moment(selectedOrder.createdAt).format('HH:mm') + '\t' + selectedOrder.userName)
        // .text(moment(selectedOrder.createdAt).format('HH:mm'))
        .text("------------------------")
        .size(2, 2)
        products.forEach((p) => { 
        if (p.printKitchen == true) {
            if (p.type == "product" || p.type == "")
            printer.text(p.quantity + '\t' + p.name)
            else if (p.type == "option") {
                printer.text('\t   ' + p.quantity + ' ' + p.name)
            }
            else if (p.type == "next") {
            printer.text('---------------')
            }
        }
        })
        
        printer
        .text("\n")
        .cut()

        setTimeout(() => {
        device.close(function(err){
            
        });
        }, 1000)
    })
}


function printTicket(Printer, selectedOrder) {
  let ticketHeader = realm.objects('TicketHeader').sorted('id')
  let ticketFooter = realm.objects('TicketFooter').sorted('id')
  var products = Array.prototype.slice.call(selectedOrder.products);
  var totalTtc = selectedOrder.totalTtc.toFixed(2);
  var totalHt = selectedOrder.totalHt.toFixed(2);
  var totalRemise = selectedOrder.totalDiscountTtc.toFixed(2);
  var Remise = selectedOrder.discount.toFixed(2);
  var createdAt = moment(selectedOrder.createdAt).format('DD-MM-YYYY HH:mm');

  let printerIp = realm.objects('Printer')[0] ? realm.objects('Printer')[0].ipAddress : ''
  console.log(printerIp)
  const device  = new escpos.Network(printerIp);
  const printer = new escpos.Printer(device);
  
  device.open((err, dev) => {
  if (err) {
      return console.log(err);                
  }
  
  printer
  .encode('857')
  .font('a')
  .align('ct')
  

  for (let i = 0; i < ticketHeader.length; i++) {
    if (i == 0 )  printer.size(2, 2)
    else printer.size(1, 1)
    printer.text(ticketHeader[i].text)
  }

  printer
  .size(1, 1)
  .align('lt')
  .text(createdAt)
  //.text("Document provisoire n°" + selectedOrder.id + " (impr:"+ selectedOrder.nbPrinted + "-" + selectedOrder.products.length +  ")\n")
  .size(2, 2)
  .text(selectedOrder.type == 'sit' ? 'Table: ' + selectedOrder.table + '  \t\tCV: ' + selectedOrder.nbCustomer : selectedOrder.type == 'takeAway' ? 'EMPORTER ' + selectedOrder.table : selectedOrder.type == 'delivery' ? 'LIVRAISON ' + selectedOrder.table : 'COMPTOIR ' + selectedOrder.table)
  .size(1, 1)
  .text("------------------------------------------------")


  if (selectedOrder.type == 'delivery') {
      let deliveryAddress = selectedOrder.customer.deliveryAddress
      printer.text("Adresse de livrraison:")
      printer.text(selectedOrder.customer.firstName + ' ' + selectedOrder.customer.lastName)
      printer.text(deliveryAddress.streetNumber + " " + deliveryAddress.streetType + " " + deliveryAddress.streetName)
      printer.text(deliveryAddress.postal + " " + deliveryAddress.city)
      printer.text("Tél: " + selectedOrder.customer.phone)
      printer.text("Bat: " + deliveryAddress.appartment + "\tEtg: " + deliveryAddress.floor + "\tPorte: " + deliveryAddress.door + "\tEsc: " + deliveryAddress.stair)
      printer.text("Code 1: " + deliveryAddress.code1 + "\tCode 2: " + deliveryAddress.code2 + "\tInter: " + deliveryAddress.interphone)
      printer.text("Note: " + deliveryAddress.note)
      printer.text("------------------------------------------------")
  }

  printer.align('lt')
  .text("QTÉ   DESCRIPTION                  P.U     Total")
  products.forEach((p) => { 
    if (p.type == "product" || p.type == "") {
      if (p.discount && p.discount == 100) {
        if (!p.gram)
          printer.text(formatQuantity(p.quantity) + formatName(p.name) + ' OFFERT')
        else 
          printer.text(formatQuantity(1) + formatName(truncate(p.name) + ' ' + p.quantity + 'g') + ' OFFERT')
      }
      else {
        if (!p.gram)
          printer.text(formatQuantity(p.quantity) + formatName(p.name) + formatPu(p.priceTtc.toFixed(2)) + formatTotalTtc(p.totalTtc.toFixed(2)))
        else
          printer.text(formatQuantity(1) + formatName(truncate(p.name)+ ' ' + p.quantity + 'g') + formatPu(p.priceTtc.toFixed(2)) + formatTotalTtc(p.totalTtc.toFixed(2)))
      }
      
      if (p.discount && p.discount != 100)
        printer.text("\t\t\tREMISE " + p.discount + "%\t-" + p.totalDiscountTtc.toFixed(2))
    }
      else if (p.type == "option") {
        if (!p.gram)
          printer.text('     ' + formatOptQuantity(p.quantity) + formatOptName(p.name) + formatOptPu(p.priceTtc.toFixed(2)) + formatOptTotalTtc(p.totalTtc.toFixed(2)))
        else
          printer.text('     ' + formatOptQuantity(1) + formatOptName(truncate(p.name)+ ' ' + p.quantity + 'g') + formatOptPu(p.priceTtc.toFixed(2)) + formatOptTotalTtc(p.totalTtc.toFixed(2)))
      }
  })

  printer.text("------------------------------------------------")
  if (selectedOrder.discount) {
      printer
      .align('rt')
      .text("REMISE " + selectedOrder.discount + "%" + "\t-" + selectedOrder.totalDiscountTtc.toFixed(2) + " Eur")
      .align('lt')
  }
  printer
  .size(2, 2)
  .text("\nTOTAL TTC" + formatOrderTtc(selectedOrder.totalTtc.toFixed(2)))
  .size(1, 1)
  .align('ct')
  
  printer.text("\n------------------------------------------------")
  printer.text("Merci de votre visite")
  printer.text("A bientôt")
  printer.text("\n")
  // for (let i = 0; i < ticketFooter.length; i++) {
  //   printer.text(ticketFooter[i].text)
  // }

  printer.cut()

  setTimeout(() => {
  device.close(function(err){
      
  });
  }, 1000)

})
}


module.exports = {
  printKitchen,
  printKitchen2,
  printTicket
}
