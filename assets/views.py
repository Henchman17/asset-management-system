from django.shortcuts import render

# Create your views here.
from django.db import transaction as db_transaction
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsAdminOrCustodian
from accounts.models import User
from assets.models import Asset, Category, Location
from assets.serializers import AssetSerializer, CategorySerializer, LocationSerializer

from transactions.models import Transaction
from transactions.action_serializers import CheckoutSerializer, ReturnSerializer, TransferSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all().order_by("name")
    serializer_class = LocationSerializer


class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all().order_by("-created_at")
    serializer_class = AssetSerializer

    # ✅ POST /api/assets/{id}/checkout/
    @action(detail=True, methods=["post"], permission_classes=[IsAdminOrCustodian])
    def checkout(self, request, pk=None):
        asset = self.get_object()

        if asset.status != Asset.Status.AVAILABLE:
            return Response(
                {"detail": "Asset must be AVAILABLE to checkout."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        assigned_to = User.objects.get(id=serializer.validated_data["assigned_to_id"])
        remarks = serializer.validated_data.get("remarks", "")

        with db_transaction.atomic():
            Transaction.objects.create(
                type=Transaction.Type.CHECKOUT,
                asset=asset,
                from_location=asset.current_location,
                to_location=asset.current_location,
                assigned_to=assigned_to,
                performed_by=request.user,
                remarks=remarks
            )
            asset.status = Asset.Status.ASSIGNED
            asset.save(update_fields=["status"])

        return Response({"detail": "Checked out successfully."}, status=status.HTTP_200_OK)

    # ✅ POST /api/assets/{id}/return/
    @action(detail=True, methods=["post"], permission_classes=[IsAdminOrCustodian])
    def return_asset(self, request, pk=None):
        asset = self.get_object()

        if asset.status != Asset.Status.ASSIGNED:
            return Response(
                {"detail": "Asset must be ASSIGNED to return."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ReturnSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        condition = serializer.validated_data["condition_on_return"]
        to_location_id = serializer.validated_data.get("to_location_id")
        remarks = serializer.validated_data.get("remarks", "")

        to_location = asset.current_location
        if to_location_id:
            to_location = Location.objects.get(id=to_location_id)

        # Business rule: if damaged -> REPAIR else AVAILABLE
        new_status = Asset.Status.AVAILABLE
        if condition in [Transaction.Condition.DAMAGED, Transaction.Condition.MISSING_PARTS]:
            new_status = Asset.Status.REPAIR

        with db_transaction.atomic():
            Transaction.objects.create(
                type=Transaction.Type.RETURN,
                asset=asset,
                from_location=asset.current_location,
                to_location=to_location,
                assigned_to=None,
                performed_by=request.user,
                condition_on_return=condition,
                remarks=remarks
            )
            asset.status = new_status
            asset.current_location = to_location
            asset.save(update_fields=["status", "current_location"])

        return Response(
            {"detail": f"Returned successfully. New status: {asset.status}"},
            status=status.HTTP_200_OK
        )

    # ✅ POST /api/assets/{id}/transfer/
    @action(detail=True, methods=["post"], permission_classes=[IsAdminOrCustodian])
    def transfer(self, request, pk=None):
        asset = self.get_object()

        if asset.status == Asset.Status.RETIRED:
            return Response(
                {"detail": "Cannot transfer a RETIRED asset."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = TransferSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        to_location = Location.objects.get(id=serializer.validated_data["to_location_id"])
        remarks = serializer.validated_data.get("remarks", "")

        if to_location.id == asset.current_location_id:
            return Response(
                {"detail": "Asset is already in that location."},
                status=status.HTTP_400_BAD_REQUEST
            )

        with db_transaction.atomic():
            Transaction.objects.create(
                type=Transaction.Type.TRANSFER,
                asset=asset,
                from_location=asset.current_location,
                to_location=to_location,
                assigned_to=None,
                performed_by=request.user,
                remarks=remarks
            )
            asset.current_location = to_location
            asset.save(update_fields=["current_location"])

        return Response({"detail": "Transferred successfully."}, status=status.HTTP_200_OK)
