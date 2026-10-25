from django.test import TestCase
from django.urls import reverse

from .models import ContactMessage, Project


class PortfolioViewsTests(TestCase):
    def test_home_uses_fallback_projects(self):
        response = self.client.get(reverse("home"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Rohit Bujwane")
        self.assertContains(response, "Pet Connect")

    def test_home_uses_featured_database_projects(self):
        Project.objects.create(
            title="Sentinel Interface",
            codename="AI observation deck",
            summary="A managed project from the admin dashboard.",
            tech_stack="Django, Three.js",
            signal="Managed Artifact",
            status="active",
        )

        response = self.client.get(reverse("home"))

        self.assertContains(response, "Sentinel Interface")
        self.assertNotContains(response, "Pet Connect")

    def test_contact_form_persists_message(self):
        response = self.client.post(
            reverse("contact"),
            {
                "name": "Test Pilot",
                "email": "pilot@example.com",
                "subject": "Mission",
                "message": "Build the future.",
            },
        )

        self.assertRedirects(response, reverse("home"))
        self.assertEqual(ContactMessage.objects.count(), 1)
