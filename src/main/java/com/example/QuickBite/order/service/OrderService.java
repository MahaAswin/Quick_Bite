package com.example.QuickBite.order.service;

import com.example.QuickBite.enums.OrderStatus;
import com.example.QuickBite.order.dto.OrderResponseDTO;
import com.example.QuickBite.order.dto.PlaceOrderRequestDTO;
import com.example.QuickBite.order.entity.Order;

import java.util.List;

public interface OrderService {
    OrderResponseDTO placeOrder(PlaceOrderRequestDTO request);
    OrderResponseDTO getOrderById(Long id);
    List<OrderResponseDTO> getUserOrders();
    OrderResponseDTO updateOrderStatus(Long id,OrderStatus status);
    String generateToken();

}
