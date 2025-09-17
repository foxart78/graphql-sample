const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const { gql } = require("apollo-server-express");
const fs = require('fs');
const path = require('path');

// Dati di esempio
const users = [
  { id: "1", name: "Mario Rossi", email: "mario@email.com", age: 30 },
  { id: "2", name: "Giulia Bianchi", email: "giulia@email.com", age: 25 },
  { id: "3", name: "Luca Verdi", email: "luca@email.com", age: 35 },
];

const products = [
  { id: "1", name: "Laptop", price: 999.99, category: "Electronics" },
  { id: "2", name: "Smartphone", price: 599.99, category: "Electronics" },
  { id: "3", name: "Libro", price: 19.99, category: "Books" },
];

// Dati mock per la disponibilità alloggi - versione semplificata
const accommodationRates = [
  {
    id: "6425f9a8abdf9d6d0551700e",
    currency: "EUR",
    type: "DERIVED",
    name: [
      {
        language: "it",
        value: "Natale"
      }
    ],
    description: [
      {
        language: "it",
        value: "Offerta speciale per il periodo natalizio"
      }
    ],
    visibilityOnIbe: true,
    visibilityOnRateQuery: true,
    visibilityOnPriceCalendar: true,
    agreementRate: false,
    parentRateId: "638e2d07e9779128dfb2ef3c",
    derivedRules: [
      {
        operation: "SUM",
        value: 0
      }
    ],
    minStay: null,
    maxStay: null,
    minAdvance: null,
    maxAdvance: null,
    closeToArrival: null,
    closeToDeparture: null,
    chargeCategoryId: "64022241013a95f4e8285ebd",
    resourcesRate: null,
    parentRate: {
      resourcesRate: [
        {
          resourceTypeId: "63ea53be266ffb561c6aeee7",
          priceType: "ROOM",
          price: 30000,
          rulesForDifferentOccupation: [
            {
              occupancy: 1,
              variation: "SUM",
              type: "VALUE",
              value: 4000
            },
            {
              occupancy: 2,
              variation: "SUM",
              type: "VALUE",
              value: 3000
            }
          ],
          priceForDifferentOccupation: null
        }
      ]
    },
    chargesRate: [
      {
        chargeCategoryId: "64022241013a95f4e8285ebd",
        priceModel: "DERIVED",
        operation: "SUM",
        price: 0,
        priceForDifferentOccupation: null,
        resourceTypeId: null,
        chargeCategory: {
          id: "64022241013a95f4e8285ebd",
          name: "Mezza pensione",
          code: "HB"
        }
      }
    ],
    resourcesTypeEnabledId: [
      "638e2d07e9779128dfb2ef29",
      "63c7a1d2d823a9127229ac0a",
      "63ea53be266ffb561c6aeee7",
      "63eab7d5266ffb561c6af3c7"
    ],
    resourcesTypeEnabled: [
      {
        id: "638e2d07e9779128dfb2ef29",
        persons: 2
      },
      {
        id: "63c7a1d2d823a9127229ac0a",
        persons: 4
      },
      {
        id: "63ea53be266ffb561c6aeee7",
        persons: 2
      },
      {
        id: "63eab7d5266ffb561c6af3c7",
        persons: 2
      }
    ],
    childRule: {
      rule: "INHERITANCE",
      fixedPrice: null,
      childPrice: [
        {
          childId: "63b286abc3d3e1414ddfb339",
          child: {
            id: "63b286abc3d3e1414ddfb339",
            taxonomyId: "629f561370a4dd3a66e25d0f",
            taxonomy: {
              description: [
                {
                  language: "it",
                  value: "Infante"
                },
                {
                  language: "en",
                  value: "Infant"
                }
              ]
            },
            minAge: 0,
            maxAge: 1,
            noOccupancy: true,
            auditable: {
              state: "ACTIVE"
            }
          },
          percentageDiscount: 1,
          price: null
        },
        {
          childId: "63b286abc3d3e1414ddfb33b",
          child: {
            id: "63b286abc3d3e1414ddfb33b",
            taxonomyId: "62c842821770b9a68d73edd6",
            taxonomy: {
              description: [
                {
                  language: "it",
                  value: "Bambino"
                },
                {
                  language: "en",
                  value: "Child"
                }
              ]
            },
            minAge: 2,
            maxAge: 10,
            noOccupancy: false,
            auditable: {
              state: "ACTIVE"
            }
          },
          percentageDiscount: 0.3,
          price: null
        }
      ]
    },
    bookingPolicyId: "6425f921abdf9d6d05517009",
    ibeCode: null,
    order: 7,
    tenantId: "638e2bb7e9779128dfb2eecd",
    propertyId: "638e2d05e9779128dfb2eef5",
    restrictionFromParent: false,
    crossSell: "NOCROSS",
    affiliatedCompaniesId: null,
    chargeCategory: {
      name: "Mezza pensione",
      code: "HB"
    },
    bookingPolicy: {
      id: "6425f921abdf9d6d05517009",
      tenantId: "638e2bb7e9779128dfb2eecd",
      propertyId: "638e2d05e9779128dfb2eef5",
      name: "Carta a garanzia",
      noShowRule: {
        type: "FIRSTNIGHT",
        percentage: null
      },
      paymentRule: {
        guaranteedCreditCard: true,
        installments: null,
        paymentsAcceptedId: null,
        percentage: null,
        type: "NOTREQUIRED"
      },
      cancellationPolicy: {
        daysWithoutPenalties: null,
        hourWithoutPenalties: null,
        penaltyType: "FIRSTNIGHT",
        percentage: null,
        type: "NOTREF"
      }
    },
    mandatoryAdditionalServices: [],
    priceRanges: null,
    intPrices: null,
    frequency: null
  },
  {
    id: "64d209f993700c0e5c264643",
    currency: "EUR",
    type: "DERIVED",
    name: [
      {
        language: "it",
        value: "Culturale"
      }
    ],
    description: [
      {
        language: "it",
        value: "Camera + visita guidata"
      }
    ],
    visibilityOnIbe: true,
    visibilityOnRateQuery: true,
    visibilityOnPriceCalendar: false,
    agreementRate: false,
    parentRateId: "638e2d07e9779128dfb2ef3c",
    derivedRules: [
      {
        operation: "SUM",
        value: 5
      }
    ],
    minStay: null,
    maxStay: null,
    minAdvance: null,
    maxAdvance: null,
    closeToArrival: null,
    closeToDeparture: null,
    chargeCategoryId: "64022241013a95f4e8285ebd",
    resourcesRate: null,
    parentRate: {
      resourcesRate: [
        {
          resourceTypeId: "63ea53be266ffb561c6aeee7",
          priceType: "ROOM",
          price: 25000,
          rulesForDifferentOccupation: [
            {
              occupancy: 1,
              variation: "SUM",
              type: "VALUE",
              value: 3000
            },
            {
              occupancy: 2,
              variation: "SUM",
              type: "VALUE",
              value: 2000
            }
          ],
          priceForDifferentOccupation: null
        }
      ]
    },
    chargesRate: [
      {
        chargeCategoryId: "64022241013a95f4e8285ebd",
        priceModel: "DERIVED",
        operation: "SUM",
        price: 0,
        priceForDifferentOccupation: null,
        resourceTypeId: null,
        chargeCategory: {
          id: "64022241013a95f4e8285ebd",
          name: "Mezza pensione",
          code: "HB"
        }
      }
    ],
    resourcesTypeEnabledId: [
      "63c7a1d2d823a9127229ac0a",
      "63eab7d5266ffb561c6af3c7"
    ],
    resourcesTypeEnabled: [
      {
        id: "63c7a1d2d823a9127229ac0a",
        persons: 4
      },
      {
        id: "63eab7d5266ffb561c6af3c7",
        persons: 2
      }
    ],
    childRule: {
      rule: "INHERITANCE",
      fixedPrice: null,
      childPrice: [
        {
          childId: "63b286abc3d3e1414ddfb339",
          child: {
            id: "63b286abc3d3e1414ddfb339",
            taxonomyId: "629f561370a4dd3a66e25d0f",
            taxonomy: {
              description: [
                {
                  language: "it",
                  value: "Infante"
                }
              ]
            },
            minAge: 0,
            maxAge: 1,
            noOccupancy: true,
            auditable: {
              state: "ACTIVE"
            }
          },
          percentageDiscount: 1,
          price: null
        }
      ]
    },
    bookingPolicyId: "638e2d07e9779128dfb2ef25",
    ibeCode: null,
    order: 13,
    tenantId: "638e2bb7e9779128dfb2eecd",
    propertyId: "638e2d05e9779128dfb2eef5",
    restrictionFromParent: false,
    crossSell: "NOCROSS",
    affiliatedCompaniesId: null,
    chargeCategory: {
      name: "Mezza pensione",
      code: "HB"
    },
    bookingPolicy: {
      id: "638e2d07e9779128dfb2ef25",
      tenantId: "638e2bb7e9779128dfb2eecd",
      propertyId: "638e2d05e9779128dfb2eef5",
      name: "Rimborsabile",
      noShowRule: {
        type: "FIRSTNIGHT",
        percentage: null
      },
      paymentRule: {
        guaranteedCreditCard: false,
        installments: null,
        paymentsAcceptedId: [
          "63ebc7149ba1f9f9c9543a65"
        ],
        percentage: null,
        type: "FIRSTNIGHT"
      },
      cancellationPolicy: {
        daysWithoutPenalties: null,
        hourWithoutPenalties: null,
        penaltyType: null,
        percentage: null,
        type: "ALWAYSFREE"
      }
    },
    mandatoryAdditionalServices: [
      {
        additionalService: {
          id: "64d2097193700c0e5c264641",
          name: [
            {
              language: "it",
              value: "Tour con visita guidata (1h)"
            }
          ]
        },
        priceZero: true
      }
    ],
    priceRanges: null,
    intPrices: null,
    frequency: null
  },
  {
    id: "64a2c3e7114e354480143f46",
    currency: "EUR",
    type: "DERIVED",
    name: [
      {
        language: "it",
        value: "Speciale Estate"
      }
    ],
    description: [
      {
        language: "it",
        value: "Offerta speciale per il periodo estivo"
      }
    ],
    visibilityOnIbe: true,
    visibilityOnRateQuery: true,
    visibilityOnPriceCalendar: true,
    agreementRate: false,
    parentRateId: "638e2d07e9779128dfb2ef3c",
    derivedRules: [
      {
        operation: "DECREASE",
        value: 15
      }
    ],
    minStay: null,
    maxStay: null,
    minAdvance: null,
    maxAdvance: null,
    closeToArrival: null,
    closeToDeparture: null,
    chargeCategoryId: "64a2c32d114e354480143f44",
    resourcesRate: null,
    parentRate: {
      resourcesRate: [
        {
          resourceTypeId: "63ea53be266ffb561c6aeee7",
          priceType: "ROOM",
          price: 20000,
          rulesForDifferentOccupation: [
            {
              occupancy: 1,
              variation: "SUM",
              type: "VALUE",
              value: 2500
            },
            {
              occupancy: 2,
              variation: "SUM",
              type: "VALUE",
              value: 1500
            }
          ],
          priceForDifferentOccupation: null
        }
      ]
    },
    chargesRate: [
      {
        chargeCategoryId: "64a2c32d114e354480143f44",
        priceModel: "DERIVED",
        operation: "SUM",
        price: 0,
        priceForDifferentOccupation: null,
        resourceTypeId: null,
        chargeCategory: {
          id: "64a2c32d114e354480143f44",
          name: "Colazione Europea Continental",
          code: "BB"
        }
      }
    ],
    resourcesTypeEnabledId: [
      "638e2d07e9779128dfb2ef29",
      "63ea53be266ffb561c6aeee7",
      "63c7a1d2d823a9127229ac0a",
      "63eab7d5266ffb561c6af3c7"
    ],
    resourcesTypeEnabled: [
      {
        id: "638e2d07e9779128dfb2ef29",
        persons: 2
      },
      {
        id: "63ea53be266ffb561c6aeee7",
        persons: 2
      },
      {
        id: "63c7a1d2d823a9127229ac0a",
        persons: 4
      },
      {
        id: "63eab7d5266ffb561c6af3c7",
        persons: 2
      }
    ],
    childRule: {
      rule: "INHERITANCE",
      fixedPrice: null,
      childPrice: [
        {
          childId: "63b286abc3d3e1414ddfb339",
          child: {
            id: "63b286abc3d3e1414ddfb339",
            taxonomyId: "629f561370a4dd3a66e25d0f",
            taxonomy: {
              description: [
                {
                  language: "it",
                  value: "Infante"
                }
              ]
            },
            minAge: 0,
            maxAge: 1,
            noOccupancy: true,
            auditable: {
              state: "ACTIVE"
            }
          },
          percentageDiscount: 1,
          price: null
        },
        {
          childId: "63b286abc3d3e1414ddfb33b",
          child: {
            id: "63b286abc3d3e1414ddfb33b",
            taxonomyId: "62c842821770b9a68d73edd6",
            taxonomy: {
              description: [
                {
                  language: "it",
                  value: "Bambino"
                }
              ]
            },
            minAge: 2,
            maxAge: 10,
            noOccupancy: false,
            auditable: {
              state: "ACTIVE"
            }
          },
          percentageDiscount: 0.3,
          price: null
        }
      ]
    },
    bookingPolicyId: "63ea73f4266ffb561c6af0f0",
    ibeCode: null,
    order: 5,
    tenantId: "638e2bb7e9779128dfb2eecd",
    propertyId: "638e2d05e9779128dfb2eef5",
    restrictionFromParent: false,
    crossSell: "NOCROSS",
    affiliatedCompaniesId: null,
    chargeCategory: {
      name: "Colazione Europea Continental",
      code: "BB"
    },
    bookingPolicy: {
      id: "63ea73f4266ffb561c6af0f0",
      tenantId: "638e2bb7e9779128dfb2eecd",
      propertyId: "638e2d05e9779128dfb2eef5",
      name: "Non rimborsabile",
      noShowRule: {
        type: "TOTAL",
        percentage: null
      },
      paymentRule: {
        guaranteedCreditCard: false,
        installments: null,
        paymentsAcceptedId: null,
        percentage: null,
        type: "NOTREQUIRED"
      },
      cancellationPolicy: {
        daysWithoutPenalties: null,
        hourWithoutPenalties: null,
        penaltyType: "TOTAL",
        percentage: null,
        type: "NOTREF"
      }
    },
    mandatoryAdditionalServices: [],
    priceRanges: null,
    intPrices: null,
    frequency: null
  }
];

// Schema GraphQL
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    category: String!
  }

  # Tipi per la ricerca disponibilità alloggi
  input AccommodationSearchInput {
    checkIn: String!
    checkOut: String!
    adults: Int!
    children: Int
    rooms: Int
  }

  type LocalizedText {
    language: String!
    value: String!
  }

  type Taxonomy {
    description: [LocalizedText!]!
  }

  type Child {
    id: ID!
    taxonomyId: String!
    taxonomy: Taxonomy!
    minAge: Int!
    maxAge: Int!
    noOccupancy: Boolean!
    auditable: Auditable!
  }

  type Auditable {
    state: String!
  }

  type ChildPrice {
    childId: String!
    child: Child!
    percentageDiscount: Float
    price: Int
  }

  type ChildRule {
    rule: String!
    fixedPrice: Boolean
    childPrice: [ChildPrice!]!
  }

  type NoShowRule {
    type: String!
    percentage: Float
  }

  type PaymentRule {
    guaranteedCreditCard: Boolean!
    installments: [String]
    paymentsAcceptedId: [String]
    percentage: Float
    type: String!
  }

  type CancellationPolicy {
    daysWithoutPenalties: Int
    hourWithoutPenalties: Int
    penaltyType: String
    percentage: Float
    type: String!
  }

  type BookingPolicy {
    id: ID!
    tenantId: String!
    propertyId: String!
    name: String!
    noShowRule: NoShowRule!
    paymentRule: PaymentRule!
    cancellationPolicy: CancellationPolicy!
  }

  type ChargeCategory {
    id: ID!
    name: String!
    code: String!
  }

  type ChargeRate {
    chargeCategoryId: String!
    priceModel: String!
    operation: String!
    price: Int!
    priceForDifferentOccupation: [PriceOccupation]
    resourceTypeId: String
    chargeCategory: ChargeCategory!
  }

  type PriceOccupation {
    occupation: Int!
    price: Int!
  }

  type RuleOccupation {
    occupancy: Int!
    variation: String!
    type: String!
    value: Int!
  }

  type ResourceRate {
    resourceTypeId: String!
    priceType: String!
    price: Int!
    rulesForDifferentOccupation: [RuleOccupation!]!
    priceForDifferentOccupation: [PriceOccupation]
  }

  type ResourceType {
    id: ID!
    persons: Int!
  }

  type DerivationRules {
    operation: String!
    value: Float!
  }

  type AdditionalService {
    id: ID!
    name: [LocalizedText!]!
  }

  type RateMandatoryAdditionalService {
    additionalService: AdditionalService!
    priceZero: Boolean!
  }

  type Rate {
    id: ID!
    currency: String!
    type: String!
    name: [LocalizedText!]!
    description: [LocalizedText!]!
    visibilityOnIbe: Boolean!
    visibilityOnRateQuery: Boolean!
    visibilityOnPriceCalendar: Boolean!
    agreementRate: Boolean!
    parentRateId: String
    derivedRules: [DerivationRules]
    minStay: Int
    maxStay: Int
    minAdvance: Int
    maxAdvance: Int
    closeToArrival: String
    closeToDeparture: String
    chargeCategoryId: String!
    resourcesRate: [ResourceRate]
    parentRate: Rate
    chargesRate: [ChargeRate!]!
    resourcesTypeEnabledId: [String!]!
    resourcesTypeEnabled: [ResourceType!]!
    childRule: ChildRule!
    bookingPolicyId: String!
    ibeCode: String
    order: Int!
    tenantId: String!
    propertyId: String!
    restrictionFromParent: Boolean!
    crossSell: String!
    affiliatedCompaniesId: [String]
    chargeCategory: ChargeCategory!
    bookingPolicy: BookingPolicy!
    mandatoryAdditionalServices: [RateMandatoryAdditionalService!]!
    priceRanges: String
    intPrices: String
    frequency: String
  }

  type AccommodationAvailabilityResponse {
    rates: [Rate!]!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    products: [Product!]!
    product(id: ID!): Product
    hello: String!
    rates(input: AccommodationSearchInput!): AccommodationAvailabilityResponse!
  }

  type Mutation {
    addUser(name: String!, email: String!, age: Int!): User!
    addProduct(name: String!, price: Float!, category: String!): Product!
  }
`;

// Resolver
const resolvers = {
  Query: {
    hello: () => "Ciao! Questo è il mio endpoint GraphQL!",
    users: () => users,
    user: (_, { id }) => users.find((user) => user.id === id),
    products: () => products,
    product: (_, { id }) => products.find((product) => product.id === id),
    rates: (_, { input }) => {
      // Simula una ricerca di disponibilità basata sui parametri di input
      console.log(`[ACCOMMODATION_SEARCH] Searching for availability:`, {
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        adults: input.adults,
        children: input.children || 0,
        rooms: input.rooms || 1
      });

      // Funzioni helper per generare dati casuali
      const generateRandomId = () => Math.random().toString(36).substr(2, 24);
      
      const rateTypes = ["DERIVED", "BASE", "SPECIAL"];
      const operations = ["SUM", "DECREASE", "MULTIPLY"];
      const priceTypes = ["ROOM", "PERSON"];
      const variations = ["SUM", "MULTIPLY"];
      const valueTypes = ["VALUE", "PERCENTAGE"];
      const currencies = ["EUR", "USD", "GBP"];
      const crossSellTypes = ["NOCROSS", "UPSELL", "CROSSSELL"];
      
      const rateNames = [
        "Offerta Speciale", "Tariffa Standard", "Weekend Romantico", 
        "Soggiorno Benessere", "Pacchetto Famiglia", "Business Rate",
        "Last Minute", "Prenotazione Anticipata", "Tariffa Flessibile",
        "Offerta Estate", "Inverno Caldo", "Primavera Fresca"
      ];

      const rateDescriptions = [
        "Perfetta per una fuga romantica", "Ideale per famiglie con bambini",
        "Include colazione e accesso spa", "Tariffa conveniente per soggiorni lunghi",
        "Pacchetto completo con servizi premium", "Flessibilità di cancellazione",
        "Offerta limitata nel tempo", "Prenota in anticipo e risparmia"
      ];

      const chargeCategoryNames = [
        "Colazione Europea Continental", "Mezza pensione", "Pensione completa",
        "Solo camera", "Spa & Wellness", "Cena di gala"
      ];

      const chargeCategoryCodes = ["BB", "HB", "FB", "RO", "SPA", "DIN"];

      const bookingPolicyNames = [
        "Non rimborsabile", "Rimborsabile", "Carta a garanzia", 
        "Flessibile", "Standard", "Premium"
      ];

      const noShowTypes = ["FIRSTNIGHT", "TOTAL", "PERCENTAGE"];
      const paymentTypes = ["NOTREQUIRED", "FIRSTNIGHT", "TOTAL", "ARRIVAL"];
      const cancellationTypes = ["NOTREF", "ALWAYSFREE", "FLEXIBLE", "STANDARD"];
      const penaltyTypes = ["FIRSTNIGHT", "TOTAL", "PERCENTAGE"];

      const additionalServiceNames = [
        "Tour con visita guidata (1h)", "Massaggio rilassante", "Cena romantica",
        "Transfer aeroporto", "Noleggio biciclette", "Escursione guidata"
      ];

      // Genera un numero casuale di tariffe (3-8)
      const numRates = Math.floor(Math.random() * 6) + 3;
      const generatedRates = [];

      for (let i = 0; i < numRates; i++) {
        const isHighSeason = new Date(input.checkIn).getMonth() >= 5 && new Date(input.checkIn).getMonth() <= 8;
        const basePrice = isHighSeason ? 
          Math.floor(Math.random() * 20000) + 15000 : // 150-350 EUR in alta stagione
          Math.floor(Math.random() * 15000) + 10000;  // 100-250 EUR in bassa stagione

        const rateName = rateNames[Math.floor(Math.random() * rateNames.length)];
        const rateDescription = rateDescriptions[Math.floor(Math.random() * rateDescriptions.length)];
        const chargeCategoryIndex = Math.floor(Math.random() * chargeCategoryNames.length);

        // Genera il numero di bambini supportati (0-2)
        const numChildTypes = Math.floor(Math.random() * 3);
        const childPrices = [];
        
        if (numChildTypes > 0) {
          // Infante (0-1 anni)
          childPrices.push({
            childId: generateRandomId(),
            child: {
              id: generateRandomId(),
              taxonomyId: generateRandomId(),
              taxonomy: {
                description: [
                  { language: "it", value: "Infante" },
                  { language: "en", value: "Infant" }
                ]
              },
              minAge: 0,
              maxAge: 1,
              noOccupancy: true,
              auditable: { state: "ACTIVE" }
            },
            percentageDiscount: 1,
            price: null
          });
        }

        if (numChildTypes > 1) {
          // Bambino (2-10 anni)
          childPrices.push({
            childId: generateRandomId(),
            child: {
              id: generateRandomId(),
              taxonomyId: generateRandomId(),
              taxonomy: {
                description: [
                  { language: "it", value: "Bambino" },
                  { language: "en", value: "Child" }
                ]
              },
              minAge: 2,
              maxAge: 10,
              noOccupancy: false,
              auditable: { state: "ACTIVE" }
            },
            percentageDiscount: Math.random() * 0.5 + 0.2, // 20-70% sconto
            price: null
          });
        }

        // Genera risorse disponibili
        const numResources = Math.floor(Math.random() * 3) + 2; // 2-4 risorse
        const resourcesEnabled = [];
        for (let j = 0; j < numResources; j++) {
          resourcesEnabled.push({
            id: generateRandomId(),
            persons: Math.floor(Math.random() * 3) + 2 // 2-4 persone
          });
        }

        // Genera servizi aggiuntivi (0-3)
        const numServices = Math.floor(Math.random() * 4);
        const mandatoryServices = [];
        for (let k = 0; k < numServices; k++) {
          mandatoryServices.push({
            additionalService: {
              id: generateRandomId(),
              name: [
                {
                  language: "it",
                  value: additionalServiceNames[Math.floor(Math.random() * additionalServiceNames.length)]
                }
              ]
            },
            priceZero: Math.random() > 0.5
          });
        }

        const rate = {
          id: generateRandomId(),
          currency: currencies[Math.floor(Math.random() * currencies.length)],
          type: rateTypes[Math.floor(Math.random() * rateTypes.length)],
          name: [{ language: "it", value: rateName }],
          description: [{ language: "it", value: rateDescription }],
          visibilityOnIbe: Math.random() > 0.2,
          visibilityOnRateQuery: Math.random() > 0.1,
          visibilityOnPriceCalendar: Math.random() > 0.3,
          agreementRate: Math.random() > 0.8,
          parentRateId: Math.random() > 0.5 ? generateRandomId() : null,
          derivedRules: Math.random() > 0.3 ? [{
            operation: operations[Math.floor(Math.random() * operations.length)],
            value: Math.floor(Math.random() * 20)
          }] : [],
          minStay: Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : null,
          maxStay: Math.random() > 0.8 ? Math.floor(Math.random() * 10) + 5 : null,
          minAdvance: Math.random() > 0.6 ? Math.floor(Math.random() * 30) : null,
          maxAdvance: Math.random() > 0.9 ? Math.floor(Math.random() * 180) + 30 : null,
          closeToArrival: null,
          closeToDeparture: null,
          chargeCategoryId: generateRandomId(),
          resourcesRate: null,
          parentRate: {
            resourcesRate: [{
              resourceTypeId: generateRandomId(),
              priceType: priceTypes[Math.floor(Math.random() * priceTypes.length)],
              price: basePrice,
              rulesForDifferentOccupation: [
                {
                  occupancy: 1,
                  variation: variations[Math.floor(Math.random() * variations.length)],
                  type: valueTypes[Math.floor(Math.random() * valueTypes.length)],
                  value: Math.floor(Math.random() * 5000) + 1000
                },
                {
                  occupancy: 2,
                  variation: variations[Math.floor(Math.random() * variations.length)],
                  type: valueTypes[Math.floor(Math.random() * valueTypes.length)],
                  value: Math.floor(Math.random() * 3000) + 500
                }
              ],
              priceForDifferentOccupation: null
            }]
          },
          chargesRate: [{
            chargeCategoryId: generateRandomId(),
            priceModel: "DERIVED",
            operation: operations[Math.floor(Math.random() * operations.length)],
            price: Math.floor(Math.random() * 2000),
            priceForDifferentOccupation: null,
            resourceTypeId: null,
            chargeCategory: {
              id: generateRandomId(),
              name: chargeCategoryNames[chargeCategoryIndex],
              code: chargeCategoryCodes[chargeCategoryIndex]
            }
          }],
          resourcesTypeEnabledId: resourcesEnabled.map(r => r.id),
          resourcesTypeEnabled: resourcesEnabled,
          childRule: {
            rule: "INHERITANCE",
            fixedPrice: null,
            childPrice: childPrices
          },
          bookingPolicyId: generateRandomId(),
          ibeCode: null,
          order: i + 1,
          tenantId: generateRandomId(),
          propertyId: generateRandomId(),
          restrictionFromParent: Math.random() > 0.7,
          crossSell: crossSellTypes[Math.floor(Math.random() * crossSellTypes.length)],
          affiliatedCompaniesId: null,
          chargeCategory: {
            name: chargeCategoryNames[chargeCategoryIndex],
            code: chargeCategoryCodes[chargeCategoryIndex]
          },
          bookingPolicy: {
            id: generateRandomId(),
            tenantId: generateRandomId(),
            propertyId: generateRandomId(),
            name: bookingPolicyNames[Math.floor(Math.random() * bookingPolicyNames.length)],
            noShowRule: {
              type: noShowTypes[Math.floor(Math.random() * noShowTypes.length)],
              percentage: Math.random() > 0.7 ? Math.floor(Math.random() * 100) : null
            },
            paymentRule: {
              guaranteedCreditCard: Math.random() > 0.5,
              installments: null,
              paymentsAcceptedId: Math.random() > 0.7 ? [generateRandomId()] : null,
              percentage: Math.random() > 0.8 ? Math.floor(Math.random() * 100) : null,
              type: paymentTypes[Math.floor(Math.random() * paymentTypes.length)]
            },
            cancellationPolicy: {
              daysWithoutPenalties: Math.random() > 0.6 ? Math.floor(Math.random() * 7) : null,
              hourWithoutPenalties: Math.random() > 0.8 ? Math.floor(Math.random() * 24) : null,
              penaltyType: Math.random() > 0.3 ? penaltyTypes[Math.floor(Math.random() * penaltyTypes.length)] : null,
              percentage: Math.random() > 0.7 ? Math.floor(Math.random() * 100) : null,
              type: cancellationTypes[Math.floor(Math.random() * cancellationTypes.length)]
            }
          },
          mandatoryAdditionalServices: mandatoryServices,
          priceRanges: null,
          intPrices: null,
          frequency: null
        };

        // Filtra in base alla capacità richiesta
        const canAccommodate = rate.resourcesTypeEnabled.some(resource => 
          resource.persons >= input.adults
        );
        
        if (canAccommodate) {
          generatedRates.push(rate);
        }
      }

      // Ordina per prezzo (dalle più economiche alle più care)
      generatedRates.sort((a, b) => {
        const priceA = a.parentRate?.resourcesRate?.[0]?.price || 0;
        const priceB = b.parentRate?.resourcesRate?.[0]?.price || 0;
        return priceA - priceB;
      });

      console.log(`[ACCOMMODATION_SEARCH] Generated ${generatedRates.length} random rates`);

      return {
        rates: generatedRates
      };
    }
  },
  Mutation: {
    addUser: (_, { name, email, age }) => {
      const newUser = {
        id: String(users.length + 1),
        name,
        email,
        age,
      };
      users.push(newUser);
      return newUser;
    },
    addProduct: (_, { name, price, category }) => {
      const newProduct = {
        id: String(products.length + 1),
        name,
        price,
        category,
      };
      products.push(newProduct);
      return newProduct;
    },
  },
};

async function startServer(options = {}) {
  const { port = process.env.PORT || 4000, listen = true } = options;
  const app = express();
  
  // Middleware di log dettagliato per tutte le chiamate (se DEBUG_DETAILED_REQUESTS=true)
  app.use((req, res, next) => {
    if (process.env.DEBUG_DETAILED_REQUESTS === 'true') {
      const start = Date.now();
      const clientIP = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown';
      const userAgent = req.get('User-Agent') || 'unknown';
      
      console.log(`[DETAILED_REQUEST] ${req.method} ${req.originalUrl || req.url}`);
      console.log(`  - IP: ${clientIP}`);
      console.log(`  - User-Agent: ${userAgent}`);
      console.log(`  - Headers:`, JSON.stringify(req.headers, null, 2));
      if (req.body && Object.keys(req.body).length > 0) {
        console.log(`  - Body:`, JSON.stringify(req.body, null, 2));
      }
      
      // Log della risposta
      const originalSend = res.send;
      res.send = function(data) {
        const duration = Date.now() - start;
        console.log(`[DETAILED_RESPONSE] ${req.method} ${req.originalUrl || req.url} - ${res.statusCode} (${duration}ms)`);
        if (data && typeof data === 'string' && data.length < 1000) {
          console.log(`  - Response Body:`, data);
        } else if (data) {
          console.log(`  - Response Body: [${typeof data}, ${data.length || 'unknown'} chars/bytes]`);
        }
        return originalSend.call(this, data);
      };
    }
    next();
  });

  // Middleware di debug per loggare alcuni header di autenticazione (solo se DEBUG_LOG_AUTH_HEADERS=true)
  app.use((req, res, next) => {
    if (process.env.DEBUG_LOG_AUTH_HEADERS === 'true') {
      const interestingHeaders = [
        'authorization',
        'authentication',
        'x-api-key',
        'x-auth-token',
        'proxy-authorization'
      ];
      const collected = {};
      for (const h of interestingHeaders) {
        if (req.headers[h]) {
          const raw = Array.isArray(req.headers[h]) ? req.headers[h].join(',') : req.headers[h];
          const masked = typeof raw === 'string' && raw.length > 16
            ? raw.slice(0, 8) + '...' + raw.slice(-4)
            : raw;
          collected[h] = masked;
        }
      }
      const hasAuth = Object.keys(collected).length > 0;
      const lineObj = { ts: new Date().toISOString(), path: req.path, headers: collected, hasAuthHeaders: hasAuth };
      const line = JSON.stringify(lineObj);
      if (hasAuth) {
        console.log('[DEBUG][AUTH_HEADERS]', collected);
      } else {
        console.log('[DEBUG][AUTH_HEADERS][NONE]');
      }
      if (process.env.AUTH_HEADERS_LOG_FILE) {
        try {
          const logPath = path.resolve(process.env.AUTH_HEADERS_LOG_FILE);
          fs.appendFile(logPath, line + '\n', err => {
            if (err) console.error('[AUTH_HEADERS_LOG_FILE][ERROR]', err.message);
          });
        } catch (e) {
          console.error('[AUTH_HEADERS_LOG_FILE][EXCEPTION]', e.message);
        }
      }
    }
    next();
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true, // Abilita l'introspection in produzione
    playground: true, // Abilita GraphQL Playground in produzione
  });

  await server.start();
  server.applyMiddleware({ app });

  return new Promise((resolve, reject) => {
    if (!listen) {
      return resolve({ app, apollo: server, httpServer: null, port: null });
    }
    const httpServer = app.listen(port, () => {
      const actualPort = httpServer.address().port;
      console.log(
        `🚀 Server pronto su http://localhost:${actualPort}${server.graphqlPath}`
      );
      resolve({ app, apollo: server, httpServer, port: actualPort });
    });
    httpServer.on('error', reject);
  });
}
// Avvio automatico solo se eseguito direttamente da CLI
if (require.main === module) {
  startServer().catch((error) => {
    console.error("Errore nell'avvio del server:", error);
  });
}

module.exports = { startServer, typeDefs, resolvers };
