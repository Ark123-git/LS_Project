


# from rest_framework import viewsets, permissions
# from rest_framework.decorators import api_view
# from rest_framework.authtoken.models import Token
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework.parsers import MultiPartParser, FormParser
# from django.contrib.auth.models import User
# from django.contrib.auth import authenticate

# from .models import Video, Comment, Category
# from .serializers import VideoSerializer, CommentSerializer, UserSerializer, CategorySerializer


# class VideoViewSet(viewsets.ModelViewSet):
#     queryset = Video.objects.all().order_by('-uploaded_at')
#     serializer_class = VideoSerializer
#     parser_classes = [MultiPartParser, FormParser]
#     permission_classes = [permissions.IsAuthenticatedOrReadOnly]

#     def get_queryset(self):
#         user_only = self.request.query_params.get('user_only')
#         search = self.request.query_params.get('search')

#         queryset = Video.objects.all().order_by('-uploaded_at')

#         if search:
#             queryset = queryset.filter(title__icontains=search)

#         if user_only and self.request.user.is_authenticated:
#             queryset = queryset.filter(user=self.request.user)

#         return queryset

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)


# class CategoryViewSet(viewsets.ModelViewSet):
#     queryset = Category.objects.all()
#     serializer_class = CategorySerializer


# @api_view(['POST'])
# def register_user(request):
#     username = request.data.get('username')
#     password = request.data.get('password')
#     if User.objects.filter(username=username).exists():
#         return Response({'error': 'Username already exists'})
#     user = User.objects.create_user(username=username, password=password)
#     token, _ = Token.objects.get_or_create(user=user)
#     return Response({
#         'token': token.key,
#         'id': user.id,
#         'username': user.username,
#     })


# @api_view(['POST'])
# def login_user(request):
#     username = request.data.get('username')
#     password = request.data.get('password')

#     user = authenticate(username=username, password=password)
#     if user:
#         token, created = Token.objects.get_or_create(user=user)
#         return Response({
#             'token': token.key,
#             'id': user.id,
#             'username': user.username,
#         })
#     return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


# @api_view(['POST'])
# def toggle_like(request, video_id):
#     video = Video.objects.get(id=video_id)
#     user = request.user
#     if user in video.likes.all():
#         video.likes.remove(user)
#     else:
#         video.likes.add(user)
#     return Response({'likes': video.likes.count()})



# @api_view(['POST'])
# def toggle_watch_later(request, video_id):
#     user = request.user
#     if not user.is_authenticated:
#         return Response({'error': 'Authentication required'}, status=401)

#     try:
#         video = Video.objects.get(id=video_id)
#     except Video.DoesNotExist:
#         return Response({'error': 'Video not found'}, status=404)

#     if user in video.watch_later.all():
#         video.watch_later.remove(user)
#         return Response({'watch_later': False})
#     else:
#         video.watch_later.add(user)
#         return Response({'watch_later': True})
    
# @api_view(['GET'])
# def get_watch_later(request):
#     if not request.user.is_authenticated:
#         return Response({'error': 'Not authenticated'}, status=401)
#     videos = request.user.watch_later_videos.all()
#     serializer = VideoSerializer(videos, many=True)
#     return Response(serializer.data)

# @api_view(['POST'])
# def add_comment(request, video_id):
#     video = Video.objects.get(id=video_id)
#     comment = Comment.objects.create(
#         user=request.user,
#         video=video,
#         text=request.data.get('text')
#     )
#     return Response(CommentSerializer(comment).data)

from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from .models import Video, Comment, Category
from .serializers import VideoSerializer, CommentSerializer, UserSerializer, CategorySerializer


class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all().order_by('-uploaded_at')
    serializer_class = VideoSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user_only = self.request.query_params.get('user_only')
        search = self.request.query_params.get('search')

        queryset = Video.objects.all().order_by('-uploaded_at')

        if search:
            queryset = queryset.filter(title__icontains=search)

        if user_only and self.request.user.is_authenticated:
            queryset = queryset.filter(user=self.request.user)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'})
    user = User.objects.create_user(username=username, password=password)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'id': user.id,
        'username': user.username,
    })


@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user:
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'id': user.id,
            'username': user.username,
        })
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_like(request, video_id):
    try:
        video = Video.objects.get(id=video_id)
    except Video.DoesNotExist:
        return Response({'error': 'Video not found'}, status=404)

    user = request.user
    if user in video.likes.all():
        video.likes.remove(user)
    else:
        video.likes.add(user)
    return Response({'likes': video.likes.count()})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_watch_later(request, video_id):
    try:
        video = Video.objects.get(id=video_id)
    except Video.DoesNotExist:
        return Response({'error': 'Video not found'}, status=404)

    user = request.user
    if user in video.watch_later.all():
        video.watch_later.remove(user)
        return Response({'watch_later': False})
    else:
        video.watch_later.add(user)
        return Response({'watch_later': True})


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_watch_later(request):
    videos = request.user.watch_later_videos.all()
    serializer = VideoSerializer(videos, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_comment(request, video_id):
    try:
        video = Video.objects.get(id=video_id)
    except Video.DoesNotExist:
        return Response({'error': 'Video not found'}, status=404)

    text = request.data.get('text')
    if not text:
        return Response({'error': 'Comment text required'}, status=400)

    comment = Comment.objects.create(
        user=request.user,
        video=video,
        text=text
    )
    return Response(CommentSerializer(comment).data)