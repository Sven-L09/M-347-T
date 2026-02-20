# M-347 Webserver Projekt

Dieses Projekt stellt eine Webseite mit **Nginx** in einem **Docker-Container** bereit. Die Webseite bleibt auch nach dem Stoppen und Starten des Containers verfügbar, da die Dateien über ein Docker-Volume eingebunden werden.

## Projektstruktur

```
M-347-T/
├── Dockerfile              # Docker-Image Definition (Nginx + Webseite)
├── docker-compose.yml      # Docker Compose Konfiguration
├── README.md               # Diese Anleitung
└── website/                # Webseiten-Dateien
    ├── index.html           # Hauptseite
    ├── css/
    │   └── style.css        # Styling
    └── images/
        ├── docker-logo.svg  # Docker Logo
        ├── nginx-logo.svg   # Nginx Logo
        └── compose-logo.svg # Compose Logo
```

## Wie wurde das Projekt gebaut?

1. **Webseite erstellt**: Eine HTML-Seite mit CSS und SVG-Bildern wurde im `website/`-Ordner angelegt.
2. **Dockerfile erstellt**: Basierend auf dem offiziellen `nginx:alpine`-Image werden die Webseiten-Dateien in den Nginx-HTML-Ordner kopiert.
3. **Docker Compose konfiguriert**: Die `docker-compose.yml` baut das Image und startet den Container mit einem Volume-Mount für Persistenz.

### Dockerfile

```dockerfile
FROM nginx:alpine
COPY website/ /usr/share/nginx/html/
EXPOSE 80
```

### Docker Compose

```yaml
services:
  webserver:
    build: .
    ports:
      - "8080:80"
    volumes:
      - ./website:/usr/share/nginx/html:ro
    restart: unless-stopped
```

- **`build: .`** – Baut das Image aus dem Dockerfile im aktuellen Verzeichnis.
- **`ports: "8080:80"`** – Macht den Webserver auf Port 8080 erreichbar.
- **`volumes`** – Bindet den `website/`-Ordner ein, damit Änderungen sofort sichtbar sind.
- **`restart: unless-stopped`** – Container startet nach einem Neustart automatisch wieder.

## Installation (Anleitung für die Lehrperson)

### Voraussetzungen

- Docker und Docker Compose müssen installiert sein (z.B. Play with Docker).

### Schritte

1. **Repository klonen:**

   ```bash
   git clone https://github.com/Sven-L09/M-347-T.git
   ```

2. **In das Projektverzeichnis wechseln:**

   ```bash
   cd M-347-T
   ```

3. **Container starten:**

   ```bash
   docker-compose up -d
   ```

4. **Webseite aufrufen:**

   Öffnen Sie einen Browser und navigieren Sie zu:

   ```
   http://localhost:8080
   ```

   In Play with Docker wird automatisch ein Link zum Port 8080 angezeigt.

### Container stoppen und starten

```bash
# Container stoppen
docker-compose down

# Container erneut starten
docker-compose up -d
```

Die Webseite ist nach dem erneuten Starten wieder verfügbar.

## Webseite ändern

Um Änderungen an der Webseite vorzunehmen:

1. Bearbeiten Sie die Dateien im `website/`-Ordner (z.B. `website/index.html`).
2. Da das Volume den Ordner direkt einbindet, sind Änderungen **sofort** im Browser sichtbar (Seite neu laden).
3. Für dauerhafte Änderungen im Image:

   ```bash
   docker-compose build
   docker-compose up -d
   ```