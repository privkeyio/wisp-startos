import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.8.0:0',
  releaseNotes: {
    en_US:
      'Updates wisp to v0.8.0. The relay is now built with Zig 0.17, and it picks up two upstream WebSocket fixes: a wss connection used to sync from other relays could leave a received message unread on a quiet connection until more data arrived, and a failed buffer resize could hand memory to the wrong allocator. No protocol or settings changes and no migration is needed.',
    es_ES:
      'Actualiza wisp a v0.8.0. El relé ahora se compila con Zig 0.17 e incorpora dos correcciones de WebSocket de origen: una conexión wss usada para sincronizar con otros relés podía dejar sin leer un mensaje recibido en una conexión inactiva hasta que llegaran más datos, y un cambio de tamaño de búfer fallido podía entregar memoria al asignador equivocado. No cambia el protocolo ni ningún ajuste y no hace falta ninguna migración.',
    de_DE:
      'Aktualisiert wisp auf v0.8.0. Das Relay wird jetzt mit Zig 0.17 gebaut und übernimmt zwei WebSocket-Korrekturen aus dem Upstream: Eine wss-Verbindung zur Synchronisation mit anderen Relays konnte auf einer ruhigen Verbindung eine empfangene Nachricht ungelesen lassen, bis weitere Daten eintrafen, und eine fehlgeschlagene Puffervergrößerung konnte Speicher an den falschen Allokator übergeben. Protokoll und Einstellungen ändern sich nicht und es ist keine Migration nötig.',
    pl_PL:
      'Aktualizuje wisp do v0.8.0. Przekaźnik jest teraz budowany przy użyciu Zig 0.17 i zawiera dwie poprawki WebSocket z projektu źródłowego: połączenie wss używane do synchronizacji z innymi przekaźnikami mogło pozostawić odebraną wiadomość nieodczytaną na bezczynnym połączeniu aż do nadejścia kolejnych danych, a nieudana zmiana rozmiaru bufora mogła przekazać pamięć niewłaściwemu alokatorowi. Protokół i ustawienia się nie zmieniają i nie jest potrzebna migracja.',
    fr_FR:
      "Met à jour wisp vers v0.8.0. Le relais est désormais compilé avec Zig 0.17 et intègre deux correctifs WebSocket en amont : une connexion wss servant à la synchronisation avec d'autres relais pouvait laisser un message reçu non lu sur une connexion inactive jusqu'à l'arrivée de nouvelles données, et un redimensionnement de tampon en échec pouvait confier de la mémoire au mauvais allocateur. Ni le protocole ni les réglages ne changent et aucune migration n'est nécessaire.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
