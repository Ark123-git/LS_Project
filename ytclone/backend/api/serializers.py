

from rest_framework import serializers
from .models import Video, Comment, Category
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'

# class VideoSerializer(serializers.ModelSerializer):
#     user = UserSerializer(read_only=True)
#     likes = UserSerializer(many=True, read_only=True)
#     watch_later = UserSerializer(many=True, read_only=True)
#     comments = CommentSerializer(many=True, read_only=True)
#     category = CategorySerializer(read_only=True)
#     category_id = serializers.PrimaryKeyRelatedField(source='category', queryset=Category.objects.all(), write_only=True)
#     category_name = serializers.CharField(source='category.name', read_only=True)
#     # video_url = serializers.SerializerMethodField()
#     likes_count = serializers.SerializerMethodField()
#     comments_count = serializers.SerializerMethodField()

#     class Meta:
#         model = Video
#         fields = [
#             # 'id', 'title', 'video', 'video_url', 'user', 'category', 'category_id',
#             # 'likes', 'watch_later', 'comments',
#             # 'likes_count', 'comments_count', 'uploaded_at'
#             '__all__'
#         ]

#     # def get_video_url(self, obj):
#     #     request = self.context.get('request')
#     #     if request:
#     #         return request.build_absolute_uri(obj.video.url)
#     #     return obj.video.url

#     def get_likes_count(self, obj):
#         return obj.likes.count()

#     def get_comments_count(self, obj):
#         return obj.comments.count()
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

    class Meta:
        model = Video
        fields = [
            'id', 'title', 'video', 'thumbnail', 'user',
            'category', 'category_id', 'category_name',
            'likes', 'likes_count',
            'watch_later', 'comments', 'comments_count',
            'uploaded_at'
        ]

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()