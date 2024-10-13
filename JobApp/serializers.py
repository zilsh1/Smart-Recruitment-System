from rest_framework import serializers
from .models import Company, CompanyUser, User, AppliedJobs, Job
from django.contrib.auth.hashers import make_password


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "role",
            "mobile",
            "address",
            "profile_image",
            "skills",
            "education",
            "exeperience",
            "resume",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        print(instance)
        password = validated_data.pop("password", None)
        if password:
            instance.password = make_password(password)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class ApplySerializer(serializers.ModelSerializer):
    class Meta:
        model = AppliedJobs
        fields = [
            "id",
            "user",
            "job",
            "status",
            "applied_date",
        ]


class AppliedJobsSerializer(serializers.ModelSerializer):
    company_name = serializers.SerializerMethodField()
    job_role = serializers.SerializerMethodField()

    class Meta:
        model = AppliedJobs
        fields = [
            "id",
            "status",
            "applied_date",
            "company_name",
            "job_role",
        ]

    def get_company_name(self, obj):
        return obj.job.company.name if obj.job and obj.job.company else None

    def get_job_role(self, obj):
        return obj.job.title if obj.job else None


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            "id",
            "name",
            "description",
            "logo",
            "website",
            "industry",
            "location",
            "posted_jobs",
        ]


class CompanyUserSerializer(serializers.ModelSerializer):
    company = CompanySerializer()

    class Meta:
        model = CompanyUser
        fields = ["email", "password", "company"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        company_data = validated_data.pop("company")
        company = Company.objects.create(**company_data)
        validated_data["company"] = company
        validated_data["password"] = make_password(validated_data["password"])
        return CompanyUser.objects.create(**validated_data)

    def update(self, instance, validated_data):
        if "password" in validated_data:
            validated_data["password"] = make_password(validated_data["password"])
        return super().update(instance, validated_data)


class JobPostSerializer(serializers.ModelSerializer):
    company = CompanySerializer()

    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "description",
            "company",
            "salary_range",
            "employment_type",
            "skills",
            "posted_by",
            "created_at",
            "deadline",
        ]
        read_only_fields = ["posted_by", "created_at"]
        extra_kwargs = {
            "deadline": {"required": False},
        }


class CompanyProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = [
            "id",
            "name",
            "location",
            "logo",
            "website",
            "description",
            "industry",
        ]


class JobAppliedForComapnySerializer(serializers.ModelSerializer):
    user = UserSerializer()
    job = JobPostSerializer()

    class Meta:
        model = AppliedJobs
        fields = ["id", "user", "job", "status", "applied_date"]


class JobPostCreateSerializer(serializers.ModelSerializer):
    company = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all())

    class Meta:
        model = Job
        fields = [
            "title",
            "description",
            "salary_range",
            "employment_type",
            "company",
            "skills",
            "posted_by",
            "created_at",
            "deadline",
        ]