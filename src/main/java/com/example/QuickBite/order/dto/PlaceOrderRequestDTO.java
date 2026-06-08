package com.example.QuickBite.order.dto;

import lombok.Data;

import java.util.List;

@Data
public class PlaceOrderRequestDTO {
    private List<PlaceOrderItemDTO> items;
}
