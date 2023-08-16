"""
WSGI config for PaymentIntegration project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
import environ

environ.Env.read_env()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'PaymentIntegration.settings')

application = get_wsgi_application()
