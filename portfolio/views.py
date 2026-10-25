from django.contrib import messages
from django.shortcuts import redirect, render
from django.views.decorators.http import require_POST

from .models import ContactMessage, Project


DEFAULT_PROJECTS = [
    {
        "title": "Pet Connect",
        "codename": "AI-enabled pet platform",
        "summary": "An AI-enabled pet-related platform focused on connecting users with useful pet services and information.",
        "tech_list": ["Python", "AI", "React", "FastAPI"],
        "signal": "AI Platform",
        "status": "active",
    },
    {
        "title": "Smart Email Cleaner",
        "codename": "Intelligent email organizer",
        "summary": "AI-powered email organization system that categorizes emails into categories such as Important and Promotional using machine-learning techniques.",
        "tech_list": ["Python", "ML", "NLP", "Scikit-learn"],
        "signal": "Machine Learning",
        "status": "active",
    },
    {
        "title": "Smart Student Productivity System",
        "codename": "Academic task manager",
        "summary": "A student-focused productivity platform designed to help students manage academic tasks, schedules, productivity, and learning activities.",
        "tech_list": ["Python", "Django", "JavaScript", "SQL"],
        "signal": "Productivity",
        "status": "active",
    },
    {
        "title": "AI Medical Report Simplifier",
        "codename": "Health report assistant",
        "summary": "A system for extracting information from medical reports using OCR and AI, identifying important values, and explaining complex medical information in simpler language.",
        "tech_list": ["Python", "OCR", "AI", "NLP"],
        "signal": "AI Healthcare",
        "status": "concept",
    },
]

SKILLS = [
    ("Python", 88, "AI & backend development"),
    ("Java", 78, "Object-oriented systems"),
    ("JavaScript", 80, "Web interactivity"),
    ("HTML/CSS", 85, "Frontend structure & styling"),
    ("AI / ML", 82, "Machine learning & deep learning"),
    ("React", 75, "Component-based UIs"),
    ("SQL / MongoDB", 78, "Data management"),
    ("Git & Tools", 80, "Version control & workflow"),
]


def home(request):
    db_projects = Project.objects.filter(is_featured=True)
    projects = db_projects if db_projects.exists() else DEFAULT_PROJECTS
    return render(
        request,
        "portfolio/home.html",
        {
            "projects": projects,
            "skills": SKILLS,
        },
    )


@require_POST
def contact(request):
    ContactMessage.objects.create(
        name=request.POST.get("name", "").strip(),
        email=request.POST.get("email", "").strip(),
        subject=request.POST.get("subject", "").strip() or "Portfolio transmission",
        message=request.POST.get("message", "").strip(),
    )
    messages.success(request, "Transmission received. Rohit's command terminal logged your signal.")
    return redirect("home")
