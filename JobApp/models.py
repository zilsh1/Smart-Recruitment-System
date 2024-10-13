from django.db import models
from django.contrib.auth.hashers import make_password


# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    role = models.CharField(max_length=50, null=True)
    address = models.CharField(max_length=255, null=True)
    profile_image = models.ImageField(upload_to="profile_image", null=True)
    mobile = models.CharField(max_length=20, null=True, blank=True, unique=True)
    skills = models.CharField(max_length=255, null=True, blank=True)
    education = models.CharField(max_length=255, null=True, blank=True)
    exeperience = models.IntegerField(null=True, blank=True, default=0)
    resume = models.FileField(upload_to="resume/", blank=True, null=True)

    class Meta:
        db_table = "users"

    def getname(self):
        return self.username
    
    def __str__(self):
        return self.username


class Company(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    industry = models.CharField(max_length=255, null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    website = models.CharField(max_length=255, null=True, blank=True)
    logo = models.ImageField(upload_to="logo", null=True, blank=True)
    posted_jobs = models.IntegerField(default=0)

    class Meta:
        db_table = "company"

    def get_company_user(self):
        return CompanyUser.objects.get(company=self)

    def __str__(self):
        return self.name


class CompanyUser(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    company = models.OneToOneField(
        Company, on_delete=models.CASCADE, related_name="user"
    )

    def save(self, *args, **kwargs):
        # Hash the password before saving if it's not already hashed
        if self.password and not self.password.startswith("pbkdf2_sha256$"):
            self.password = make_password(self.password)
        super(CompanyUser, self).save(*args, **kwargs)

    def __str__(self):
        return self.email


class Job(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    salary_range = models.CharField(max_length=255, null=True, blank=True)
    employment_type = models.CharField(max_length=255, null=True, blank=True)
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="postJob", null=True
    )
    skills = models.CharField(max_length=100)
    posted_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title


class AppliedJobs(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="applied_jobs", null=True
    )
    job = models.ForeignKey(
        Job, on_delete=models.CASCADE, related_name="applied_jobs", null=True
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ("applied", "Applied"),
            ("under_review", "Under Review"),
            ("interviewed", "Interviewed"),
            ("rejected", "Rejected"),
            ("hired", "Hired"),
            ("Approved", "approved"),
        ],
        default="applied",
    )
    applied_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.job} at {self.job.company.name} - {self.status}"

    class Meta:
        ordering = ["-applied_date"]
