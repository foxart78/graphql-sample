# Esempi di Query per GraphQL Playground

## Query Base - Ricerca Disponibilità Estate

```graphql
query {
  rates(
    input: {
      checkIn: "2024-07-15"
      checkOut: "2024-07-22"
      adults: 2
      children: 0
      rooms: 1
    }
  ) {
    rates {
      id
      name {
        language
        value
      }
      description {
        language
        value
      }
      type
      currency
      parentRate {
        resourcesRate {
          price
          priceType
        }
      }
      chargeCategory {
        name
        code
      }
      resourcesTypeEnabled {
        id
        persons
      }
    }
  }
}
```

## Query Completa - Tutti i Dettagli

```graphql
query SearchAccommodation($input: AccommodationSearchInput!) {
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
            auditable {
              state
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
          installments
          paymentsAcceptedId
          percentage
          type
        }
        cancellationPolicy {
          daysWithoutPenalties
          hourWithoutPenalties
          penaltyType
          percentage
          type
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

## Variabili per la Query Completa

```json
{
  "input": {
    "checkIn": "2024-07-15",
    "checkOut": "2024-07-22",
    "adults": 2,
    "children": 1,
    "rooms": 1
  }
}
```

## Test per diversi scenari

### Scenario 1: Alta stagione estiva

```json
{
  "input": {
    "checkIn": "2024-08-10",
    "checkOut": "2024-08-17",
    "adults": 2,
    "children": 0,
    "rooms": 1
  }
}
```

### Scenario 2: Famiglia numerosa

```json
{
  "input": {
    "checkIn": "2024-03-15",
    "checkOut": "2024-03-20",
    "adults": 4,
    "children": 1,
    "rooms": 1
  }
}
```

### Scenario 3: Periodo natalizio

```json
{
  "input": {
    "checkIn": "2024-12-23",
    "checkOut": "2024-12-30",
    "adults": 2,
    "children": 2,
    "rooms": 1
  }
}
```
