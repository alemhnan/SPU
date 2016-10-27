Stati Widget

1. Riposo. Nessun evento emesso.

2. Init richiesto da parte di container. 
2.a Container non valido -> Do nothing.
2.b Container valido. Answer init with 'OK'. Registrare internamente condizioni di validita' successive.

3. Attivo. Ricezione ed emissione di eventi.
3.1 Il widget emette eventi in base alla sua propria business logic. 
  Vengono emessi eventi solo per lo specifico container stabilito al punto 2.b.
3.2. Il widget sta in ascolto di eventi. 
  Solo gli eventi dello specifico container stabilito al punto 2.b. sono accettati

Struttura messaggi:
{ 
  mimeType: 'application/x-spu-v1+json',
  type: 'request'| 'call'| 'reply' | 'emit'|'handshake'|'handshake-reply'
->  type: 'listen'| 'emit'|'handshake'|'handshake-reply'
  event: ...
  data: {}
}
