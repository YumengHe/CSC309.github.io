from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'username', 'password', 'email', 'first_name', 'last_name', "address", "role", "profile_pic")
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def validate(self, data):
        errors = {}
        print("!!!data: ", data)

        # Check if it's a create operation
        if self.context['request'].method == 'POST':
            if data.get('role') not in ['seeker', 'shelter']:
                errors['role'] = "Role must be one of 'seeker' or 'shelter'"

            if data['role'] == "shelter" and data.get('address') is None:
                errors['address'] = "Shelter must have an address"

        # For update operations, apply the role validation only if role is included in the data
        else:
            if 'role' in data and data['role'] not in ['seeker', 'shelter']:
                errors['role'] = "Role must be one of 'seeker' or 'shelter'"

            if 'role' in data and data['role'] == "shelter" and data.get('address') is None:
                errors['address'] = "Shelter must have an address"

        # If there are any errors, raise them
        if errors:
            raise serializers.ValidationError(errors)

        return data

        def to_representation(self, instance):
                representation = super().to_representation(instance)
                # Assuming 'profile_pic' is the field name for the image
                if representation['profile_pic']:
                    representation['profile_pic'] = os.path.basename(representation['profile_pic'])
                return representation

