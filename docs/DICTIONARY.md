# The Path - Database Dictionary

## Database: the_path.db (SQLite)

### Table: songs
Core table for storing song information and lyrics.

| Column Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID v4 format |
| title | TEXT | NOT NULL | Song title |
| artist | TEXT | NULL | Artist/songwriter name |
| lyrics | TEXT | NOT NULL | Full lyrics text |
| slides_data | TEXT | NULL | JSON array of slide objects |
| design_theme | TEXT | NULL | JSON object with design specifications |
| ccli_number | TEXT | NULL | CCLI license number |
| key | TEXT | NULL | Musical key (e.g., "G", "Am") |
| tempo | INTEGER | NULL | BPM (beats per minute) |
| tags | TEXT | NULL | JSON array of tag strings |
| created_at | TEXT | NOT NULL | ISO 8601 datetime |
| updated_at | TEXT | NOT NULL | ISO 8601 datetime |

### Table: announcements
Stores announcement slide content.

| Column Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID v4 format |
| title | TEXT | NOT NULL | Announcement title |
| content | TEXT | NULL | Rich text content |
| design_data | TEXT | NULL | JSON object with design specifications |
| image_path | TEXT | NULL | Relative path to image file |
| created_at | TEXT | NOT NULL | ISO 8601 datetime |
| updated_at | TEXT | NOT NULL | ISO 8601 datetime |

### Table: services
Stores service orders/setlists.

| Column Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID v4 format |
| name | TEXT | NOT NULL | Service name/description |
| date | TEXT | NULL | ISO 8601 date |
| items | TEXT | NOT NULL | JSON array of {type, id, order} objects |
| created_at | TEXT | NOT NULL | ISO 8601 datetime |
| updated_at | TEXT | NOT NULL | ISO 8601 datetime |

### Table: design_templates
Reusable design templates.

| Column Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID v4 format |
| name | TEXT | NOT NULL | Template name |
| template_data | TEXT | NOT NULL | JSON object with complete design specs |
| is_ai_generated | INTEGER | DEFAULT 0 | Boolean (0 or 1) |
| created_at | TEXT | NOT NULL | ISO 8601 datetime |

### Table: settings
Application settings and preferences.

| Column Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| key | TEXT | PRIMARY KEY | Setting identifier |
| value | TEXT | NOT NULL | JSON-encoded value |
| updated_at | TEXT | NOT NULL | ISO 8601 datetime |

## JSON Schema Specifications

### slides_data JSON Structure
```json
[
  {
    "id": "slide-uuid",
    "type": "verse" | "chorus" | "bridge" | "custom",
    "content": "Slide text content",
    "order": 0
  }
]
```

### design_theme JSON Structure
```json
{
  "backgroundColor": "#FFFFFF",
  "backgroundGradient": "linear-gradient(...)",
  "backgroundImage": "path/to/image.jpg",
  "textColor": "#000000",
  "textShadow": "2px 2px 4px rgba(0,0,0,0.5)",
  "fontFamily": "Inter",
  "fontSize": "48px",
  "textAlign": "center",
  "overlayOpacity": 0.3
}
```

### items JSON Structure (services table)
```json
[
  {
    "type": "song" | "announcement",
    "id": "item-uuid",
    "order": 0
  }
]
```

## Indexes
- songs: CREATE INDEX idx_songs_title ON songs(title)
- songs: CREATE INDEX idx_songs_created_at ON songs(created_at)
- announcements: CREATE INDEX idx_announcements_created_at ON announcements(created_at)
- services: CREATE INDEX idx_services_date ON services(date)

## Notes
- All UUIDs generated using crypto.randomUUID()
- All datetime fields use ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ
- JSON fields stored as TEXT, parsed in application layer
- SQLite boolean fields use INTEGER (0 = false, 1 = true)
