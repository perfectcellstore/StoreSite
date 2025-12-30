'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Star, Trash2, EyeOff, Eye } from 'lucide-react';

export function ProductReviews({ productId, onReviewUpdate }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [productData, setProductData] = useState({ reviewCount: 0, averageRating: 0 });

  useEffect(() => {
    fetchReviews();
    fetchProductData();
  }, [productId]);

  const fetchProductData = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      if (data.product) {
        setProductData({
          reviewCount: data.product.reviewCount || 0,
          averageRating: data.product.averageRating || 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch product data:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`);
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!rating || !reviewText.trim() || !reviewerName.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide your name, rating, and review text',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: Number(rating),
          reviewText,
          reviewerName: reviewerName.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update product data with aggregate values from backend
        if (data.aggregateData) {
          setProductData({
            reviewCount: data.aggregateData.reviewCount,
            averageRating: data.aggregateData.averageRating
          });
        }
        
        toast({
          title: 'Review Submitted! ⭐',
          description: 'Thank you for your feedback'
        });
        
        setRating(0);
        setReviewText('');
        setReviewerName('');
        
        // Refresh reviews list and product data
        await Promise.all([
          fetchReviews(),
          fetchProductData()
        ]);
        
        // Notify parent component to refresh product data
        if (onReviewUpdate) {
          onReviewUpdate();
        }
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!user || user.role !== 'admin') return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/products/${productId}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast({
          title: 'Review Deleted',
          description: 'Review has been removed'
        });
        fetchReviews();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive'
      });
    }
  };

  const handleToggleVisibility = async (reviewId, currentlyHidden) => {
    if (!user || user.role !== 'admin') return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/products/${productId}/reviews/${reviewId}/toggle`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ hidden: !currentlyHidden })
      });

      if (response.ok) {
        toast({
          title: currentlyHidden ? 'Review Shown' : 'Review Hidden',
          description: currentlyHidden ? 'Review is now visible' : 'Review is now hidden'
        });
        fetchReviews();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update review visibility',
        variant: 'destructive'
      });
    }
  };

  const renderStars = (count, interactive = false, onClick = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              interactive ? 'cursor-pointer transition-colors' : ''
            } ${
              star <= (interactive ? (hoverRating || rating) : count)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
            onClick={interactive ? () => onClick(star) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          />
        ))}
      </div>
    );
  };

  const visibleReviews = reviews.filter(review => !review.hidden || (user && user.role === 'admin'));
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin h-8 w-8 border-4 border-bio-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-bio-green-500">{averageRating}</div>
          <div className="flex items-center justify-center mt-1">
            {renderStars(Math.round(averageRating))}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </div>
        </div>
      </div>

      {/* Write Review Form */}
      <Card className="bg-card/50 border-border/40">
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Your Name</Label>
            <Input
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Enter your name"
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            {renderStars(rating, true, setRating)}
          </div>

          <div className="space-y-2">
            <Label>Your Review</Label>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={4}
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">
              {reviewText.length}/500
            </div>
          </div>

          <Button
            onClick={handleSubmitReview}
            disabled={submitting || !rating || !reviewText.trim() || !reviewerName.trim()}
            className="w-full bg-bio-green-500 hover:bg-bio-green-600"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Customer Reviews</h3>
        {visibleReviews.length === 0 ? (
          <Card className="bg-card/50 border-border/40">
            <CardContent className="p-8 text-center text-muted-foreground">
              No reviews yet. Be the first to review this product!
            </CardContent>
          </Card>
        ) : (
          visibleReviews.map((review) => (
            <Card 
              key={review.id} 
              className={`bg-card/50 border-border/40 ${review.hidden ? 'opacity-50' : ''}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="font-semibold">{review.reviewerName}</div>
                      {renderStars(review.rating)}
                      {review.hidden && (
                        <span className="text-xs text-yellow-500 font-medium">
                          (Hidden)
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-2">{review.reviewText}</p>
                    <div className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  {/* Admin Controls */}
                  {user && user.role === 'admin' && (
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleVisibility(review.id, review.hidden)}
                        className="text-yellow-500 hover:text-yellow-600"
                      >
                        {review.hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
