package com.example.QuickBite.order.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItemResponseDTO {
    private Long id;
    private Integer quantity;
    private Double price;
    private Double subtotal;
    private String foodName ;
}
