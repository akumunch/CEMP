# CEMP — Club Event Management Platform

A full-stack web application for managing campus clubs, events, and student registrations.

---

## Tech Stack

**Backend**
- Python 3.12
- FastAPI
- SQLAlchemy (ORM)
- PostgreSQL (via Docker)
- Pydantic v2
- pytest

**Frontend**
- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Framer Motion

---

## Project Setup

### Prerequisites
- Python 3.12+
- Node.js 18+
- Docker Desktop

### 1. Clone the repository
```bash
git clone <https://github.com/akumunch/CEMP>
cd CEMP
```

### 2. Start the database
```bash
docker run --name cemp-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=club_chef_db -p 5432:5432 -d postgres:16
```

### 3. Backend setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`  
Swagger docs at: `http://localhost:8000/docs`

### 4. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

### 5. Run backend tests
```bash
cd CEMP
backend\venv\Scripts\activate
python -m pytest backend/tests
```

---

## Database Schema

### clubs
| Column | Type | Constraints |
|---|---|---|
| id | Integer | Primary Key |
| name | String | Unique, Not Null |
| description | Text | Nullable |
| president_name | String | Not Null |
| vp_name | String | Not Null |
| gen_sec_name | String | Not Null |
| contact_email | String | Not Null |

### leads
| Column | Type | Constraints |
|---|---|---|
| id | Integer | Primary Key |
| name | String | Not Null |
| department | String | Not Null |
| club_id | Integer | FK → clubs.id |

### events
| Column | Type | Constraints |
|---|---|---|
| id | Integer | Primary Key |
| title | String | Not Null |
| description | Text | Nullable |
| date | DateTime | Not Null |
| location | String | Not Null |
| club_id | Integer | FK → clubs.id |

### registrations
| Column | Type | Constraints |
|---|---|---|
| id | Integer | Primary Key |
| student_name | String | Not Null |
| student_email | String | Not Null |
| student_reg | String | Not Null |
| registered_at | DateTime | Auto (UTC) |
| event_id | Integer | FK → events.id |

> Unique constraint on `(student_reg, event_id)` — prevents duplicate registrations.

---

## API Reference

### Clubs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/clubs/` | Create a club |
| GET | `/api/clubs/` | Get all clubs |
| GET | `/api/clubs/{id}` | Get club by ID |
| PUT | `/api/clubs/{id}` | Update club |
| DELETE | `/api/clubs/{id}` | Delete club |

### Events

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/events/` | Create an event |
| GET | `/api/events/` | Get all events |
| GET | `/api/events/{id}` | Get event by ID |
| PUT | `/api/events/{id}` | Update event |
| DELETE | `/api/events/{id}` | Delete event |

### Registrations

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/registrations/` | Register for an event |
| GET | `/api/registrations/` | Get all registrations |
| DELETE | `/api/registrations/{id}` | Cancel registration |

---

## Request & Response Examples

### Create a Club
**POST** `/api/clubs/`
```json
{
  "name": "CodeChef VIT Chennai",
  "description": "Competitive programming club.",
  "president_name": "Alice",
  "vp_name": "Bob",
  "gen_sec_name": "Carol",
  "contact_email": "codechef@vitc.edu",
  "leads": [
    { "name": "Dave", "department": "CSE" }
  ]
}
```
**Response 201**
```json
{
  "id": 1,
  "name": "CodeChef SRM",
  "description": "Competitive programming club.",
  "president_name": "Alice",
  "vp_name": "Bob",
  "gen_sec_name": "Carol",
  "contact_email": "codechef@srm.edu",
  "leads": [
    { "id": 1, "name": "Dave", "department": "CSE", "club_id": 1 }
  ],
  "events": []
}
```

### Create an Event
**POST** `/api/events/`
```json
{
  "title": "Hackathon 2025",
  "description": "24-hour coding contest.",
  "date": "2025-08-15T09:00:00",
  "location": "Tech Park Auditorium",
  "club_id": 1
}
```
**Response 201**
```json
{
  "id": 1,
  "title": "Hackathon 2025",
  "description": "24-hour coding contest.",
  "date": "2025-08-15T09:00:00",
  "location": "Tech Park Auditorium",
  "club_id": 1
}
```

### Register for an Event
**POST** `/api/registrations/`
```json
{
  "student_name": "John Doe",
  "student_email": "john@srm.edu",
  "student_reg": "24BCEXXXX",
  "event_id": 1
}
```
**Response 201**
```json
{
  "id": 1,
  "student_name": "John Doe",
  "student_email": "john@srm.edu",
  "student_reg": "24BCEXXXX",
  "event_id": 1,
  "registered_at": "2025-06-06T10:30:00Z"
}
```

### Duplicate Registration Error
**Response 400**
```json
{
  "detail": "Registration 24BCEXXXX is already signed up for this event."
}
```

### Resource Not Found
**Response 404**
```json
{
  "detail": "Target event not found."
}
```

---

## Deployment

Not deployed. To run locally, follow the setup instructions above.