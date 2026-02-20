package com.ammas.pastries.service;

import com.ammas.pastries.dto.ReviewDTO;
import com.ammas.pastries.dto.ReviewRequest;
import com.ammas.pastries.entity.Product;
import com.ammas.pastries.entity.Review;
import com.ammas.pastries.entity.User;
import com.ammas.pastries.repository.ProductRepository;
import com.ammas.pastries.repository.ReviewRepository;
import com.ammas.pastries.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<ReviewDTO> getProductReviews(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(ReviewDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ReviewDTO createReview(Long userId, ReviewRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Check if user already reviewed this product
        if (reviewRepository.findByUserIdAndProductId(userId, request.getProductId()).isPresent()) {
            throw new RuntimeException("You have already reviewed this product");
        }
        
        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        
        Review savedReview = reviewRepository.save(review);
        
        // Update product rating
        updateProductRating(product);
        
        return ReviewDTO.fromEntity(savedReview);
    }
    
    @Transactional
    public ReviewDTO updateReview(Long reviewId, Long userId, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only update your own reviews");
        }
        
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        
        Review updatedReview = reviewRepository.save(review);
        
        // Update product rating
        updateProductRating(review.getProduct());
        
        return ReviewDTO.fromEntity(updatedReview);
    }
    
    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only delete your own reviews");
        }
        
        Product product = review.getProduct();
        reviewRepository.delete(review);
        
        // Update product rating
        updateProductRating(product);
    }
    
    private void updateProductRating(Product product) {
        Double avgRating = reviewRepository.calculateAverageRatingByProductId(product.getId());
        Long reviewCount = reviewRepository.countByProductId(product.getId());
        
        product.setRating(avgRating != null ? java.math.BigDecimal.valueOf(avgRating) : java.math.BigDecimal.valueOf(5.0));
        product.setReviewCount(reviewCount != null ? reviewCount.intValue() : 0);
        
        productRepository.save(product);
    }
}
