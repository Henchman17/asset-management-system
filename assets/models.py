from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)

    def __str__(self):
        return self.name

class Location(models.Model):
    name = models.CharField(max_length=120, unique=True)
    description = models.TextField(blank=True, default="")

    def __str__(self):
        return self.name

class Asset(models.Model):
    class Status(models.TextChoices):
        AVAILABLE = "AVAILABLE", "Available"
        ASSIGNED = "ASSIGNED", "Assigned"
        REPAIR = "REPAIR", "Under Repair"
        LOST = "LOST", "Lost"
        RETIRED = "RETIRED", "Retired"

    asset_tag = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="assets")
    serial_no = models.CharField(max_length=120, blank=True, null=True, unique=True)
    brand = models.CharField(max_length=120, blank=True, default="")
    model = models.CharField(max_length=120, blank=True, default="")

    unit_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    purchase_date = models.DateField(blank=True, null=True)
    warranty_end = models.DateField(blank=True, null=True)

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.AVAILABLE)
    current_location = models.ForeignKey(Location, on_delete=models.PROTECT, related_name="current_assets")
    notes = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.asset_tag} - {self.name}"

# Create your models here.
