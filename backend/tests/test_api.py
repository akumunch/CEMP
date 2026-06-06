from datetime import datetime, timedelta, timezone


def club_payload(name="CodeChef Club"):
    return {
        "name": name,
        "description": "Competitive programming and coding events.",
        "president_name": "Aarav Mehta",
        "vp_name": "Diya Sharma",
        "gen_sec_name": "Rohan Verma",
        "contact_email": "codechef@example.com",
        "leads": [
            {"name": "Nisha Rao", "department": "Technical"},
            {"name": "Kabir Singh", "department": "Marketing"},
        ],
    }


def updated_club_payload():
    payload = club_payload(name="Updated CodeChef Club")
    payload.update(
        {
            "description": "Updated club description.",
            "president_name": "Updated President",
            "vp_name": "Updated VP",
            "gen_sec_name": "Updated General Secretary",
            "contact_email": "updated.codechef@example.com",
            "leads": [{"name": "Ignored Lead", "department": "Operations"}],
        }
    )
    return payload


def create_club(client, name="CodeChef Club"):
    response = client.post("/api/clubs/", json=club_payload(name=name))
    assert response.status_code == 201
    return response.json()


def event_payload(club_id, title="Weekly Cook-Off"):
    event_date = datetime.now(timezone.utc) + timedelta(days=7)
    return {
        "title": title,
        "description": "A coding contest for all students.",
        "date": event_date.isoformat(),
        "location": "Auditorium",
        "club_id": club_id,
    }


def create_event(client, club_id, title="Weekly Cook-Off"):
    response = client.post("/api/events/", json=event_payload(club_id, title=title))
    assert response.status_code == 201
    return response.json()


def updated_event_payload(club_id):
    return {
        "title": "Updated Cook-Off",
        "description": "Updated contest details.",
        "date": (datetime.now(timezone.utc) + timedelta(days=14)).isoformat(),
        "location": "Seminar Hall",
        "club_id": club_id,
    }


def registration_payload(event_id, student_reg="22BCE1001"):
    return {
        "student_name": "Student One",
        "student_email": "student.one@example.com",
        "student_reg": student_reg,
        "event_id": event_id,
    }


def test_health_check(client):
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy",
        "message": "Welcome to the Club Chef API Platform",
    }


def test_create_club_with_leads(client):
    response = client.post("/api/clubs/", json=club_payload())

    assert response.status_code == 201
    body = response.json()
    assert body["id"] > 0
    assert body["name"] == "CodeChef Club"
    assert body["contact_email"] == "codechef@example.com"
    assert len(body["leads"]) == 2
    assert {lead["department"] for lead in body["leads"]} == {"Technical", "Marketing"}
    assert body["events"] == []


def test_rejects_duplicate_club_name(client):
    create_club(client)

    response = client.post("/api/clubs/", json=club_payload())

    assert response.status_code == 400
    assert response.json()["detail"] == "Club name already registered."


def test_get_all_clubs(client):
    first = create_club(client, name="CodeChef Club")
    second = create_club(client, name="Robotics Club")

    response = client.get("/api/clubs/")

    assert response.status_code == 200
    assert [club["id"] for club in response.json()] == [first["id"], second["id"]]


def test_get_club_by_id(client):
    club = create_club(client)

    response = client.get(f"/api/clubs/{club['id']}")

    assert response.status_code == 200
    assert response.json()["id"] == club["id"]
    assert response.json()["name"] == "CodeChef Club"


def test_get_missing_club_returns_404(client):
    response = client.get("/api/clubs/999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Club not found."


def test_update_club(client):
    club = create_club(client)

    response = client.put(f"/api/clubs/{club['id']}", json=updated_club_payload())

    assert response.status_code == 200
    body = response.json()
    assert body["id"] == club["id"]
    assert body["name"] == "Updated CodeChef Club"
    assert body["description"] == "Updated club description."
    assert body["president_name"] == "Updated President"
    assert body["contact_email"] == "updated.codechef@example.com"
    assert len(body["leads"]) == 2


def test_update_missing_club_returns_404(client):
    response = client.put("/api/clubs/999", json=updated_club_payload())

    assert response.status_code == 404
    assert response.json()["detail"] == "Club not found."


def test_delete_club(client):
    club = create_club(client)

    delete_response = client.delete(f"/api/clubs/{club['id']}")
    get_response = client.get(f"/api/clubs/{club['id']}")

    assert delete_response.status_code == 204
    assert delete_response.content == b""
    assert get_response.status_code == 404


def test_delete_missing_club_returns_404(client):
    response = client.delete("/api/clubs/999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Club not found."


def test_create_event_for_existing_club(client):
    club = create_club(client)

    response = client.post("/api/events/", json=event_payload(club["id"]))

    assert response.status_code == 201
    body = response.json()
    assert body["title"] == "Weekly Cook-Off"
    assert body["location"] == "Auditorium"
    assert body["club_id"] == club["id"]


def test_rejects_event_for_missing_club(client):
    response = client.post("/api/events/", json=event_payload(club_id=999))

    assert response.status_code == 404
    assert response.json()["detail"] == "Hosting club not found."


def test_get_all_events(client):
    club = create_club(client)
    first = create_event(client, club["id"], title="Weekly Cook-Off")
    second = create_event(client, club["id"], title="Debug Duel")

    response = client.get("/api/events/")

    assert response.status_code == 200
    assert [event["id"] for event in response.json()] == [first["id"], second["id"]]


def test_get_event_by_id(client):
    club = create_club(client)
    event = create_event(client, club["id"])

    response = client.get(f"/api/events/{event['id']}")

    assert response.status_code == 200
    assert response.json()["id"] == event["id"]
    assert response.json()["title"] == "Weekly Cook-Off"


def test_get_missing_event_returns_404(client):
    response = client.get("/api/events/999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Event not found."


def test_update_event(client):
    club = create_club(client)
    event = create_event(client, club["id"])

    response = client.put(
        f"/api/events/{event['id']}",
        json=updated_event_payload(club["id"]),
    )

    assert response.status_code == 200
    body = response.json()
    assert body["id"] == event["id"]
    assert body["title"] == "Updated Cook-Off"
    assert body["description"] == "Updated contest details."
    assert body["location"] == "Seminar Hall"
    assert body["club_id"] == club["id"]


def test_update_missing_event_returns_404(client):
    club = create_club(client)

    response = client.put("/api/events/999", json=updated_event_payload(club["id"]))

    assert response.status_code == 404
    assert response.json()["detail"] == "Event not found."


def test_delete_event(client):
    club = create_club(client)
    event = create_event(client, club["id"])

    delete_response = client.delete(f"/api/events/{event['id']}")
    get_response = client.get(f"/api/events/{event['id']}")

    assert delete_response.status_code == 204
    assert delete_response.content == b""
    assert get_response.status_code == 404


def test_delete_missing_event_returns_404(client):
    response = client.delete("/api/events/999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Event not found."


def test_register_for_event(client):
    club = create_club(client)
    event = create_event(client, club["id"])

    response = client.post("/api/registrations/", json=registration_payload(event["id"]))

    assert response.status_code == 201
    body = response.json()
    assert body["student_name"] == "Student One"
    assert body["student_email"] == "student.one@example.com"
    assert body["student_reg"] == "22BCE1001"
    assert body["event_id"] == event["id"]
    assert "registered_at" in body


def test_rejects_registration_for_missing_event(client):
    response = client.post("/api/registrations/", json=registration_payload(event_id=999))

    assert response.status_code == 404
    assert response.json()["detail"] == "Target event not found."


def test_rejects_duplicate_registration_for_same_event(client):
    club = create_club(client)
    event = create_event(client, club["id"])
    payload = registration_payload(event["id"], student_reg="22BCE1001")

    first_response = client.post("/api/registrations/", json=payload)
    second_response = client.post("/api/registrations/", json=payload)

    assert first_response.status_code == 201
    assert second_response.status_code == 400
    assert second_response.json()["detail"] == (
        "Registration 22BCE1001 is already signed up for this event."
    )


def test_allows_same_student_registration_for_different_events(client):
    club = create_club(client)
    first_event = create_event(client, club["id"], title="Weekly Cook-Off")
    second_event = create_event(client, club["id"], title="Debug Duel")

    first_response = client.post(
        "/api/registrations/",
        json=registration_payload(first_event["id"], student_reg="22BCE1001"),
    )
    second_response = client.post(
        "/api/registrations/",
        json=registration_payload(second_event["id"], student_reg="22BCE1001"),
    )

    assert first_response.status_code == 201
    assert second_response.status_code == 201


def test_get_all_registrations(client):
    club = create_club(client)
    first_event = create_event(client, club["id"], title="Weekly Cook-Off")
    second_event = create_event(client, club["id"], title="Debug Duel")
    first = client.post(
        "/api/registrations/",
        json=registration_payload(first_event["id"], student_reg="22BCE1001"),
    ).json()
    second = client.post(
        "/api/registrations/",
        json=registration_payload(second_event["id"], student_reg="22BCE1002"),
    ).json()

    response = client.get("/api/registrations/")

    assert response.status_code == 200
    assert [registration["id"] for registration in response.json()] == [
        first["id"],
        second["id"],
    ]


def test_cancel_registration(client):
    club = create_club(client)
    event = create_event(client, club["id"])
    registration = client.post(
        "/api/registrations/",
        json=registration_payload(event["id"]),
    ).json()

    delete_response = client.delete(f"/api/registrations/{registration['id']}")
    list_response = client.get("/api/registrations/")

    assert delete_response.status_code == 204
    assert delete_response.content == b""
    assert list_response.status_code == 200
    assert list_response.json() == []


def test_cancel_missing_registration_returns_404(client):
    response = client.delete("/api/registrations/999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Registration not found."
