from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VideoViewSet, CategoryViewSet, register_user, login_user, toggle_like, toggle_watch_later, add_comment,get_watch_later
from .views import toggle_subscribe
router = DefaultRouter()
router.register(r'videos', VideoViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register_user),
    path('login/', login_user),
    path('videos/<int:video_id>/like/', toggle_like),
    path('videos/<int:video_id>/watchlater/', toggle_watch_later),
    path('videos/<int:video_id>/comment/', add_comment),
    path('watchlater/', get_watch_later),
    
    
    path('videos/<int:video_id>/subscribe/', toggle_subscribe, name='toggle_subscribe'),
]