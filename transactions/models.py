from django.db import models
from django.conf import settings
from assets.models import Asset, Location

class Transaction(models.Model):
    class Type(models.TextChoices):
        CHECKOUT = "CHECKOUT", "Checkout"
        RETURN = "RETURN", "Return"
        TRANSFER = "TRANSFER", "Transfer"
        REPAIR = "REPAIR", "Repair"
        RETIRE = "RETIRE", "Retire"

    class Condition(models.TextChoices):
        GOOD = "GOOD", "Good"
        DAMAGED = "DAMAGED", "Damaged"
        MISSING_PARTS = "MISSING_PARTS", "Missing Parts"

    type = models.CharField(max_length=20, choices=Type.choices)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name="transactions")

    from_location = models.ForeignKey(Location, on_delete=models.PROTECT, related_name="from_transactions", null=True, blank=True)
    to_location = models.ForeignKey(Location, on_delete=models.PROTECT, related_name="to_transactions", null=True, blank=True)

    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="assigned_transactions", null=True, blank=True)
    performed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="performed_transactions")

    condition_on_return = models.CharField(max_length=20, choices=Condition.choices, null=True, blank=True)
    remarks = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} - {self.asset.asset_tag} @ {self.created_at}"

