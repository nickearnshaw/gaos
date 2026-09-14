# FX-02

- `id`: FX-02
- `requirement`: R-10
- `kind`: negative
- `precondition`: Item `armed`, approval bound to hash H1 over payload P1, unexpired, naming send.
- `action`: change payload to P2 (hash H2), then send.
- `required outcome`: refusal; state unchanged.
- `forbidden side effects`: no destination receives P1 or P2; the ledger records a refusal, not a send; the approval over H1 is not consumed as authorising H2.
- `observation points`: the binding's send boundary; the run ledger; the approval record.
