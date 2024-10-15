;; Skill Exchange Marketplace

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-exists (err u102))
(define-constant err-trade-not-active (err u103))

;; Data Maps
(define-map Services
  { service-id: uint }
  { provider: principal, description: (string-utf8 256), price: uint, active: bool }
)

(define-map Trades
  { trade-id: uint }
  { requester: principal, provider: principal, service-id: uint, amount: uint, completed: bool, refunded: bool }
)

(define-map UserReputation
  { user: principal }
  { score: int }
)

;; Variables
(define-data-var service-counter uint u0)
(define-data-var trade-counter uint u0)

;; Read-only functions
(define-read-only (get-service (service-id uint))
  (map-get? Services { service-id: service-id })
)

(define-read-only (get-trade (trade-id uint))
  (map-get? Trades { trade-id: trade-id })
)

(define-read-only (get-reputation (user principal))
  (default-to { score: 0 } (map-get? UserReputation { user: user }))
)

;; Public functions
(define-public (list-service (description (string-utf8 256)) (price uint))
  (let
    (
      (service-id (+ (var-get service-counter) u1))
    )
    (map-set Services
      { service-id: service-id }
      { provider: tx-sender, description: description, price: price, active: true }
    )
    (var-set service-counter service-id)
    (ok service-id)
  )
)

(define-public (initiate-trade (service-id uint))
  (let
    (
      (service (unwrap! (get-service service-id) err-not-found))
      (trade-id (+ (var-get trade-counter) u1))
    )
    (asserts! (get active service) err-trade-not-active)
    (map-set Trades
      { trade-id: trade-id }
      { requester: tx-sender,
        provider: (get provider service),
        service-id: service-id,
        amount: (get price service),
        completed: false,
        refunded: false }
    )
    (var-set trade-counter trade-id)
    (ok trade-id)
  )
)
