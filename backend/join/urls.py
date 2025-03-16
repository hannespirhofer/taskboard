from django.urls import path, include
from rest_framework.routers import DefaultRouter
from join.views import ContactViewset, LoginView, RegisterView, TokenValidationView, TaskViewset, SubTaskViewset


# Create API router and register subroutes
router = DefaultRouter()
router.register(r"contacts", ContactViewset)
router.register(r"tasks", TaskViewset)
router.register(r"subtasks", SubTaskViewset)

# Django URLpatterns: /api/
urlpatterns = [
    path("", include(router.urls)),
    path("login/", LoginView.as_view(), name="login"),
    path("register/", RegisterView.as_view(), name="login"),
    path("tokenvalidation/", TokenValidationView.as_view(), name="token-validation"),
    # path("test/", test_context_view, name="test-context"),
    # path("login/", LoginView.as_view(), name="login"),
    # path("logout/", LogoutView.as_view(), name="logout"),
    # path("register/", RegisterView.as_view(), name="register"),
    # path("members/", MembersList.as_view(), name="members"),
]
