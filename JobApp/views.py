import json
from django.contrib.auth import get_user_model, login
from django.shortcuts import render

# Create your views here.
from django.http import Http404, JsonResponse

from rest_framework import generics, viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from .models import AppliedJobs, Company, CompanyUser, Job, User
from django.contrib.auth.hashers import make_password
from .serializers import (
    AppliedJobsSerializer,
    CompanyProfileSerializer,
    CompanySerializer,
    CompanyUserSerializer,
    UserSerializer,
    JobPostSerializer,
    JobAppliedForComapnySerializer,
    JobPostCreateSerializer,
    ApplySerializer,
)
from django.contrib.auth.hashers import check_password
from django.conf import settings
from django.core.mail import send_mail
from rest_framework.parsers import MultiPartParser, FormParser


class first(APIView):
    def get(self, request):
        user = User.objects.all()
        data = list(user.values())
        return JsonResponse(data, safe=False, status=status.HTTP_200_OK)
    
# registering user
class RegisterView(APIView):

    def post(self, request):
        data = request.data
        print(data)
        serializer = UserSerializer(data=request.data)
        subject = "welcome to JOBFUSION  world"
        message = f"Hi {data.get('username')}, \n  We are thrilled to have you as a part of our community.At Jub Fusion, we’re committed to helping you find your dream job. Whether you’re just starting out, looking to advance your career, or exploring new opportunities, we’re here to support you every step of the way."
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [
            data.get("email"),
        ]
        send_mail(subject, message, email_from, recipient_list)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User created successfully"}, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CompanyRegisterView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        converted_obj = {}
        converted_obj["email"] = request.data.get("email")
        converted_obj["password"] = request.data.get("password")
        converted_obj["company"] = {}
        converted_obj["company"]["name"] = request.data.get("name")
        converted_obj["company"]["location"] = request.data.get("location")
        converted_obj["company"]["industry"] = request.data.get("industry")
        converted_obj["company"]["description"] = request.data.get("description")
        converted_obj["company"]["website"] = request.data.get("website")
        converted_obj["company"]["logo"] = request.data.get("logo")
        print(converted_obj)
        serializer = CompanyUserSerializer(data=converted_obj)
        if serializer.is_valid():
            serializer.save()
            # current_company = Company.objects.get(name=converted_obj["company"]["name"])
            # request.session["user_id"] = current_company.id
            # print(request.session["user_id"])
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CompanyUserLoginView(generics.GenericAPIView):
    serializer_class = CompanyUserSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")
        try:
            user = CompanyUser.objects.get(email=email)
            if check_password(password, user.password):
                request.session["user_id"] = user.id
                return Response(
                    {"message": "Login successful", "id": user.id},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
                )
        except CompanyUser.DoesNotExist:
            return Response(
                {"error": "User does not exist"}, status=status.HTTP_400_BAD_REQUEST
            )


class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "Email and password required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(username=username)
            if check_password(password, user.password):
                refresh = RefreshToken.for_user(user)
                return Response(
                    {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                    status=status.HTTP_200_OK,
                )
        except User.DoesNotExist:
            pass

        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )


class ProfileView(APIView):
    def get(self, request, username, format=None):
        try:
            print(username)
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = UserSerializer(user)
        return Response(serializer.data)


class ProfileUpdateView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        username = self.kwargs.get("username")
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            raise Http404

    def put(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)
        # print(serializer)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)

        if not serializer.is_valid():
            print("Validation Errors:", serializer.errors)
            return Response(
                {"error": "Validation failed", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        self.perform_update(serializer)
        return Response(serializer.data)


class AppliedJobListView(APIView):

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            applied_jobs = AppliedJobs.objects.filter(user=user)
            serializer = AppliedJobsSerializer(applied_jobs, many=True)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )


class JobPostView(APIView):
    def get(self, request):
        job_posts = Job.objects.all()
        serializer = JobPostSerializer(job_posts, many=True)
        # do ordered by posted date

        return Response(serializer.data)


class IndividualCompanyPostView(APIView):
    def get(self, request, id):
        try:
            company = Company.objects.get(id=id)
            job_posts = Job.objects.filter(company=company).order_by("-created_at")
            serializer = JobPostSerializer(job_posts, many=True)
            return Response(serializer.data)
        except Company.DoesNotExist:
            return Response(
                {"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND
            )


class CompanyView(APIView):
    def get(self, request):
        companies = Company.objects.all()
        serializer = CompanySerializer(companies, many=True)
        return Response(serializer.data)


class CompanyProfileView(APIView):
    def get(self, request, id, *args, **kwargs):
        if not id:
            return Response(
                {"error": "Authentication credentials were not provided."},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            user = Company.objects.filter(id=id)
            serializer = CompanyProfileSerializer(user, many=True)
            return Response(serializer.data)

        except CompanyUser.DoesNotExist:
            return Response(
                {"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND
            )


class CompanyJobApplicationsView(generics.ListAPIView):
    serializer_class = JobAppliedForComapnySerializer

    def get_queryset(self):
        company_id = self.kwargs["company_id"]
        jobs = Job.objects.filter(company_id=company_id)
        applied_jobs = AppliedJobs.objects.filter(job__in=jobs)
        return applied_jobs

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class JobDeleteView(generics.DestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobPostSerializer

    def delete(self, request, *args, **kwargs):
        try:
            job = self.get_object()
            job.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Job.DoesNotExist:
            return Response(
                {"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND
            )


class ApplicantsDeleteView(generics.DestroyAPIView):
    queryset = AppliedJobs.objects.all()
    serializer_class = AppliedJobsSerializer

    def delete(self, request, *args, **kwargs):
        try:
            applicant = self.get_object()
            applicant.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except AppliedJobs.DoesNotExist:
            return Response(
                {"error": "Applicant not found"}, status=status.HTTP_404_NOT_FOUND
            )


class ApplicationAcceptView(APIView):
    def post(self, request, *args, **kwargs):
        applicant_id = self.kwargs.get("id")

        try:
            applicant = AppliedJobs.objects.get(id=applicant_id)
        except AppliedJobs.DoesNotExist:
            return Response(
                {"detail": "Application not found."}, status=status.HTTP_404_NOT_FOUND
            )
        applicant.status = "Approved"
        applicant.save()
        company = applicant.job.company
        email_subject, email_body = email_data(
            applicant.user.username,
            applicant.job.title,
            applicant.job.company.name,
            applicant.job.company.location,
            applicant.user.email,
            applicant.user.mobile,
            applicant.job.company.website,
        )
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [applicant.user.email]
        send_mail(email_subject, email_body, email_from, recipient_list)
        # try:
        #     company_user = CompanyUser.objects.get(company=company)
        #     company_email = company_user.email
        # except CompanyUser.DoesNotExist:
        #     company_email = "No email found for company user"
        return Response({"detail": "Application approved"}, status=status.HTTP_200_OK)


class ApplicationRejectView(APIView):
    def post(self, request, *args, **kwargs):
        applicant_id = self.kwargs.get("id")
        try:
            applicant = AppliedJobs.objects.get(id=applicant_id)
        except AppliedJobs.DoesNotExist:
            return Response(
                {"detail": "Application not found."}, status=status.HTTP_404_NOT_FOUND
            )
        applicant.status = "Rejected"
        applicant.save()
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [applicant.user.email]
        subject = f"Dear {applicant.user.username}"
        body = f"""Your application for {applicant.job.title} at {applicant.job.company.name}
        has been rejected. Thank you for your interest in our company."""
        send_mail(subject, body, email_from, recipient_list)
        return Response({"detail": "Application rejected"}, status=status.HTTP_200_OK)


class CreateJobPostView(APIView):
    def post(self, request, *args, **kwargs):
        company_id = request.data.get("company")

        if not company_id:
            return Response(
                {"error": "Company ID is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:

            serializer = JobPostCreateSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(company_id=company_id)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class JobApply(APIView):
    def post(self, request, id, username, *args, **kwargs):
        job = Job.objects.get(id=id)
        user = User.objects.get(username=username)
        existing_application = AppliedJobs.objects.filter(user=user, job=job).first()
        if existing_application:
            return Response(
                {"error": "You have already applied for this job."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        application = AppliedJobs.objects.create(
            user=user,
            job=job,
            status="applied",
        )
        serializers = ApplySerializer(application)

        return Response(
            {
                "message": "Application submitted successfully.",
                "application": serializers.data,
            },
            status=status.HTTP_201_CREATED,
        )