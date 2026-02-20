package com.ammas.pastries.dto;

import com.ammas.pastries.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private Long userId;
    private String userName;
    private BigDecimal totalPrice;
    private String status;
    private String deliveryAddress;
    private String deliveryCity;
    private String deliveryZip;
    private String deliveryPhone;
    private String deliveryNotes;
    private List<OrderItemDTO> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static OrderDTO fromEntity(Order order) {
        return OrderDTO.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .userName(order.getUser().getName())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus().name())
                .deliveryAddress(order.getDeliveryAddress())
                .deliveryCity(order.getDeliveryCity())
                .deliveryZip(order.getDeliveryZip())
                .deliveryPhone(order.getDeliveryPhone())
                .deliveryNotes(order.getDeliveryNotes())
                .items(order.getOrderItems().stream()
                        .map(OrderItemDTO::fromEntity)
                        .collect(Collectors.toList()))
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
