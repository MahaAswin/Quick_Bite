package com.example.QuickBite.order.dto;

import com.example.QuickBite.enums.OrderStatus;
import com.example.QuickBite.order.repository.OrderItemRepository;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponseDTO {
    private Long id;
    private String tokenNumber;
    private Double totalAmount;
    private OrderStatus status;
    private LocalDateTime orderTime;
}
