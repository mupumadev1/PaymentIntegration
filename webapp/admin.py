from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from webapp.models import *

class CustmonUserAdmin(UserAdmin):
    list_display = ['username', 'password', 'role','cif','is_active']
    fieldsets = (
        (None, {'fields': ( 'password',)}),
        ('Personal info', {'fields': ('username', 'cif', )}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'fields': ( 'username', 'cif','role', 'password1', 'password2'),
        }),
    )
    search_fields = ( 'username',)
    ordering = ('username',)
    filter_horizontal = ('groups', 'user_permissions')


# Register your models here.
admin.site.register(BankDetails)
admin.site.register(Users,CustmonUserAdmin)