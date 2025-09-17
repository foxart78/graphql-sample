const fetch = require('node-fetch');

// URL del server GraphQL
const GRAPHQL_URL = 'http://localhost:4000/graphql';

// Query GraphQL per la ricerca di disponibilità alloggi
const SEARCH_ACCOMMODATION_QUERY = `
  query SearchAccommodationAvailability($input: AccommodationSearchInput!) {
    searchAccommodationAvailability(input: $input) {
      rates {
        id
        currency
        type
        name {
          language
          value
        }
        description {
          language
          value
        }
        visibilityOnIbe
        visibilityOnRateQuery
        visibilityOnPriceCalendar
        agreementRate
        parentRateId
        derivedRules {
          operation
          value
        }
        minStay
        maxStay
        minAdvance
        maxAdvance
        chargeCategoryId
        parentRate {
          resourcesRate {
            resourceTypeId
            priceType
            price
            rulesForDifferentOccupation {
              occupancy
              variation
              type
              value
            }
          }
        }
        chargesRate {
          chargeCategoryId
          priceModel
          operation
          price
          chargeCategory {
            id
            name
            code
          }
        }
        resourcesTypeEnabled {
          id
          persons
        }
        childRule {
          rule
          fixedPrice
          childPrice {
            childId
            percentageDiscount
            price
            child {
              id
              minAge
              maxAge
              noOccupancy
              taxonomy {
                description {
                  language
                  value
                }
              }
            }
          }
        }
        bookingPolicy {
          id
          name
          noShowRule {
            type
            percentage
          }
          paymentRule {
            guaranteedCreditCard
            type
          }
          cancellationPolicy {
            type
            penaltyType
          }
        }
        chargeCategory {
          name
          code
        }
        mandatoryAdditionalServices {
          additionalService {
            id
            name {
              language
              value
            }
          }
          priceZero
        }
        order
        tenantId
        propertyId
        restrictionFromParent
        crossSell
      }
    }
  }
`;

// Funzione per testare la query
async function testAccommodationSearch() {
  console.log('🔍 Testing Accommodation Search Query...\n');

  const testCases = [
    {
      name: "Ricerca per 2 adulti in alta stagione (estate)",
      input: {
        checkIn: "2024-07-15",
        checkOut: "2024-07-22",
        adults: 2,
        children: 0,
        rooms: 1
      }
    },
    {
      name: "Ricerca per 4 adulti in bassa stagione",
      input: {
        checkIn: "2024-03-10",
        checkOut: "2024-03-15",
        adults: 4,
        children: 0,
        rooms: 1
      }
    },
    {
      name: "Ricerca per famiglia con bambini",
      input: {
        checkIn: "2024-12-20",
        checkOut: "2024-12-27",
        adults: 2,
        children: 2,
        rooms: 1
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`📋 Test Case: ${testCase.name}`);
    console.log(`   Input:`, JSON.stringify(testCase.input, null, 2));

    try {
      const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: SEARCH_ACCOMMODATION_QUERY,
          variables: {
            input: testCase.input
          }
        })
      });

      const result = await response.json();

      if (result.errors) {
        console.log('❌ Errori:', result.errors);
      } else {
        console.log(`✅ Risultati trovati: ${result.data.searchAccommodationAvailability.rates.length} tariffe`);
        
        // Mostra un riepilogo di ogni tariffa trovata
        result.data.searchAccommodationAvailability.rates.forEach((rate, index) => {
          const nameIt = rate.name.find(n => n.language === 'it')?.value || 'N/A';
          const descriptionIt = rate.description.find(d => d.language === 'it')?.value || 'N/A';
          const basePrice = rate.parentRate?.resourcesRate?.[0]?.price || 0;
          const chargeCategoryName = rate.chargeCategory?.name || 'N/A';
          
          console.log(`   ${index + 1}. ${nameIt}`);
          console.log(`      Descrizione: ${descriptionIt}`);
          console.log(`      Prezzo base: €${(basePrice / 100).toFixed(2)}`);
          console.log(`      Categoria: ${chargeCategoryName}`);
          console.log(`      Tipo: ${rate.type}`);
          console.log(`      Camere supportate: ${rate.resourcesTypeEnabled.map(r => `${r.persons} persone`).join(', ')}`);
        });
      }
    } catch (error) {
      console.log('❌ Errore durante la richiesta:', error.message);
    }

    console.log('\n' + '='.repeat(80) + '\n');
  }
}

// Esegui i test
if (require.main === module) {
  testAccommodationSearch()
    .then(() => {
      console.log('🎉 Test completati!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Errore durante i test:', error);
      process.exit(1);
    });
}

module.exports = { testAccommodationSearch };