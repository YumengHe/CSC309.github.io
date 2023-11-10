from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'username', 'password', 'email', 'first_name', 'last_name', "address", "role")
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def validate(self, data):
        # Check if it's a create operation
        if self.context['request'].method == 'POST':
            if data.get('role') not in ['seeker', 'shelter']:
                raise serializers.ValidationError("Role must be one of 'seeker' or 'shelter'")

            if data['role'] == "shelter" and data.get('address') is None:
                raise serializers.ValidationError("Shelter must have an address")

        # For update operations, apply the role validation only if role is included in the data
        else:
            if 'role' in data and data['role'] not in ['seeker', 'shelter']:
                raise serializers.ValidationError("Role must be one of 'seeker' or 'shelter'")

            if 'role' in data and data['role'] == "shelter" and data.get('address') is None:
                raise serializers.ValidationError("Shelter must have an address")

        return data

