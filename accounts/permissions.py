from rest_framework.permissions import BasePermission

ALLOWED_ROLES = {"ADMIN", "CUSTODIAN"}

class IsAdminOrCustodian(BasePermission):
    """
    Only ADMIN and CUSTODIAN can perform asset movements.
    Superusers are also allowed.
    """
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        # Superusers can do anything
        if user.is_superuser:
            return True
        # Check role for non-superusers
        return getattr(user, "role", None) in ALLOWED_ROLES
