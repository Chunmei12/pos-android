module.exports = {
    privateKey: "-----BEGIN RSA PRIVATE KEY-----MIICWwIBAAKBgQDRhGF7X4A0ZVlEg594WmODVVUIiiPQs04aLmvfg8SborHss5gQXu0aIdUT6nb5rTh5hD2yfpF2WIW6M8z0WxRhwicgXwi80H1aLPf6lEPPLvN29EhQNjBpkFkAJUbS8uuhJEeKw0cE49g80eBBF4BCqSL6PFQbP9/rByxdxEoAIQIDAQABAoGAA9/q3Zk6ib2GFRpKDLO/O2KMnAfR+b4XJ6zMGeoZ7Lbpi3MW0Nawk9ckVaX0ZVGqxbSIX5Cvp/yjHHpww+QbUFrw/gCjLiiYjM9E8C3uAF5AKJ0r4GBPl4u8K4bpbXeSxSB60/wPQFiQAJVcA5xhZVzqNuF3EjuKdHsw+dk+dPECQQDubX/lVGFgD/xYuchz56Yc7VHX+58BUkNSewSzwJRbcueqknXRWwj97SXqpnYfKqZq78dnEF10SWsr/NMKi+7XAkEA4PVqDv/OZAbWr4syXZNv/Mpl4r5suzYMMUD9U8B2JIRnrhmGZPzLx23N9J4hEJ+Xh8tSKVc80jOkrvGlSv+BxwJAaTOtjA3YTV+gU7Hdza53sCnSw/8FYLrgc6NOJtYhX9xqdevbyn1lkU0zPr8mPYg/F84m6MXixm2iuSz8HZoyzwJARi2paYZ5/5B2lwroqnKdZBJMGKFpUDn7Mb5hiSgocxnvMkv6NjT66Xsi3iYakJII9q8CMa1qZvT/cigmdbAh7wJAQNXyoizuGEltiSaBXx4H29EdXNYWDJ9SS5f070BRbAIldqRh3rcNvpY6BKJqFapda1DjdcncZECMizT/GMrc1w==-----END RSA PRIVATE KEY-----",
    publicKey: "-----BEGIN CERTIFICATE-----MIIBvTCCASYCCQD55fNzc0WF7TANBgkqhkiG9w0BAQUFADAjMQswCQYDVQQGEwJKUDEUMBIGA1UEChMLMDAtVEVTVC1SU0EwHhcNMTAwNTI4MDIwODUxWhcNMjAwNTI1MDIwODUxWjAjMQswCQYDVQQGEwJKUDEUMBIGA1UEChMLMDAtVEVTVC1SU0EwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBANGEYXtfgDRlWUSDn3haY4NVVQiKI9CzThoua9+DxJuiseyzmBBe7Roh1RPqdvmtOHmEPbJ+kXZYhbozzPRbFGHCJyBfCLzQfVos9/qUQ88u83b0SFA2MGmQWQAlRtLy66EkR4rDRwTj2DzR4EEXgEKpIvo8VBs/3+sHLF3ESgAhAgMBAAEwDQYJKoZIhvcNAQEFBQADgYEAEZ6mXFFq3AzfaqWHmCy1ARjlauYAa8ZmUFnLm0emg9dkVBJ63aEqARhtok6bDQDzSJxiLpCEF6G4b/Nv/M/MLyhP+OoOTmETMegAVQMq71choVJyOFE5BtQa6M/lCHEOya5QUfoRF2HF9EjRF44K3OK+u3ivTSj3zwjtpudY5Xo=-----END CERTIFICATE-----",
    dbUri: "realm://162.243.142.123:9080/~/",
    authUri: "http://162.243.142.123:9080",
    deviceId: 2,
    demo: false,
    demoStart: '2017-07-03',
    color: {
        save: '#81C784',
        cancel: '#E53935',
        topBar: '#37474F',
        footer: '#1976D2',
        background: '#EFEBE9',
        add: '#2196F3',
        remove: 'white',
        black: '#37474F',
        borderColor: '#E0E0E0',
        modify: '#90A4AE',
        darkBlue: '#0D47A1',
        deactivated: '#E0E0E0'
    },
    button: {
        fontSize: 29,
        fontFamily: 'Futura-CondensedMedium',
        height: 100,
    },
    tracer: {
        20: {code:20, description: 'Archivage fiscal de période'}, // ok
        30: {code:30, description: `Archivage fiscal d'exercice`}, // pas a faire
        40: {code:40, description: `Arrêt du terminal`}, // ok
        50: {code:50, description: `Clôture de période`}, //ok
        60: {code:60, description: `Clôture d'exercice`},  // pas a faire
        70: {code:70, description: `Début mode dégradée(hors connection,...)`},  // pas a faire 
        80: {code:80, description: `Démarrage du terminal`}, // ok
        90: {code:90, description: `Détection d'un défault d'intégrité`},  // ok
        100: {code:100, description: `Exécution Fonction spéciale`},  // pas a faire
        110: {code:110, description: `Exportation de données`},  // a faire
        120: {code:120, description: `Fin mode dégradée`},  // pas a faire
        130: {code:130, description: `Habilitation d'utilisation`}, 
        140: {code:140, description: `Importation de donnée`},  // pas a faire
        150: {code:150, description: `Imprimante indisponible`}, // ok
        160: {code:160, description: `La génération des écritures comptables`},  // pas a faire (format pour le comptable)
        170: {code:170, description: `Le transfer de fond de caisse`},  // pas a faire
        180: {code:180, description: `Le transfer en comptabilité`},  // pas a faire
        190: {code:190, description: `Annulation comptable de ticket`}, // ok
        200: {code:200, description: `Purge`},  // a voir
        210: {code:210, description: `Reprise de données d'autres logiciels`},  // pas a faire
        220: {code:220, description: `Restauration`}, // a faire
        230: {code:230, description: `Sauvegarde`}, // a faire
        240: {code:240, description: `Suivi des interventions de maintenance`}, // a faire changement tva, changement header
        250: {code:250, description: `Version du logiciel`}, // ok
        260: {code:260, description: `Initialisation des données`}, // ok
        310: {code:310, description: `Suppressions de production de pièces justificatives optionnelles`},
        999: {code:999, description: `Fonction éditeurs`},  // pas a faire
    },

    
};

// base64url.js add var Buffer = require('buffer/').Buffer;
// pad-stirng.js add var Buffer = require('buffer/').Buffer;

// Dialog.js

//   <View style={{flex: 10}}>
//     {this.props.children}
//   </View>
//   <View style={{flexDirection: 'row', flex: 1}}>
//     {this.props.actions}
//   </View>

//   dialog: {
//     backgroundColor: '#ffffff',
//   },