from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Video(models.Model):
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    # title = models.CharField(max_length=255)
    # description = models.TextField(blank=True)
    # video = models.FileField(upload_to='videos/')
    # uploaded_at = models.DateTimeField(auto_now_add=True)
    # category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    # tags = models.CharField(max_length=255, blank=True)
    # likes = models.ManyToManyField(User, related_name='liked_videos', blank=True)
    # watch_later = models.ManyToManyField(User, related_name='watch_later_videos', blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    video = models.FileField(upload_to='videos/')
    thumbnail = models.ImageField(upload_to='thumbnails/', null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    likes = models.ManyToManyField(User, related_name='liked_videos', blank=True)
    watch_later = models.ManyToManyField(User, related_name='watch_later_videos', blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    subscribers = models.ManyToManyField(User, related_name='subscribed_videos', blank=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} on {self.video.title}"

