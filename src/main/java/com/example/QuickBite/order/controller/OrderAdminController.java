package com.example.QuickBite.order.controller;

import com.example.QuickBite.enums.OrderStatus;
import com.example.QuickBite.order.dto.OrderDetailsResponseDTO;
import com.example.QuickBite.order.dto.OrderResponseDTO;
import com.example.QuickBite.order.dto.UpdateOrderStatusRequestDTO;
import com.example.QuickBite.order.service.OrderService;
import lombok.Data;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@Data
@RestController
@RequestMapping("/admin")
public class OrderAdminController {

    private final OrderService orderService;

    public OrderAdminController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/orders")
    public List<OrderResponseDTO> getAllOrders()
    {
        return orderService.getAllOrders();
    }

    @GetMapping("/orders/{orderId}")
    public OrderDetailsResponseDTO getOrderByIdForAdmin(@PathVariable Long orderId)
    {
        return orderService.getOrdersById(orderId);
    }

    @PutMapping("/orders/{orderId}/status")
    public OrderResponseDTO updateOrderStatus(@PathVariable Long orderId, @RequestBody UpdateOrderStatusRequestDTO requestDTO) {
        return orderService.updateOrderStatus(orderId, requestDTO);
    }

    @GetMapping("/orders/status/{status}")
    public  List<OrderResponseDTO> findByOrderStatus(@PathVariable OrderStatus status)
    {
        return orderService.getOrdersByStatus(status);
    }
}
