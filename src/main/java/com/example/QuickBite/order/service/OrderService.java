package com.example.QuickBite.order.service;

import com.example.QuickBite.enums.OrderStatus;
import com.example.QuickBite.order.dto.OrderDetailsResponseDTO;
import com.example.QuickBite.order.dto.OrderResponseDTO;
import com.example.QuickBite.order.dto.PlaceOrderRequestDTO;
import com.example.QuickBite.order.dto.UpdateOrderStatusRequestDTO;

import java.util.List;

public interface OrderService {
    OrderResponseDTO placeOrder(PlaceOrderRequestDTO request);
    OrderDetailsResponseDTO getOrderById(Long id);
    List<OrderResponseDTO> getUserOrders();
    OrderResponseDTO updateOrderStatus(Long OrderId, UpdateOrderStatusRequestDTO requestDTO);
    String generateToken();
    OrderResponseDTO cancelOrder(Long id);

    List<OrderResponseDTO> getAllOrders();

    OrderDetailsResponseDTO getOrdersById(Long orderId);

    List<OrderResponseDTO> getOrdersByStatus(OrderStatus status);
}
