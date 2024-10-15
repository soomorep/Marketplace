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
