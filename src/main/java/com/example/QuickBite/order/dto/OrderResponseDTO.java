package com.example.QuickBite.order.dto;

import com.example.QuickBite.enums.OrderStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderResponseDTO {
    private Long id;
    private String tokenNumber;
    private Double totalAmount;
    private OrderStatus status;
}
