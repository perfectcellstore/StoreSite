'use client';

import React, { useState } from 'react';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import { useNotifications } from '@/lib/contexts/NotificationContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function NotificationBell() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return language === 'ar' ? 'الآن' : 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}${language === 'ar' ? ' د' : 'm'}`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}${language === 'ar' ? ' س' : 'h'}`;
    return `${Math.floor(seconds / 86400)}${language === 'ar' ? ' يوم' : 'd'}`;
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative overflow-visible hover:bg-bio-green-500/10 hover:text-bio-green-500"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-bio-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        align="end"
        className="w-80 md:w-96 bg-card border-border p-0 max-h-[500px] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-lg">
            {language === 'ar' ? 'الإشعارات' : 'Notifications'}
          </h3>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-bio-green-500 hover:text-bio-green-600"
            >
              <Check className="h-4 w-4 mr-1" />
              {language === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all read'}
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-[400px]">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>{language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer ${
                  !notification.read ? 'bg-bio-green-500/5' : ''
                }`}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification._id);
                  }
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {!notification.read && (
                        <span className="w-2 h-2 bg-bio-green-500 rounded-full"></span>
                      )}
                      <span className="font-semibold text-sm">
                        {language === 'ar' ? notification.titleAr || notification.title : notification.title}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? notification.messageAr || notification.message : notification.message}
                    </p>
                    <span className="text-xs text-muted-foreground mt-2 block">
                      {getTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification._id);
                    }}
                    className="h-8 w-8 p-0 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
