from django.contrib import admin
from .models import User, Company, Job, AppliedJobs, CompanyUser

# Register your models here.
admin.site.register(User)
admin.site.register(Company)
admin.site.register(Job)
admin.site.register(AppliedJobs)
admin.site.register(CompanyUser)
