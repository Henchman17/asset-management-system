from rest_framework import serializers
from assets.models import Location
from accounts.models import User
from transactions.models import Transaction

class CheckoutSerializer(serializers.Serializer):
    assigned_to_id = serializers.IntegerField()
    remarks = serializers.CharField(required=False, allow_blank=True)

    def validate_assigned_to_id(self, value):
        if not User.objects.filter(id=value).exists():
            raise serializers.ValidationError("assigned_to user not found.")
        return value


class ReturnSerializer(serializers.Serializer):
    condition_on_return = serializers.ChoiceField(choices=Transaction.Condition.choices)
    to_location_id = serializers.IntegerField(required=False)
    remarks = serializers.CharField(required=False, allow_blank=True)

    def validate_to_location_id(self, value):
        if not Location.objects.filter(id=value).exists():
            raise serializers.ValidationError("to_location not found.")
        return value


class TransferSerializer(serializers.Serializer):
    to_location_id = serializers.IntegerField()
    remarks = serializers.CharField(required=False, allow_blank=True)

    def validate_to_location_id(self, value):
        if not Location.objects.filter(id=value).exists():
            raise serializers.ValidationError("to_location not found.")
        return value
