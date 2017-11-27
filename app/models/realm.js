'use strict';

import Realm from 'realm';

const BookingSchema = {
  name: 'Booking',
  primaryKey: 'id',
  properties: {
    id: 'int',
    lastName: { type: 'string', default: '' },
    phone: { type: 'string', default: '' },
    person: { type: 'int', default: 0 },
    table: { type: 'string', default: '' },
    date: { type: 'string', default: '' },
    time: { type: 'string', default: '' },
    status: { type: 'string', default: '' }
  }
};


const AddressSchema = {
  name: 'Address',
  properties: {
    street: "string",
    postal: "string",
    city: "string",
    code1: { type: "string", optional: true },
    code2: { type: "string", optional: true },
    interphone: { type: "string", optional: true },
    appartment:{ type: "string", optional: true },
    floor: { type: "string", optional: true },
    door: { type: "string", optional: true },
    note: { type: "string", optional: true },
  }
};

const AddressSchema11 = {
  name: 'Address',
  properties: {
    streetNumber: "string",
    streetType: "string",
    streetName: "string",
    postal: "string",
    city: "string",
    code1: { type: "string", optional: true, default: '' },
    code2: { type: "string", optional: true, default: '' },
    interphone: { type: "string", optional: true, default: '' },
    appartment:{ type: "string", optional: true, default: '' },
    floor: { type: "string", optional: true, default: '' },
    stair: { type: "string", optional: true, default: '' },
    door: { type: "string", optional: true, default: '' },
    note: { type: "string", optional: true, default: '' },
  }
};

const CustomerSchema = {
  name: 'Customer',
  primaryKey: 'id',
  properties: {
    id: 'int',
    companyName: { type: 'string', default:'' },
    firstName: { type: 'string', default:''},
    lastName: {type:'string',default:''},
    phone: {type:'string',default:''},
    deliveryAddress: { type: 'Address',optional: true },
    note: { type: 'string', default:''},
    createdAt: 'date'
  }
};


const UserSchema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: { type: 'string', default:'' },
    password: { type: 'string', default:'' },
    activated: { type: 'bool', default: true},
    updatedAt: {type:'date', default: new Date()},

  }
};

const CartCustomerSchema = {
  name: 'CartCustomer',
  properties: {
    id:{type:'int',default:0},
    companyName: { type: 'string', default:''},
    firstName: { type: 'string', default:'' },
    lastName: {type:'string',default:''},
    phone: {type:'string',default:''},
    deliveryAddress: { type: 'Address', optional: true},
    note: { type: 'string', default:'' },
    createdAt:{type:'date',default: new Date()},
  }
};

const ExpenseReportSchema={
  name: 'ExpenseReport',
  properties: {
    idOrder: {type:'int',default:0},
    total: {type:'float',default:0},
    nbCustomer: {type:'int',default:0},
    createdAt: {type:'date',default: new Date()},
    nbPrinter: {type:'int',default:0}
  }
};


const TicketHeaderSchema = {
  name: 'TicketHeader',
  primaryKey: 'id',
  properties: {
    id: 'int',
    phone: {type:'string', default: ''},
    name: {type:'string', default: ''},
    address: {type:'string', default: ''},
    postal: {type:'string', default: ''},
    city: {type:'string', default: ''},
    country: {type:'string', default: 'France'},
    siret: {type:'string', default: ''},
    vat: {type:'string', default: ''},
    ape: {type:'string', default: ''},
  }
}

const TicketFooterSchema = {
  name: 'TicketFooter',
  primaryKey: 'id',
  properties: {
    id: 'int',
    footer: { type: 'list', objectType: 'StringObject' },
    separator: { type: 'list', objectType: 'SeparatorObject' } //{"activated": true, "type": "dashed"},
  }
};

const StringObjectSchema = {
  name: 'StringObject',
  primaryKey: 'id',
  properties: {
    id: 'int',
    value: {type:'string',default:''}
  }
};

const SeparatorSchema = {
  name: 'SeparatorObject',
  primaryKey: 'id',
  properties: {
    id: 'int',
    activated: { type: 'bool', default: true }
  }
};

const OrderSchema = {
  name: 'Order',
  primaryKey: 'id',
  properties: {
    id: 'int',
    nbCustomer: {type: 'int', optional: true},
    table: {type: 'string', optional: true},
    createdAt: 'date',
    finishedAt: { type: 'date', optional: true },
    typeDoc: { type: 'string', default: 'Note' },
    type: 'string',
    products: { type: 'list', objectType: 'CartProduct' },
    expenseReport: { type: 'list', objectType: 'ExpenseReport'},
    customer: { type: 'CartCustomer', optional: true },
    takeAwayName: { type: 'string', optional: true },
    takeAwayPhone: { type: 'string', optional: true },
    nbPrinted: { type: 'int', default: 0 },
    payments: { type: 'list', objectType:'OrderPayment' },
    userId: 'int',
    userName: 'string',
    deviceId: 'int',
    totalTtc: 'float',
    totalTtc1: 'float',
    totalTtc2: 'float',
    totalTtc3: 'float',
    totalHt: 'float',
    totalHt1: 'float',
    totalHt2: 'float',
    totalHt3: 'float',
    totalVat: 'float',
    totalVat1: 'float',
    totalVat2: 'float',
    totalVat3: 'float',
    vatRate1: 'float',
    vatRate2: 'float',
    vatRate3: 'float',
    discount: {type:'float', default:0.00},
    totalDiscountTtc: {type:'float', default:0.00},
    totalDiscountHt: {type:'float', default:0.00},
    canceled:{type: 'bool', default: false },
    closed: {type: 'bool', default: false },
    paybackCredit: { type: 'Credit', optional: true },
    paybackCash: { type: 'float', optional: true },
    appVersion: {type:'string'},
    ticketHeaderId: {type:'int'},
    ticketFooterId: {type:'int'},
  }
};

const OrderSchema11 = {
  name: 'Order',
  primaryKey: 'id',
  properties: {
    id: 'int',
    nbCustomer: {type: 'int', optional: true},
    table: {type: 'string', optional: true},
    createdAt: 'date',
    finishedAt: { type: 'date', optional: true },
    typeDoc: { type: 'string', default: 'Note' },
    type: 'string',
    products: { type: 'list', objectType: 'CartProduct' },
    expenseReport: { type: 'list', objectType: 'ExpenseReport'},
    customer: { type: 'CartCustomer', optional: true },
    takeAwayName: { type: 'string', optional: true },
    takeAwayPhone: { type: 'string', optional: true },
    nbPrinted: { type: 'int', default: 0 },
    payments: { type: 'list', objectType:'OrderPayment' },
    userId: 'int',
    userName: 'string',
    deviceId: 'int',
    totalTtc: 'float',
    totalTtc1: 'float',
    totalTtc2: 'float',
    totalTtc3: 'float',
    totalHt: 'float',
    totalHt1: 'float',
    totalHt2: 'float',
    totalHt3: 'float',
    totalVat: 'float',
    totalVat1: 'float',
    totalVat2: 'float',
    totalVat3: 'float',
    vatRate1: 'float',
    vatRate2: 'float',
    vatRate3: 'float',
    discount: {type:'float', default:0.00},
    totalDiscountTtc: {type:'float', default:0.00},
    totalDiscountHt: {type:'float', default:0.00},
    canceled:{type: 'bool', default: false },
    closed: {type: 'bool', default: false },
    archived: {type: 'bool', default: false },
    paybackCredit: { type: 'Credit', optional: true },
    paybackCash: { type: 'float', optional: true },
    appVersion: {type:'string'},
    ticketHeaderId: {type:'int'},
    ticketFooterId: {type:'int'},
  }
};

const FinishedOrderSchema = {
  name: 'FinishedOrder',
  primaryKey: 'id',
  properties: {
    id: 'int',
    nbCustomer: {type: 'int', default: 0},
    table: {type: 'string', optional: true},
    createdAt: 'date',
    finishedAt: 'date',
    gdh: 'string',
    typeDoc: { type: 'string', default: 'Ticket' },
    type: 'string',
    products: { type: 'list', objectType: 'CartProduct' },
    expenseReport: { type: 'list', objectType: 'ExpenseReport'},
    customer: { type: 'CartCustomer', optional: true },
    takeAwayName: { type: 'string', optional: true },
    takeAwayPhone: { type: 'string', optional: true },
    nbPrinted: { type: 'int', default: 0 },
    payments: { type: 'list', objectType:'OrderPayment' },
    userId: 'int',
    userName: 'string',
    deviceId: 'int',
    duplicates: {type: 'list', objectType:'Duplicate'},
    totalTtc: 'float',
    totalTtc1: 'float',
    totalTtc2: 'float',
    totalTtc3: 'float',
    totalHt: 'float',
    totalHt1: 'float',
    totalHt2: 'float',
    totalHt3: 'float',
    totalVat: 'float',
    totalVat1: 'float',
    totalVat2: 'float',
    totalVat3: 'float',
    vatRate1: 'float',
    vatRate2: 'float',
    vatRate3: 'float',
    discount: {type:'float',default:0.00},
    totalDiscountTtc: {type:'float',default:0.00},
    totalDiscountHt: {type:'float',default:0.00},
    canceled: {type: 'bool', default: false },
    canceledForTicketId: {type: 'int', optional: true},
    closed: {type: 'bool', default: false },
    zId: {type: 'int', optional: true},
    nbLine: {type: 'int'},
    dataOrigin: {type: 'string', default:'In'},
    appVersion: {type:'string'},
    paybackCredit: { type: 'Credit', optional: true },
    paybackCash: { type: 'float', optional: true },
    ticketHeaderId: {type:'int'},
    ticketFooterId: {type:'int'},
    isFirstSignature: 'string',
    previousSignature:{type:'string', optional:true},
    signature: 'string',
  }
};

const OrderPaymentSchema = {
  name: 'OrderPayment',
  properties: {
    id: 'int',
    name: 'string',
    amount: { type: 'float', optional: true },
    //paidAt: 'date' //todo: add
  }
};

const PaymentMethodSchema = {
  name: 'PaymentMethod',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    activated: 'bool'
  }
};

const PrinterSchema = {
  name: 'Printer',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    deviceName: { type: 'string', default: '' },
    target: { type: 'string', default: '' },
    ipAddress: { type: 'string', default: '' }
  }
};



const CategorySchema = {
  name: 'Category',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: { type: 'string', default: '' },
    page: { type: 'int', default: 1 },
    color: {type: 'string', default: '#1976D2'},
  }
};

const CategorySchema11 = {
  name: 'Category',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: { type: 'string', default: '' },
    logo: { type: 'string', default: '1' },
    color: {type: 'string', default: '#1976D2'},
  }
};

const SubCategorySchema = {
  name: 'SubCategory',
  primaryKey: 'id',
  properties: {
    id: 'int',
    categoryId: { type: 'int', default: 0 },
    position: 'int',
    name: { type: 'string', default: '' },
  }
};


const ProductSchema = {
  name: 'Product',
  primaryKey: 'id',
  properties: {
    id: 'int',
    code: { type: 'string', default: '' },
    name: { type: 'string', default: '' },
    stockQuantity: { type: 'int', default: 0},
    priceTtc: { type: 'float', default: 0.00 },
    priceHt: { type: 'float', default: 0.00 },
    categoryId: { type: 'int', default: 0 },
    vatId: { type: 'int', default: 1 },
    vatRate: {type: 'float', default: 0.00 },
    stockActivated: { type: 'bool', default: false},
    gram: { type: 'bool', default: false},
    printKitchen: { type: 'bool', default: true},
    color: { type: 'string', default: ''},
  }
};

const ProductSchema11 = {
  name: 'Product',
  primaryKey: 'id',
  properties: {
    id: 'int',
    code: { type: 'string', default: '' },
    name: { type: 'string', default: '' },
    stockQuantity: { type: 'int', default: 0},
    priceTtc: { type: 'float', default: 0.00 },
    priceHt: { type: 'float', default: 0.00 },
    categoryId: { type: 'int', default: 0 },
    subCategoryId: { type: 'int', default: 0 },
    vatId: { type: 'int', default: 1 },
    vatRate: {type: 'float', default: 0.00 },
    stockActivated: { type: 'bool', default: false},
    gram: { type: 'bool', default: false},
    printKitchen: { type: 'bool', default: true},
    color: { type: 'string', default: ''},
    position: 'int',
    type: {type: 'string', default: 'product'},
  }
};

const ProductSchema12 = {
  name: 'Product',
  primaryKey: 'id',
  properties: {
    id: 'int',
    code: { type: 'string', default: '' },
    name: { type: 'string', default: '' },
    price: {type: 'list', objectType: 'ProductPrice'},
    stockQuantity: { type: 'int', default: 0},
    categoryId: { type: 'int', default: 0 },
    subCategoryId: { type: 'int', default: 0 },
    stockActivated: { type: 'bool', default: false},
    printKitchen: { type: 'bool', default: true},
    color: { type: 'string', default: ''},
    position: 'int',
    type: {type: 'string', default: 'product'},
  }
};


const ProductPrice = {
  name: 'ProductPrice',
  primaryKey: 'id',
  properties: {
    id: 'int',
    roomId: 'int',
    priceTtc: { type: 'float', default: 0.00 },
    priceHt: { type: 'float', default: 0.00 },
    vatId: { type: 'int', default: 1 },
    vatRate: {type: 'float', default: 0.00 },
    gram: { type: 'bool', default: false},
  }
};

// const ProductOptionSchema = {
//   name: 'ProductOption',
//   properties: {
//     name: { type: 'string', default: '' },
//     priceTtc: { type: 'float', default: 0.00 },
//     priceHt: { type: 'float', default: 0.00 },
//     vatId: { type: 'int', default: 1 },
//     vatRate: {type: 'float', default: 0.00 },
//     printKitchen: { type: 'bool', default: true}
//   }
// };

// const ProductOptionSchema = {
//   name: 'ProductOption',
//   properties: {
//     name: { type: 'string', default: '' },
//     priceTtc: { type: 'float', default: 0.00 },
//     priceHt: { type: 'float', default: 0.00 },
//     vatId: { type: 'int', default: 1 },
//     vatRate: {type: 'float', default: 0.00 },
//     printKitchen: { type: 'bool', default: true}
//   }
// };

const CartProductSchema = {
  name: 'CartProduct',
  properties: {
    id: { type: 'int'},
    code: { type: 'string', default: '' },
    name: { type: 'string', default: '' },
    quantity: { type: 'int', default: 0 },
    gramQuantity: { type: 'int', default: 0 },
    priceTtc: { type: 'float', default: 0.00 },
    priceHt: { type: 'float', default: 0.00 },
    totalTtc: {type: 'float', default: 0.00 },
    vatRate: {type: 'float', default: 0.00 },
    vatId: { type: 'int', default: 1 },
    stockActivated: { type: 'bool', default: false},
    discount: {type:'float', default:0.00},
    totalDiscountTtc: {type:'float', default:0.00},
    totalDiscountHt: {type:'float', default:0.00}, // TODO REMOVE
    categoryId: { type: 'int', default: 0 },
    printKitchen: { type: 'bool', default: true} ,
    deviceId: 'int', // TODO: check if needed
    addedAt: 'date',
    color: { type: 'string', default: '#1976D2'},
  }
};


const CartProductSchema11 = {
  name: 'CartProduct',
  properties: {
    id: { type: 'int'},
    code: { type: 'string', default: '' },
    name: { type: 'string', default: '' },
    quantity: { type: 'int', default: 0 },
    gramQuantity: { type: 'int', default: 0 },
    priceTtc: { type: 'float', default: 0.00 },
    priceHt: { type: 'float', default: 0.00 },
    totalTtc: {type: 'float', default: 0.00 },
    vatRate: {type: 'float', default: 0.00 },
    vatId: { type: 'int', default: 1 },
    stockActivated: { type: 'bool', default: false},
    discount: {type:'float', default:0.00},
    totalDiscountTtc: {type:'float', default:0.00},
    totalDiscountHt: {type:'float', default:0.00}, // TODO REMOVE
    categoryId: { type: 'int', default: 0 },
    printKitchen: { type: 'bool', default: true} ,
    deviceId: 'int', // TODO: check if needed
    addedAt: 'date',
    color: { type: 'string', default: '#1976D2'},
    type: {type: 'string', default: 'product'},
  }
};

const CartProductSchema15 = {
  name: 'CartProduct',
  properties: {
    id: { type: 'int'},
    code: { type: 'string', default: '' },
    name: { type: 'string', default: '' },
    quantity: { type: 'int', default: 0 },
    gram: { type: 'bool', default: false},
    priceTtc: { type: 'float', default: 0.00 },
    priceHt: { type: 'float', default: 0.00 },
    totalTtc: {type: 'float', default: 0.00 },
    vatRate: {type: 'float', default: 0.00 },
    vatId: { type: 'int', default: 1 },
    stockActivated: { type: 'bool', default: false},
    discount: {type:'float', default:0.00},
    totalDiscountTtc: {type:'float', default:0.00},
    totalDiscountHt: {type:'float', default:0.00}, // TODO REMOVE
    categoryId: { type: 'int', default: 0 },
    printKitchen: { type: 'bool', default: true} ,
    deviceId: 'int', // TODO: check if needed
    addedAt: 'date',
    color: { type: 'string', default: '#1976D2'},
    type: {type: 'string', default: 'product'},
    printed: {type: 'bool', default: false},
  }
};


const RoomSchema = {
  name: 'Room',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: {type: 'string', default: ''},
    activated: { type: 'bool', default: false },
    tables: { type: 'list', objectType:'Table' },
    fastPayment: { type: 'bool', default: false },
    freeItem: { type: 'bool', default: true },
    discountPourcent: { type: 'bool', default: true },
    discountMoney: { type: 'bool', default: true },
    openDrawer: { type: 'bool', default: true },
  }
};

const TableSchema = {
  name: 'Table',
  primaryKey: 'id',
  properties: {
    id: 'int',
    idOrder: 'int',
    name: {type: 'string', default: ''},
    totalTtc: 'float',
    type: {type: 'string', default: 'square'},
    activated: { type: 'bool', default: false },
    nbPrinted: {type:'int', default: 0}
  }
};

const VatSchema = {
  name: 'Vat',
  primaryKey: 'id',
  properties: {
    id: 'int',
    pourcentage: 'float'
  }
};

const CreditSchema = {
  name: 'Credit',
  primaryKey: 'id',
  properties: {
    id: 'int',
    createdAt: 'date',
    expiredAt: { type: 'date', optional: true },
    orderId: 'int',
    amount: 'float',
    usedOnOrder: {type: 'int', optional: true},
    usedDate: {type: 'date', optional: true},
    nbPrinted: { type: 'int', default: 0 },
  }
}

const PreferencesSchema = {
  name: 'Preferences',
  properties: {
    sit: { type: 'bool', default: true},
    takeAway: {type: 'bool', default: true},
    delivery: {type: 'bool', default: true},
    bar: {type: 'bool', default: true},
    booking: {type: 'bool', default: true},
    customer: {type: 'bool', default: true},
    accountingPwd: {type: 'string', default: '0000'},
    accountingEmail: {type: 'string', optional: true},
    creditValidity: {type: 'int', default: 1},
    printOnCloseTable: {type: 'bool', default: false},
    drawerOnCloseTable: {type: 'bool', default: false},
    printOnCloseTakeAway: {type: 'bool', default: false},
    drawerOnCloseTakeAway: {type: 'bool', default: false},
    printOnCloseDelivery: {type: 'bool', default: false},
    drawerOnCloseDelivery: {type: 'bool', default: false},
    printOnCloseBar: {type: 'bool', default: false},
    drawerOnCloseBar: {type: 'bool', default: false},
    printOnCloseDay: {type: 'bool', default: false},
    mandatoryCustomerNb: {type: 'bool', default: true},
  }
}

const PreferencesSchema15 = {
  name: 'Preferences',
  properties: {
    sit: { type: 'bool', default: true},
    takeAway: {type: 'bool', default: true},
    delivery: {type: 'bool', default: true},
    bar: {type: 'bool', default: true},
    booking: {type: 'bool', default: true},
    customer: {type: 'bool', default: true},
    accountingPwd: {type: 'string', default: '0000'},
    accountingEmail: {type: 'string', optional: true},
    creditValidity: {type: 'int', default: 1},
    printOnCloseTable: {type: 'bool', default: false},
    drawerOnCloseTable: {type: 'bool', default: false},
    printOnCloseTakeAway: {type: 'bool', default: false},
    drawerOnCloseTakeAway: {type: 'bool', default: false},
    printOnCloseDelivery: {type: 'bool', default: false},
    drawerOnCloseDelivery: {type: 'bool', default: false},
    printOnCloseBar: {type: 'bool', default: false},
    drawerOnCloseBar: {type: 'bool', default: false},
    printOnCloseDay: {type: 'bool', default: false},
    mandatoryCustomerNb: {type: 'bool', default: true},
    bankNoteIcon: {type: 'bool', default: false},
  }
}

const PreferencesSchema16 = {
  name: 'Preferences',
  properties: {
    sit: { type: 'bool', default: true},
    sitCustom: { type: 'bool', default: true},
    takeAway: {type: 'bool', default: true},
    delivery: {type: 'bool', default: true},
    bar: {type: 'bool', default: true},
    booking: {type: 'bool', default: true},
    customer: {type: 'bool', default: true},
    accountingPwd: {type: 'string', default: '0000'},
    accountingEmail: {type: 'string', optional: true},
    creditValidity: {type: 'int', default: 1},
    creditManual: {type: 'bool', default: true},
    deliveryDiscountAmount: {type: 'float', default: 0},
    printOnCloseTable: {type: 'bool', default: false},
    drawerOnCloseTable: {type: 'bool', default: false},
    printOnCloseDay: {type: 'bool', default: false},
    mandatoryCustomerNb: {type: 'bool', default: true},
    fastPayment: {type: 'bool', default: false},
    bankNoteIcon: {type: 'bool', default: false},
  }
}

const ZSchema = {
  name: 'Z',
  primaryKey: 'id',
  properties: {
    id: 'int',
    previousSignature:{type:'string', optional:true},
    signature:'string',
    isFirstSignature: 'string',
    startAt: 'date',
    finishedAt: 'date',
    createdAt: 'date',
    finishedOrder: { type: 'list', objectType:'FinishedOrder' },
    totalTtc: 'float',
    totalTtcPerpetuel: 'float',
    totalTtc1: 'float',
    totalTtc2: 'float',
    totalTtc3: 'float',
    totalHt: 'float',
    totalHt1: 'float',
    totalHt2: 'float',
    totalHt3: 'float',
    totalVat: 'float',
    totalVat1: 'float',
    totalVat2: 'float',
    totalVat3: 'float',
    vatRate1: 'float',
    vatRate2: 'float',
    vatRate3: 'float',
    totalTableTtc: 'float',
    totalDeliveryTtc: 'float',
    totalTakeAwayTtc: 'float',
    totalBarTtc: 'float',
    totalTable: 'int',
    totalDelivery: 'int',
    totalTakeAway: 'int',
    totalBar: 'float',
    totalPerson: 'float',
    totalPayment1: 'float',
    totalPayment2: 'float',
    totalPayment3: 'float',
    totalPayment4: 'float',
    totalPayment5: 'float',
    totalPayment6: 'float',
    totalPayment7: 'float',
    ticketHeaderId: {type:'int'},
    ticketFooterId: {type:'int'},
  }
}

const ZMonthlySchema = {
  name: 'ZMonthly',
  primaryKey: 'id',
  properties: {
    id: 'int',
    startAt: 'date',
    finishedAt: 'date',
    createdAt: 'date',
    totalTtcPerpetuel: 'float',
    totalTtc: 'float',
    totalTtc1: 'float',
    totalTtc2: 'float',
    totalTtc3: 'float',
    totalHt: 'float',
    totalHt1: 'float',
    totalHt2: 'float',
    totalHt3: 'float',
    totalVat: 'float',
    totalVat1: 'float',
    totalVat2: 'float',
    totalVat3: 'float',
    vatRate1: 'float',
    vatRate2: 'float',
    vatRate3: 'float',
    totalTableTtc: 'float',
    totalDeliveryTtc: 'float',
    totalTakeAwayTtc: 'float',
    totalBarTtc: 'float',
    totalTable: 'int',
    totalDelivery: 'int',
    totalTakeAway: 'int',
    totalBar: 'float',
    totalPerson: 'float',
    totalPayment1: 'float',
    totalPayment2: 'float',
    totalPayment3: 'float',
    totalPayment4: 'float',
    totalPayment5: 'float',
    totalPayment6: 'float',
    totalPayment7: 'float',
    ticketHeaderId: {type:'int'},
    ticketFooterId: {type:'int'},
  }
}

const DuplicateSchema = {
  name: 'Duplicate',
  primaryKey: 'id',
  properties: {
    id: 'int',
    type: {type: 'string', default: 'duplicata'},
    nbLine: {type: 'int'},
    finishedOrderId: 'int',
    createdAt: 'date',
    gdh: 'string',
    nbPrinted: { type: 'int', default: 0 },
    userId: 'int',
    ticketHeaderId: {type:'int'},
    ticketFooterId: {type:'int'},
    isFirstSignature: 'string',
    previousSignature: {type:'string', optional:true},
    signature: 'string',
  }
};

const TracerSchema = {
  name: 'Tracer',
  primaryKey:'id',
  properties: {
    id:'int',
    code:  'int',
    name: 'string',
    createdAt: 'date',
    gdh: 'string',
    details: {type: 'string', optional:true},
    deviceId: 'int',
    userId: 'int',
    isFirstSignature: 'string',
    previousSignature: {type:'string', optional:true},
    signature: 'string',
    archived: {type: 'bool', default: false},
  }
};

const GrandTotalTicketSchema = {
  name: 'GrandTotalTicket',
  primaryKey:'id',
  properties: {
    id: 'int',
    ticketId:  'int',
    createdAt: 'date',
    gdh: 'string',
    grandTotal: 'float',
    grandTotalPerpetuel: 'float',
    isFirstSignature: 'string',
    previousSignature:{type:'string', optional:true},
    signature: 'string',
  }
}

const GrandTotalPeriodSchema = {
  name: 'GrandTotalPeriod',
  primaryKey:'id',
  properties: {
    id: 'int',
    zId:  'int',
    createdAt: 'date',
    gdh: 'string',
    grandTotal: 'float',
    grandTotalPerpetuel: 'float',
    isFirstSignature: 'string',
    previousSignature: {type:'string', optional:true},
    signature: 'string',
  }
}

const GrandTotalMonthlySchema = {
  name: 'GrandTotalMonthly',
  primaryKey:'id',
  properties: {
    id: 'int',
    createdAt: 'date',
    gdh: 'string',
    grandTotal: 'float',
    grandTotalPerpetuel: 'float',
    isFirstSignature: 'string',
    previousSignature: {type:'string', optional:true},
    signature: 'string',
  }
}

const ArchiveSchema = {
  name: 'Archive',
  primaryKey: 'id',
  properties: {
    id: 'int',
    zId: 'int',
    createdAt: 'date',
    gdh: 'string',
    grandTotal: 'float',
    typeOperation: {type:'string', default:'archive'},
    deviceId: 'int',
    isFirstSignature:'string',
    previousSignature:{type:'string', optional:true},
    signature:'string',
  }
}


const ConfigSchema = {
  name: 'Config',
  properties: {
    ticketFooterId: 'int',
    ticketHeaderId: 'int',
    appVersion: 'string',
    clientId: 'int',
    deviceId: 'int',
    currentUser: { type: 'User', optional: true},
    nf525CategoryId: 'string',
    nf525CertificateId: 'string'
  }
}

var schemas = [
  { 
    schema: 
    [
      OrderPaymentSchema,
      CartProductSchema,
      StringObjectSchema,
      AddressSchema,
      BookingSchema,
      CategorySchema,
      CustomerSchema,
      UserSchema,
      FinishedOrderSchema,
      TicketHeaderSchema,
      TicketFooterSchema,
      OrderSchema,
      PaymentMethodSchema,
      PrinterSchema,
      ProductSchema,
      TableSchema,
      VatSchema,
      CreditSchema,
      SeparatorSchema,
      CartCustomerSchema,
      PreferencesSchema,
      ZSchema,
      ZMonthlySchema,
      TracerSchema,
      ExpenseReportSchema,
      DuplicateSchema,
      GrandTotalTicketSchema,
      GrandTotalPeriodSchema,
      GrandTotalMonthlySchema,
      ArchiveSchema,
      ConfigSchema,
    ],
    schemaVersion: 1,
    
    // path: realmPath,
    // encryptionKey: key
  },
  { 
    schema: 
    [
      OrderPaymentSchema,
      CartProductSchema11,
      StringObjectSchema,
      AddressSchema11,
      BookingSchema,
      CategorySchema11,
      SubCategorySchema,
      CustomerSchema,
      UserSchema,
      FinishedOrderSchema,
      TicketHeaderSchema,
      TicketFooterSchema,
      OrderSchema11,
      PaymentMethodSchema,
      PrinterSchema,
      ProductSchema11,
      TableSchema,
      VatSchema,
      CreditSchema,
      SeparatorSchema,
      CartCustomerSchema,
      PreferencesSchema,
      ZSchema,
      ZMonthlySchema,
      TracerSchema,
      ExpenseReportSchema,
      DuplicateSchema,
      GrandTotalTicketSchema,
      GrandTotalPeriodSchema,
      GrandTotalMonthlySchema,
      ArchiveSchema,
      ConfigSchema,
    ],
    schemaVersion: 6,
    migration: function(oldRealm, newRealm) {
      if (oldRealm.schemaVersion < 4) {
        var oldObjects = oldRealm.objects('Product');
        var newObjects = newRealm.objects('Product');
        for (var i = 0; i < oldObjects.length; i++) {
          newObjects[i].type = 'product';
        }

        var oldOrder = oldRealm.objects('Order');
        var newOrder = newRealm.objects('Order');
        for (var i = 0; i < oldOrder.length; i++) {
          newOrder[i].archived = true;
        }

        var oldAdd = oldRealm.objects('Address');
        var newAdd = newRealm.objects('Address');
        for (var i = 0; i < oldAdd.length; i++) {
          newAdd[i].streetName = oldAdd[i].street
        }
      }
    },
    // path: realmPath,
    // encryptionKey: key
  },
  { 
    schema: 
    [
      OrderPaymentSchema,
      CartProductSchema15,
      StringObjectSchema,
      AddressSchema11,
      BookingSchema,
      CategorySchema11,
      SubCategorySchema,
      CustomerSchema,
      UserSchema,
      FinishedOrderSchema,
      TicketHeaderSchema,
      TicketFooterSchema,
      OrderSchema11,
      PaymentMethodSchema,
      PrinterSchema,
      ProductSchema11,
      TableSchema,
      VatSchema,
      CreditSchema,
      SeparatorSchema,
      CartCustomerSchema,
      PreferencesSchema15,
      ZSchema,
      ZMonthlySchema,
      TracerSchema,
      ExpenseReportSchema,
      DuplicateSchema,
      GrandTotalTicketSchema,
      GrandTotalPeriodSchema,
      GrandTotalMonthlySchema,
      ArchiveSchema,
      ConfigSchema,
    ],
    schemaVersion: 7,
    migration: function(){},
    // path: realmPath,
    // encryptionKey: key
  },
  { 
    schema: 
    [
      OrderPaymentSchema,
      CartProductSchema15,
      StringObjectSchema,
      AddressSchema11,
      BookingSchema,
      CategorySchema11,
      SubCategorySchema,
      CustomerSchema,
      UserSchema,
      FinishedOrderSchema,
      TicketHeaderSchema,
      TicketFooterSchema,
      OrderSchema11,
      PaymentMethodSchema,
      PrinterSchema,
      ProductSchema11,
      TableSchema,
      VatSchema,
      CreditSchema,
      SeparatorSchema,
      CartCustomerSchema,
      PreferencesSchema16,
      ZSchema,
      ZMonthlySchema,
      TracerSchema,
      ExpenseReportSchema,
      DuplicateSchema,
      GrandTotalTicketSchema,
      GrandTotalPeriodSchema,
      GrandTotalMonthlySchema,
      ArchiveSchema,
      ConfigSchema,
    ],
    schemaVersion: 9,
    migration: function(){},
    // path: realmPath,
    // encryptionKey: key
  },
]

let nextSchemaIndex = Realm.schemaVersion(Realm.defaultPath);
while (nextSchemaIndex < schemas.length) {
  const migratedRealm = new Realm({...schemas[nextSchemaIndex]});
  nextSchemaIndex += 1;
  migratedRealm.close();
}

// let users = Realm.Sync.User.all;
// for(const key in users) {
//   const user = users[key];
//  user.logout();
// }

Realm.Sync.User.login('http://162.243.142.123:9080', '25375@easoft.pro', '1qx/p/dX', (error, user) => {
  console.log("USER: " + user)
});

let user = Realm.Sync.User.current
if (user) {
  
  let synchedRealm = new Realm({
    sync: {
      user: Realm.Sync.User.current,
      url: 'realm://162.243.142.123:9080/~/25375',
    },
    schema: schemas[schemas.length-1].schema,
    schemaVersion: schemas[schemas.length-1].schemaVersion,
  });
  module.exports = synchedRealm;
} else {
  
  var realm = new Realm(schemas[schemas.length-1]);
  module.exports = realm;
}

