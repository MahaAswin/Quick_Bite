package com.example.QuickBite.order.dto;

import lombok.Data;

@Data
public class OrderItemRequestDTO {
    private Long id;
    private Integer quantity;
    private Double price;
    private Double subtotal;
    private String foodName ;
}
