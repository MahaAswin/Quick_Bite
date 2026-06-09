package com.example.QuickBite.order.dto;

import com.example.QuickBite.enums.OrderStatus;
import lombok.Data;

@Data
public class UpdateOrderStatusRequestDTO {
    private OrderStatus status;
}
