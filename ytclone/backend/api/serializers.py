

from rest_framework import serializers
from .models import Video, Comment, Category
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    subscriber_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'subscriber_count']

    def get_subscriber_count(self, user):
        return user.subscribers.count()


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'


class VideoSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    likes = UserSerializer(many=True, read_only=True)
    watch_later = UserSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source='category', queryset=Category.objects.all(), write_only=True
    )
    category_name = serializers.CharField(source='category.name', read_only=True)

    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_in_watch_later = serializers.SerializerMethodField()
    is_subscribed = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = [
            'id', 'title', 'video', 'thumbnail', 'user',
            'category', 'category_id', 'category_name',
            'likes', 'likes_count',
            'watch_later', 'is_in_watch_later',
            'comments', 'comments_count',
            'uploaded_at', 'is_subscribed'
        ]

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_is_in_watch_later(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user in obj.watch_later.all()
        return False

    def get_is_subscribed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.user in request.user.subscribed_to.all()
        return False