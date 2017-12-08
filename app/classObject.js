import realm from './models/realm'

var moment = require('moment');

class OrderClass {
  constructor(id, type, totalDelivery) {
    this.id = id;
    this.nbCustomer = 0;
    this.createdAt = new Date();
    this.table = 'L' + totalDelivery;
    this.type = type;
    this.takeAwayName = '';
    this.takeAwayPhone = '';
    this.products = [];
    this.takeAwayPhone = '';
    this.nbPrinted = 0;
    this.payments = [];
    this.userId = 0;
    this.userName = '';
    this.deviceId = 0;
    this.totalHt1 = 0;
    this.totalHt2 = 0;
    this.totalHt3 = 0;
    this.totalTtc1 = 0;
    this.totalTtc2 = 0;
    this.totalTtc3 = 0;
    this.totalVat1 = 0.00;
    this.totalVat2 = 0.00;
    this.totalVat3 = 0.00;
    this.vatRate1 = realm.objects('Vat')[0].pourcentage;
    this.vatRate2 = realm.objects('Vat')[1].pourcentage;
    this.vatRate3 = realm.objects('Vat')[2].pourcentage;
    this.totalHt = 0.00;
    this.totalTtc = 0.00;
    this.totalVat = 0.00;
  }
}

// TODO: remove class above or below
class Order {
  constructor(id, type, totalDelivery) {
    this.id = id;
    this.nbCustomer = 0;
    this.createdAt = new Date();
    this.table = 'L' + totalDelivery;
    this.type = type;
    this.takeAwayName = '';
    this.takeAwayPhone = '';
    this.products = [];
    this.nbPrinted = 0;
    this.payments = [];
    this.userId = 0;
    this.userName = '';
    this.deviceId = 0;
    this.totalHt1 = 0;
    this.totalHt2 = 0;
    this.totalHt3 = 0;
    this.totalTtc1 = 0;
    this.totalTtc2 = 0;
    this.totalTtc3 = 0;
    this.totalVat1 = 0.00;
    this.totalVat2 = 0.00;
    this.totalVat3 = 0.00;
    this.vatRate1 = realm.objects('Vat')[0].pourcentage;
    this.vatRate2 = realm.objects('Vat')[1].pourcentage;
    this.vatRate3 = realm.objects('Vat')[2].pourcentage;
    this.totalHt = 0.00;
    this.totalTtc = 0.00;
    this.totalVat = 0.00;
  }
}

class ArchiveObject {
  constructor() {
    var config = realm.objects('Config')[0];
    this.id= 0;
    this.createdAt = new Date();
    this.ttcVentillated = '';
    this.grandTotal = 0.00;
    this.deviceId = config.deviceId.toString();
  }
}
class Customer {
  constructor(id) {
    this.id = id;
    this.companyName = '';
    this.firstName = '';
    this.lastName = '';
    this.phone = '';
    this.deliveryAddress()
    this.note = '';
    this.createdAt = new Date()
  }
  deliveryAddress() {
    this.deliveryAddress = {
      streetNumber: '',
      streetType: '',
      streetName: '',
      postal: '',
      city: '',
      note: '',
      code1: '',
      code2: '',
      interphone: '',
      appartment: '',
      floor: '',
      door: '',
      stair: '',
    }
  }
}
class Booking {
  constructor(id) {
    this.id = id;
    this.lastName = '';
    this.phone = '';
    this.person = 0;
    this.table = '';
    this.date = moment(new Date()).format("YYYY-MM-DD");
    this.time = '';
    this.status = '';
  }
}
class Product {
  constructor(id) {
    this.id = id;
    this.name = '';
    this.code = '';
    this.stockQuantity = 0;
    this.categoryId =  0;
    this.vatId = 1;
    this.priceTtc = 0;
    this.priceHt = 0;
  }
};
class ExpenseReport{
  constructor(object) {
    this.idOrder = object.idOrder;
    this.total = object.total;
    this.nbCustomer =  object.nbCustomer;
    this.nbPrinter = object.nbPrinter;
    this.createdAt = new Date();
  }
}
class Tracer{
  constructor(object) {
    this.code = object.code;
    this.name = object.name;
    this.createdAt =  new Date();
    this.details = object.details;
  }
}
export { OrderClass, Order, Customer, Booking, Product, ExpenseReport, Tracer, ArchiveObject };