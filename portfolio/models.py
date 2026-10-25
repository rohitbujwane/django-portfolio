from django.db import models


class Project(models.Model):
    STATUS_CHOICES = [
        ("prototype", "Prototype"),
        ("active", "Active Build"),
        ("research", "Research"),
        ("concept", "Concept"),
    ]

    title = models.CharField(max_length=120)
    codename = models.CharField(max_length=80, blank=True)
    summary = models.TextField()
    tech_stack = models.CharField(max_length=220)
    signal = models.CharField(max_length=80, default="Experimental System")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="prototype")
    order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "title"]

    def __str__(self):
        return self.title

    @property
    def tech_list(self):
        return [item.strip() for item in self.tech_stack.split(",") if item.strip()]


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=160)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.subject}"
