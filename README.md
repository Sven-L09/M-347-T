# M-347 Webserver Projekt

Dieses Projekt stellt eine Webseite mit **Nginx** und eine **MariaDB**-Datenbank in **Docker-Containern** bereit. Beide Services bleiben auch nach dem Stoppen und Starten der Container verfügbar, da die Daten über Docker-Volumes persistiert werden.

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
3. **Docker Compose konfiguriert**: Die `docker-compose.yml` startet zwei Services – den Webserver und eine MariaDB-Datenbank – mit Volumes für Persistenz.

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
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: mariadb:10
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: m347db
      MYSQL_USER: m347user
      MYSQL_PASSWORD: m347pass
    volumes:
      - db_data:/var/lib/mysql
    restart: unless-stopped

volumes:
  db_data:
```

- **`build: .`** – Baut das Image aus dem Dockerfile im aktuellen Verzeichnis.
- **`ports: "8080:80"`** – Macht den Webserver auf Port 8080 erreichbar.
- **`volumes`** – Bindet den `website/`-Ordner ein, damit Änderungen sofort sichtbar sind.
- **`depends_on: db`** – Der Webserver startet erst, wenn die Datenbank bereit ist.
- **`db` Service** – MariaDB 10 mit einem benannten Volume `db_data` für persistente Datenspeicherung.
- **`restart: unless-stopped`** – Container starten nach einem Neustart automatisch wieder.

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

Die Webseite und die Datenbank sind nach dem erneuten Starten wieder verfügbar. Die Datenbank-Daten werden im benannten Volume `db_data` gespeichert.

### Datenbank-Verbindung

Die MariaDB-Datenbank ist erreichbar über:

| Parameter | Wert |
|-----------|------|
| Host | `db` (innerhalb von Docker) |
| Port | `3306` |
| Datenbank | `m347db` |
| Benutzer | `m347user` |
| Passwort | `m347pass` |

## Webseite ändern

Um Änderungen an der Webseite vorzunehmen:

1. Bearbeiten Sie die Dateien im `website/`-Ordner (z.B. `website/index.html`).
2. Da das Volume den Ordner direkt einbindet, sind Änderungen **sofort** im Browser sichtbar (Seite neu laden).
3. Für dauerhafte Änderungen im Image:

   ```bash
   docker-compose build
   docker-compose up -d
   ```