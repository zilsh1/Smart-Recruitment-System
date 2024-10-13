from django.urls import path
from .views import (
    CompanyJobApplicationsView,
    CompanyProfileView,
    CompanyUserLoginView,
    CompanyRegisterView,
    first,
    RegisterView,
    ProfileView,
    LoginView,
    AppliedJobListView,
    ProfileUpdateView,
    JobPostView,
    IndividualCompanyPostView,
    JobDeleteView,
    CreateJobPostView,
    ApplicantsDeleteView,
    ApplicationAcceptView,
    JobApply,
    ApplicationRejectView,
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("first/", first.as_view(), name="first"),
    path("register/", RegisterView.as_view(), name="Register"),
    path("login/", LoginView.as_view(), name="Login"),
    path("jobs/", JobPostView.as_view(), name="jobpost"),
    path("jobs/<int:id>/", IndividualCompanyPostView.as_view(), name="jobpost"),
    path(
        "applied-jobs/<str:username>/", AppliedJobListView.as_view(), name="appliedJob"
    ),
    path("profile/<str:username>/", ProfileView.as_view(), name="profile"),
    path("profile/<str:username>/update/", ProfileUpdateView.as_view(), name="profile"),
    path(
        "company/register/",
        CompanyRegisterView.as_view(),
        name="company-user-register",
    ),
    path("company/login/", CompanyUserLoginView.as_view(), name="company-user-login"),
    path(
        "company-profile/<int:id>/",
        CompanyProfileView.as_view(),
        name="company-profile",
    ),
    path(
        "company/<int:company_id>/applications/",
        CompanyJobApplicationsView.as_view(),
        name="company-job-applications",
    ),
    path("jobs/<int:pk>/delete/", JobDeleteView.as_view(), name="delete"),
    path("jobs/create/", CreateJobPostView.as_view(), name="create"),
    path("application/<int:pk>/delete/", ApplicantsDeleteView.as_view(), name="reject"),
    path(
        "application/accept/<int:id>/",
        ApplicationAcceptView.as_view(),
        name="accept_application",
    ),
    path(
        "application/reject/<int:id>/", ApplicationRejectView.as_view(), name="reject"
    ),
    path("apply/<int:id>/<str:username>/", JobApply.as_view(), name="apply"),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)