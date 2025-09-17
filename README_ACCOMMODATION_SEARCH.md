# Test di esempio per la query rates

La nuova query GraphQL `rates` è stata implementata con successo nel server.

## Schema della Query

```graphql
query GetRates($input: AccommodationSearchInput!) {
  rates(input: $input) {
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
```

## Input Parameters

```graphql
input AccommodationSearchInput {
  checkIn: String! # Data di check-in (formato ISO: "2024-07-15")
  checkOut: String! # Data di check-out (formato ISO: "2024-07-22")
  adults: Int! # Numero di adulti
  children: Int # Numero di bambini (opzionale)
  rooms: Int # Numero di camere (opzionale, default: 1)
}
```

## Esempi di utilizzo

### Esempio 1: Ricerca per 2 adulti in estate

```graphql
{
  "input": {
    "checkIn": "2024-07-15",
    "checkOut": "2024-07-22",
    "adults": 2,
    "children": 0,
    "rooms": 1
  }
}
```

### Esempio 2: Ricerca per famiglia con bambini

```graphql
{
  "input": {
    "checkIn": "2024-12-20",
    "checkOut": "2024-12-27",
    "adults": 2,
    "children": 2,
    "rooms": 1
  }
}
```

### Esempio 3: Ricerca per gruppo di 4 adulti

```graphql
{
  "input": {
    "checkIn": "2024-03-10",
    "checkOut": "2024-03-15",
    "adults": 4,
    "children": 0,
    "rooms": 1
  }
}
```

## Funzionalità implementate

1. **Filtro per capacità**: La query filtra automaticamente le tariffe in base al numero di adulti, mostrando solo le camere che possono ospitare il numero richiesto di persone.

2. **Logica stagionale**: Durante i mesi estivi (giugno-settembre), la query privilegia le tariffe "Speciale Estate" nei risultati.

3. **Ordinamento per prezzo**: I risultati sono ordinati dal prezzo più basso al più alto.

4. **Limitazione risultati**: Per ottimizzare le performance, vengono restituiti massimo 5 tariffe.

5. **Logging dettagliato**: Ogni ricerca viene loggata nel console con i parametri di ricerca e il numero di risultati trovati.

## Dati di test disponibili

Il sistema include 3 tariffe di esempio:

1. **Natale** - Tariffa per il periodo natalizio (€300 base)
2. **Culturale** - Camera + visita guidata (€250 base)
3. **Speciale Estate** - Offerta estiva scontata (€200 base)

## Come testare

1. Avvia il server: `node server.js`
2. Apri http://localhost:4000/graphql nel browser
3. Usa il GraphQL Playground per eseguire le query di esempio sopra

## Struttura della risposta

La risposta include tutti i dettagli delle tariffe disponibili con la stessa struttura del JSON fornito nell'esempio, inclusi:

- Informazioni base della tariffa (nome, descrizione, tipo)
- Prezzi e regole di occupazione
- Politiche di prenotazione e cancellazione
- Servizi aggiuntivi obbligatori
- Regole per bambini
- Tipi di camera supportati
