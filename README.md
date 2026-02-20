# M-347 Webserver Projekt

Dieses Projekt stellt eine vollständige Webapplikation mit **Docker Compose** bereit:
- **Nginx Webserver** mit HTML/CSS/JavaScript Frontend
- **Node.js Express Backend API** für Todo-Verwaltung
- **MariaDB Datenbank** mit persistenter Datenspeicherung
- Responsive Design

---

## ⚡ Schnellstart

### 🎯 Für Lehrpersonen & normale Nutzer (Docker Hub Images)

**NUTZE DIESE VARIANTE:**

```bash
git clone https://github.com/Sven-L09/M-347-T.git
cd M-347-T
docker-compose -f docker-compose-install.yml up -d
```

**Browser:** http://localhost:8080

✅ Images werden von Docker Hub (jaba09) gepullt - **keine lokalen Builds nötig!**

⏱️ **Dauer:** ~30-60 Sekunden

---

### 🔨 Für Entwickler (lokal bauen)

```bash
git clone https://github.com/Sven-L09/M-347-T.git
cd M-347-T
docker-compose up -d --build
```

**Browser:** http://localhost:8080

⏱️ **Dauer:** 2-5 Minuten (Images werden lokal gebaut)

---

## 📁 Zwei verschiedene Compose-Dateien

| Datei | Verwendung | Für wen |
|-------|-----------|---------|
| **docker-compose-install.yml** | Images von Docker Hub (jaba09) | ✅ **Lehrpersonen & Schüler** |
| **docker-compose.yml** | Images lokal bauen | 🔨 Entwickler |

**Normaler Nutzer?** → Nutze `docker-compose-install.yml`!

---

## 📦 Docker Hub Images

Die fertigen Images sind bereits auf Docker Hub verfügbar:
- `jaba09/m347-webserver:latest` – https://hub.docker.com/r/jaba09/m347-webserver
- `jaba09/m347-backend:latest` – https://hub.docker.com/r/jaba09/m347-backend

Diese werden automatisch beim `docker-compose -f docker-compose-install.yml up -d` gezogen!

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

---

## 🚀 Installation

### Option 1️⃣: Für Lehrpersonen & Schüler (EMPFOHLEN)

**Nutze docker-compose-install.yml:**

```bash
git clone https://github.com/DEINBENUTZERNAME/M-347-T.git
cd M-347-T
docker-compose -f docker-compose-install.yml up -d
```

**Browser:** http://localhost:8080

✅ **Keinerlei Builds nötig!** Images werden von Docker Hub (jaba09) gezogen.

⏱️ **Dauer:** ~30-60 Sekunden

---

### Option 2️⃣: Für Entwickler (lokales Bauen)

**Nutze docker-compose.yml:**

```bash
git clone https://github.com/DEINBENUTZERNAME/M-347-T.git
cd M-347-T
docker-compose up -d --build
```

**Browser:** http://localhost:8080

⏱️ **Dauer:** 2-5 Minuten (Images werden lokal gebaut)

**Wann nutzen?**
- Code ändern & testen
- Neue Dockerfiles erstellen
- Images anpassen

---

### Container stoppen & neustarten

**Mit docker-compose-install.yml:**
```bash
docker-compose -f docker-compose-install.yml down
docker-compose -f docker-compose-install.yml up -d
```

**Mit docker-compose.yml:**
```bash
docker-compose down
docker-compose up -d
```

Die Datenbank-Daten werden im Volume `db_data` persistiert!

---

## 🔧 Für Entwickler: Code ändern

Wenn du den Backend- oder Frontend-Code ändern und testen willst:

1. **Bearbeite die Dateien:**
   ```bash
   # Frontend:
   nano website/index.html
   
   # Backend:
   nano backend/server.js
   ```

2. **Nutze docker-compose.yml zum Bauen & Testen:**
   ```bash
   docker-compose up -d --build
   ```

3. **Browser neu laden** (F5) um Änderungen zu sehen
   ```
   http://localhost:8080
   ```

4. **Logs prüfen bei Fehlern:**
   ```bash
   docker-compose logs -f backend
   ```

**Wichtig:** Nutze `docker-compose.yml`, nicht `docker-compose-install.yml`!