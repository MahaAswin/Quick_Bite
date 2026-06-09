package com.example.QuickBite.order.controller;

import com.example.QuickBite.enums.OrderStatus;
import com.example.QuickBite.order.dto.OrderDetailsResponseDTO;
import com.example.QuickBite.order.dto.OrderResponseDTO;
import com.example.QuickBite.order.dto.PlaceOrderRequestDTO;
import com.example.QuickBite.order.entity.Order;
import com.example.QuickBite.order.service.OrderService;
import com.example.QuickBite.order.service.OrderServiceImpl;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/orders")
public class OrderController {


    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public OrderResponseDTO placeOrder(@RequestBody PlaceOrderRequestDTO request) {
        return orderService.placeOrder(request);

    }

    @GetMapping("/my-orders")
    public List<OrderResponseDTO> getUserOrders() {
        return orderService.getUserOrders();
    }

    @GetMapping("/{id}")
    public OrderDetailsResponseDTO getOrderById(@PathVariable Long id) {
        System.out.println("GET ORDER BY ID HIT: " + id);
        return orderService.getOrderById(id);
    }

    @PutMapping("/{id}/cancel")
    public OrderResponseDTO cancelOrder(@PathVariable Long id)
    {
        return orderService.cancelOrder(id);
    }

}
