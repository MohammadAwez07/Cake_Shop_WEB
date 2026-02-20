package com.ammas.pastries.service;

import com.ammas.pastries.dto.OrderDTO;
import com.ammas.pastries.dto.DashboardStatsDTO;
import com.ammas.pastries.dto.OrderRequest;
import com.ammas.pastries.entity.Order;
import com.ammas.pastries.entity.OrderItem;
import com.ammas.pastries.entity.Product;
import com.ammas.pastries.entity.User;
import com.ammas.pastries.repository.OrderRepository;
import com.ammas.pastries.repository.ProductRepository;
import com.ammas.pastries.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<OrderDTO> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(OrderDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(OrderDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return OrderDTO.fromEntity(order);
    }
    
    @Transactional
    public OrderDTO createOrder(Long userId, OrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Order order = new Order();
        order.setUser(user);
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setDeliveryCity(request.getDeliveryCity());
        order.setDeliveryZip(request.getDeliveryZip());
        order.setDeliveryPhone(request.getDeliveryPhone());
        order.setDeliveryNotes(request.getDeliveryNotes());
        order.setStatus(Order.OrderStatus.PENDING);
        
        BigDecimal totalPrice = BigDecimal.ZERO;
        
        for (OrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemRequest.getProductId()));
            
            if (product.getStock() < itemRequest.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
            
            // Update stock
            product.setStock(product.getStock() - itemRequest.getQuantity());
            productRepository.save(product);
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(product.getPrice());
            
            order.getOrderItems().add(orderItem);
            totalPrice = totalPrice.add(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
        }
        
        order.setTotalPrice(totalPrice);
        Order savedOrder = orderRepository.save(order);
        
        return OrderDTO.fromEntity(savedOrder);
    }
    
    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        
        order.setStatus(Order.OrderStatus.valueOf(status));
        Order updatedOrder = orderRepository.save(order);
        
        return OrderDTO.fromEntity(updatedOrder);
    }
    
    public DashboardStatsDTO getDashboardStats() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        
        Long totalOrders = orderRepository.count();
        BigDecimal totalRevenue = orderRepository.sumTotalPriceByCreatedAtAfter(thirtyDaysAgo);
        Long totalUsers = userRepository.count();
        Long totalProducts = productRepository.count();
        Long pendingOrders = orderRepository.countByStatus(Order.OrderStatus.PENDING);
        
        List<Object[]> statusCounts = orderRepository.countOrdersByStatus();
        java.util.Map<String, Long> ordersByStatus = statusCounts.stream()
                .collect(Collectors.toMap(
                        obj -> ((Order.OrderStatus) obj[0]).name(),
                        obj -> (Long) obj[1]
                ));
        
        List<Object[]> salesData = orderRepository.getSalesByDate(thirtyDaysAgo);
        java.util.Map<String, BigDecimal> salesByDate = salesData.stream()
                .collect(Collectors.toMap(
                        obj -> obj[0].toString(),
                        obj -> (BigDecimal) obj[1]
                ));
        
        return DashboardStatsDTO.builder()
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .totalUsers(totalUsers)
                .totalProducts(totalProducts)
                .pendingOrders(pendingOrders)
                .ordersByStatus(ordersByStatus)
                .salesByDate(salesByDate)
                .build();
    }
}
